import VirtualBrowser from './browser'
import PortalsClient from './clients/portals.client'

import config from './config'

new PortalsClient(
	new VirtualBrowser(config.width, config.height, config.bitDepth)
)

console.log(require('fs').readFileSync('logo.txt', 'utf8'))