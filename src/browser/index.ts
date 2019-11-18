import { convertKeyCode } from '../utils/keyboard.utils'
import { xvfb, pulseaudio, openbox, chromium, ffmpeg, ffmpegaudio, xdotool } from './utils'

import { signToken } from '../utils/generate.utils'
import { fetchPortalId } from '../utils/helpers.utils'

export default class VirtualBrowser {
    width: number
    height: number
    videoBitrate: string
    videoFps: string
    audioBitrate: string
    startupUrl: string
    bitDepth: number
    env: NodeJS.ProcessEnv

    xdoin: any
    input: object

    constructor(width: number, height: number, videoBitrate: string, videoFps: string, audioBitrate: string, startupUrl: string, bitDepth: number) {
        this.width = width
        this.height = height
        this.videoBitrate = videoBitrate
        this.videoFps = videoFps
        this.audioBitrate = audioBitrate
        this.startupUrl = startupUrl
        this.bitDepth = bitDepth
        this.env = process.env
    }

    init = () => new Promise((resolve, reject) => {
        const { env } = this

        try {
            console.log('Setting up xvfb...')
            xvfb(env, this.width, this.height, this.bitDepth)
            if (process.env.AUDIO_ENABLED !== 'false') {
                console.log('Setting up pulseaudio...')
                pulseaudio(env)
            }

            console.log('Setting up openbox...')
            openbox(env)
            console.log('Setting up chromium...')
            this.setupChromium()

            console.log('Setting up ffmpeg...')
            this.setupFfmpeg()
            if (process.env.AUDIO_ENABLED !== 'false')
                this.setupFfmpegAudio()

            console.log('Setting up xdotool...')
            const { stdin: xdoin } = xdotool(env)
            this.xdoin = xdoin

            resolve()
        } catch(error) {
            reject(error)
        }
    })

    private setupFfmpeg = () => {
        ffmpeg(this.env, signToken({ id: fetchPortalId() }, this.env.STREAMING_KEY || this.env.APERTURE_KEY),
                this.width, this.height, this.videoFps, this.videoBitrate).on('close', () => {
                    console.log('ffmpeg has suddenly stopped - attempting a restart')
                    setTimeout(this.setupFfmpeg, 1000)
                })
    }
    private setupFfmpegAudio = () => {
        ffmpegaudio(this.env, signToken({ id: fetchPortalId() }, this.env.STREAMING_KEY || this.env.APERTURE_KEY),
                    this.audioBitrate).on('close', () => {
                        console.log('ffmpeg audio has suddenly stopped - attempting a restart')
                        setTimeout(this.setupFfmpegAudio, 1000)
                    })
    }

    // ToDo: Add a communication to the portals WS that the portal is stopping (closed the browser),
    // then stop it after Chromium is closed for a normal shutdown.
    private setupChromium = () => chromium(this.env, this.width, this.height, this.startupUrl).on('close', this.setupChromium)

    handleControllerEvent = (data: any, type: string) => {
        const command = this.fetchCommand(data, type)
        if(!command || !this.xdoin) return
        if(!this.xdoin.writable) this.xdoin = xdotool(this.env).stdin

        this.xdoin.write(`${command}\n`)
    }

    private fetchCommand = (data: any, type: string) => {
        const typeHeader = type.split('_')[0]

        if(typeHeader === 'KEY') {
            const pressType = type.split('_')[1].toLowerCase(),
                { keyCode, ctrlKey: ctrl, shiftKey: shift } = data

            return `key${pressType} '${convertKeyCode(keyCode, { ctrl, shift })}'`
        } else if(type === 'PASTE_TEXT') {
            const { text } = data as { text: string }
            console.log('paste', text)

            return null
        } else if(type === 'MOUSE_SCROLL') {
            const { scrollUp } = data

            return `key ${scrollUp ? 'Down' : 'Up'}`
        } else if(typeHeader === 'MOUSE') {
            const { x, y } = data
            let { button } = data

            if(type === 'MOUSE_MOVE')
                return `mousemove ${x} ${y}`
            else if(type === 'MOUSE_DOWN')
                return `mousedown ${button}`
            else if(type === 'MOUSE_UP')
                return `mouseup ${button}`
            else return null
        } else return null
    }
}
