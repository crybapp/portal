import fs from 'fs'
import VirtualBrowser from './browser'
import PortalsClient from './clients/portals.client'

import config from './config'

new PortalsClient(
  new VirtualBrowser(
    config.width,
    config.height,
    config.videoBitrate,
    config.videoFps,
    config.audioBitrate,

    config.startupUrl,

    config.bitDepth
  )
)

console.log(fs.readFileSync('logo.txt', 'utf8'))
