import os from 'os'
import { argv } from 'yargs'

export const fetchPortalId = () => {
    if(argv.portalId) return argv.portalId as string

    return os.hostname().split('-')[1] as string
}