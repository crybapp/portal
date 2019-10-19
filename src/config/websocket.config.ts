import WebSocket from 'ws'

export interface WSEvent {
    op: number
    d: any
    t?: string
    s?: number
}

export default () => {
    const ws = new WebSocket(process.env.PORTALS_WS_URL)

    ws.addEventListener('open', () => console.log('Connected to @cryb/portals via WS'))
    ws.addEventListener('close', () => console.log('Disconnected from @cryb/portals WS'))
    ws.addEventListener('error', error => console.error('Error during WS connection to @cryb/portals: ', error))
    
    return ws
}
