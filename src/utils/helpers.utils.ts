import { hostname as _hostname } from 'os'

export const fetchHostname = () => {
    const hostname = _hostname()
    if(!hostname) return null

    const parts = hostname.split('-')
    if(parts[0] !== 'cryb_portal') return null

    return hostname
}