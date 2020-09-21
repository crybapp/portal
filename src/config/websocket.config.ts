import WebSocket from 'ws'

export interface IWSEvent {
  op: number
  d: Record<string, unknown>
  t?: string
  s?: number
}

export default () : WebSocket => {
  const ws = new WebSocket(process.env.PORTALS_WS_URL)

  ws.addEventListener('open', () => console.log('Connected to @cryb/portals via WS'))
  ws.addEventListener('close', () => console.log('Disconnected from @cryb/portals WS'))
  ws.addEventListener('error', error => console.error('Error during WS connection to @cryb/portals: ', error))

  return ws
}
