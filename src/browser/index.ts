import { convertKeyCode } from '../utils/keyboard.utils'
import { xvfb, dbus, openbox, xdotool, chromium, ffmpeg, ffmpegaudio } from './utils'

import { signToken } from '../utils/generate.utils'
import { fetchPortalId } from '../utils/helpers.utils'

export default class VirtualBrowser {
    width: number
    height: number
    bitDepth: number
    env: NodeJS.ProcessEnv

    xdoin: any
    input: object

    constructor(width: number, height: number, bitDepth: number) {
        this.width = width
        this.height = height
        this.bitDepth = bitDepth
        this.env = {...process.env, DISPLAY: ':100'}
    }

    init = () => new Promise((resolve, reject) => {
        const { env } = this

        try {
            console.log('setting up dbus...')
            dbus(env)
            console.log('setting up xvfb...')
            xvfb(env, this.width, this.height, this.bitDepth)

            console.log('setting up openbox...')
            openbox(env)
            console.log('setting up chromium...')
            this.setupChromium()

            console.log('setting up ffmpeg...')
            const id = fetchPortalId(), token = signToken({ id }, 'aperture')
            ffmpeg(env, token, this.width, this.height)
            ffmpegaudio(env, token)

            console.log('setting up xdotool...')
            const { stdin: xdoin } = xdotool(env)
            this.xdoin = xdoin

            resolve()
        } catch(error) {
            reject(error)
        }
    })

    private setupChromium = () => chromium(this.env).on('close', this.setupChromium)

    handleControllerEvent = (data: any, type: string) => {
        const command = this.fetchCommand(data, type)
        if(!command) return
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
            // exec(`pbcopy "${text}"`)
            // return 'keypress ctrl+v'
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