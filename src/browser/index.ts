import { processExists } from 'process-exists'
import { Controller } from '../models/controller'
import { convertKey } from '../utils/keyboard.utils'
import { xvfb, pulseaudio, openbox, chromium, xdotool, janusVideo, janusAudio, apertureVideo, apertureAudio } from './utils'
import { signToken } from '../utils/generate.utils'
import { fetchPortalId } from '../utils/helpers.utils'
import { Writable } from 'stream'

export default class VirtualBrowser {
  width: number
  height: number
  videoBitrate: string
  videoFps: string
  videoPort: number
  audioBitrate: string
  audioPort: number
  startupUrl: string
  streamingIp: string
  janusEnabled: boolean
  bitDepth: number
  env: NodeJS.ProcessEnv
  xdoin: Writable

  constructor(width: number, height: number, videoBitrate: string, videoFps: string, audioBitrate: string, startupUrl: string, bitDepth: number) {
    this.width = width
    this.height = height
    this.videoBitrate = videoBitrate
    this.videoFps = videoFps
    this.audioBitrate = audioBitrate
    this.startupUrl = startupUrl
    this.bitDepth = bitDepth
    this.env = { ...process.env, DISPLAY: ':100' }
  }

  init = () : void => {
    console.log('Setting up xvfb...')
    xvfb(this.env, this.width, this.height, this.bitDepth)
    if (process.env.AUDIO_ENABLED !== 'false') {
      console.log('Setting up pulseaudio...')
      pulseaudio(this.env)
    }

    console.log('Setting up openbox...')
    openbox(this.env)
    console.log('Setting up xdotool...')
    const { stdin: xdoin } = xdotool(this.env)
    this.xdoin = xdoin

    console.log('Setting up chromium...')
    this.setupChromium()
  }

  setupVideo = () : void => {
    if (this.janusEnabled) {
      janusVideo(
        this.env,
        this.videoPort,
        this.width,
        this.height,
        this.videoFps,
        this.videoBitrate,
        this.streamingIp
      ).on('close', () => {
        console.log('gstreamer has suddenly stopped - attempting a restart')
        setTimeout(this.setupVideo, 1000)
      })
    } else {
      apertureVideo (
        this.env,
        signToken({ id: fetchPortalId() }, this.env.STREAMING_KEY || this.env.APERTURE_KEY),
        this.width,
        this.height,
        this.videoFps,
        this.videoBitrate
      ).on('close', () => {
        console.log('ffmpeg has suddenly stopped - attempting a restart')
        setTimeout(this.setupVideo, 1000)
      })
    }
  }

  setupAudio = () : void => {
    if (this.janusEnabled) {
      janusAudio(
        this.env,
        this.audioPort,
        this.audioBitrate,
        this.streamingIp,
      ).on('close', () => {
        console.log('gstreamer audio has suddenly stopped - attempting a restart')
        setTimeout(this.setupAudio, 1000)
      })
    } else {
      apertureAudio(
        this.env,
        signToken({ id: fetchPortalId() }, this.env.STREAMING_KEY || this.env.APERTURE_KEY),
        this.audioBitrate
      ).on('close', () => {
        console.log('ffmpeg audio has suddenly stopped - attempting a restart')
        setTimeout(this.setupAudio, 1000)
      })
    }
  }

  // ToDo: Add a communication to the portals WS that the portal is stopping (closed the browser),
  // then stop it after Chromium is closed for a normal shutdown.
  private setupChromium = () : void => { chromium(this.env, this.startupUrl)
    .on('close', () => setTimeout(this.browserCheck, 2000)) }

  private browserCheck = async () : Promise<void> => {
    if (await processExists('chromium-browser'))
      return console.log('Browser running. Not restarting.')

    this.setupChromium()
  }

  handleControllerEvent = (data: Controller, type: string) : void => {
    const command = this.fetchCommand(data, type)
    if (!command)
      return
    if (!this.xdoin.writable)
      this.xdoin = xdotool(this.env).stdin

    this.xdoin.write(`${command}\n`)
  }

  private fetchCommand = (data: Controller, type: string) : string | null => {
    const typeHeader = type.split('_')[0]
    const pressType = type.split('_')[1]

    switch (typeHeader) {
    case 'KEY': {
      const { key, ctrlKey: ctrl, shiftKey: shift } = data

      return `key${pressType.toLowerCase()} --clearmodifiers '${convertKey(key, { ctrl, shift })}`
    }
    case 'MOUSE': {
      const { x, y, button, scrollUp } = data

      switch (pressType) {
      case 'MOVE':
        return `mousemove ${x} ${y}`
      case 'UP':
        return `mouseup --clearmodifiers ${button}`
      case 'DOWN':
        return `mousedown --clearmodifiers ${button}`
      case 'SCROLL':
        return `key --clearmodifiers ${scrollUp ? 'Down' : 'Up'}`
      }
      return null
    }
    case 'PASTE': {
      // I am supposing this is 'PASTE_TEXT'. ToDo change appropriately
      const { text } = data

      return `type --clearmodifiers ${text}`
    }
    }
  }
}
