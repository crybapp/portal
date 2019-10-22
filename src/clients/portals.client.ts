import WebSocket from 'ws'
import VirtualBrowser from '../browser'

import { signToken } from '../utils/generate.utils'
import createWebSocket, { WSEvent } from '../config/websocket.config'

const CONTROLLER_EVENT_TYPES = ['KEY_DOWN', 'KEY_UP', 'PASTE_TEXT', 'MOUSE_MOVE', 'MOUSE_SCROLL', 'MOUSE_DOWN', 'MOUSE_UP']

export default class WRTCClient {
    peers: Map<string, any>
    browser: VirtualBrowser
    websocket: WebSocket

    constructor(browser: VirtualBrowser) {
        this.peers = new Map()
        this.browser = browser

        browser.init().then(this.setupWebSocket)
    }

    setupWebSocket = () => {
        const websocket = createWebSocket()
        this.websocket = websocket

        websocket.addEventListener('open', () => {
            this.emitBeacon()
        })

        websocket.addEventListener('message', ({ data }) => {
            let json: any

            try {
                json = JSON.parse(data.toString())
            } catch(error) {
                return console.error(error)
            }

            this.handleMessage(json)
        })

        websocket.addEventListener('close', () => {
            this.websocket = null

            console.log('Attempting reconnect to @cryb/portals via WS')
            setTimeout(this.setupWebSocket, 2500)
        })
    }

    emitBeacon = () => {
        console.log('emitting beacon to portals server')

        const token = signToken({}, process.env.PORTALS_KEY)
        this.send({ op: 2, d: { token, type: 'server' } })
    }
    
    handleMessage = (message: WSEvent) => {
        const { op, d, t } = message

        if(op === 0)
            if(CONTROLLER_EVENT_TYPES.indexOf(t) > -1)
                this.browser.handleControllerEvent(d, t)
    }

    send = (object: WSEvent) => this.websocket.send(JSON.stringify(object))
}
