import { Client, Message } from '@cryb/mesa'

import VirtualBrowser from '../browser'

import { signToken } from '../utils/generate.utils'
import { fetchPortalId } from '../utils/helpers.utils'
import createWebSocket, { WSEvent } from '../config/websocket.config'

const CONTROLLER_EVENT_TYPES = ['KEY_DOWN', 'KEY_UP', 'PASTE_TEXT', 'MOUSE_MOVE', 'MOUSE_SCROLL', 'MOUSE_DOWN', 'MOUSE_UP']

export default class WRTCClient {
    peers: Map<string, any>

    mesa: Client
    browser: VirtualBrowser

    constructor(browser: VirtualBrowser) {
        this.peers = new Map()
        this.browser = browser

        browser.init().then(this.setupMesa)
    }

    setupMesa = () => {
        const client = new Client(process.env.PORTALS_WS_URL)

        client.on('connected', () => {
            this.emitBeacon()
        })

        client.on('message', message => {
            this.handleMessage(message)
        })

        client.on('disconnected', () => {
            console.log('Disconnected from @cryb/portals, reconnecting...')
        })

        client.on('error', error => {
            console.log('Error during connection to @cryb/portals', error)
        })
    }

    emitBeacon = () => {
        console.log('emitting beacon to portals server')

        const id = fetchPortalId(), token = signToken({ id }, process.env.PORTALS_KEY)
        this.mesa.send(new Message(2, { token, type: 'portal' }))
    }
    
    handleMessage = (message: Message) => {
        const { opcode, data, type } = message

        if(opcode === 0)
            if(CONTROLLER_EVENT_TYPES.indexOf(type) > -1)
                this.browser.handleControllerEvent(data, type)
    }
}
