import { processExists } from 'process-exists'
import { convertKey } from '../utils/keyboard.utils'
import { xvfb, pulseaudio, openbox, chromium, xdotool, janusStream } from './utils'
import type { Writable } from 'stream'
import type { Controller } from '../models/controller'

export default class VirtualBrowser {
  width: number
  height: number
  videoBitrate: string
  videoFps: string
  videoPort: number
  videoRtcpPort: number
  audioBitrate: string
  audioPort: number
  audioRtcpPort: number
  startupUrl: string
  streamingIp: string
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
    this.env = { DISPLAY: `:${Date.now().toString().slice(-3)}`, ...process.env }
  }

  init = () : void => {
    console.log('Setting up xvfb...')
    xvfb(this.env, this.width, this.height, this.bitDepth)
    console.log('Setting up pulseaudio...')
    pulseaudio(this.env)

    console.log('Setting up openbox...')
    openbox(this.env)
    console.log('Setting up xdotool...')
    const { stdin: xdoin } = xdotool(this.env)
    this.xdoin = xdoin

    console.log('Setting up chromium...')
    this.setupChromium()
  }

  setupStream = () : void => {
    janusStream(
      this.env,
      this.videoPort,
      this.videoRtcpPort,
      this.audioPort,
      this.audioRtcpPort,
      this.videoFps,
      this.videoBitrate,
      this.audioBitrate,
      this.streamingIp
    ).on('close', () => setTimeout(this.streamCheck, 500))
  }

  // ToDo: Add a communication to the portals WS that the portal is stopping (closed the browser),
  // then stop it after Chromium is closed for a normal shutdown.
  private setupChromium = () : void => { chromium(this.env, this.startupUrl)
    .on('close', () => setTimeout(this.browserCheck, 2000)) }

  private streamCheck = async () : Promise<void> => {
    if (await processExists('gst-launch-1.0'))
      return console.log('gstreamer running. Not restarting.')

    console.log('gstreamer has suddenly stopped - attempting a restart')
    this.setupStream()
  }

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

      return `key${pressType.toLowerCase()} --clearmodifiers --delay 0 '${convertKey(key, { ctrl, shift })}`
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
        return `click --clearmodifiers ${scrollUp ? '5' : '4'}`
      }
      return null
    }
    case 'PASTE': {
      // I am supposing this is 'PASTE_TEXT'. ToDo change appropriately
      const { text } = data

      return `type --clearmodifiers --delay 0 ${text}`
    }
    }
  }
}
