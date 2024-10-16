import os from 'os'
import yargs from 'yargs'

export const fetchPortalId = () : string => {
  const { argv } = yargs(process.argv)
  if (argv['portalId']) return argv['portalId'] as string

  const machineId = os.hostname().split('-')[1]
  if (!machineId) return os.hostname()

  return machineId
}
