import os from 'os'
import { argv } from 'yargs'

export const fetchPortalId = () => {
    if(argv.portalId) return argv.portalId as string

    const machineId = os.hostname().split('-')[1]
    if(!machineId) return os.hostname() as string
    
    return machineId as string
}
