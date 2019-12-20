import WebSocket from 'ws'

export interface WSEvent {
    op: number
    d: any
    t?: string
    s?: number
}

export default () => {
    const ws = new WebSocket(process.env.PORTALS_WS_URL)

    ws.addEventListener('open', (event) => console.log('Connected to @cryb/portals via WS: ', event))
    ws.addEventListener('close', (event) => console.log('Disconnected from @cryb/portals WS: ', event))
    ws.addEventListener('error', error => console.error('Error during WS connection to @cryb/portals: ', error))
    
    return ws
}
