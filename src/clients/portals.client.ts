import WebSocket from 'ws'
import VirtualBrowser from '../browser'

import createWebSocket, { IWSEvent } from '../config/websocket.config'
import { signToken } from '../utils/generate.utils'
import { fetchPortalId } from '../utils/helpers.utils'

const CONTROLLER_EVENT_TYPES = ['KEY_DOWN', 'KEY_UP', 'PASTE_TEXT', 'MOUSE_MOVE', 'MOUSE_SCROLL', 'MOUSE_DOWN', 'MOUSE_UP']

export default class WRTCClient {
	public peers: Map<string, any>
	public browser: VirtualBrowser
	public websocket: WebSocket

	constructor(browser: VirtualBrowser) {
		this.peers = new Map()
		this.browser = browser

		browser.init().then(this.setupWebSocket)
	}

	public setupWebSocket = () => {
		const websocket = createWebSocket()
		this.websocket = websocket

		websocket.addEventListener('open', () => {
			this.emitBeacon()
		})

		websocket.addEventListener('message', ({ data }) => {
			let json: any

			try {
				json = JSON.parse(data.toString())
			} catch (error) {
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

	public emitBeacon = () => {
		console.log('emitting beacon to portals server')

		const id = fetchPortalId(), token = signToken({ id }, process.env.PORTALS_KEY)
		this.send({ op: 2, d: { token, type: 'portal' } })
	}

	public handleMessage = (message: IWSEvent) => {
		const { op, d, t } = message

		if (op === 0 && CONTROLLER_EVENT_TYPES.indexOf(t) > -1)
			this.browser.handleControllerEvent(d, t)
		else if (op === 10) {
			if (!d.audioport || !d.videoport || !d.janusAddress)
				return

			this.browser.audioPort = d.audioport
			this.browser.videoPort = d.videoport
			this.browser.janusEnabled = true
			this.browser.streamingIp = process.env.STREAMING_URL

			this.setupBrowser()
		}
		else if (op === 20) {
			this.browser.videoPort = d.aperturePort
			this.browser.audioPort = d.aperturePort
			this.browser.janusEnabled = false

			this.setupBrowser()
		}
	}

	setupBrowser = () => {
		this.browser.setupVideo()
		if (process.env.AUDIO_ENABLED !== 'false')
			this.browser.setupAudio()
	}

	public send = (object: IWSEvent) => this.websocket.send(JSON.stringify(object))
}
