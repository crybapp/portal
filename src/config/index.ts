import dotenv from 'dotenv'
dotenv.config()

import { verifyEnv } from '../utils/verifications.utils'

verifyEnv('PORTALS_WS_URL', 'PORTALS_KEY', 'STREAMING_URL', 'STREAMING_KEY')

export default {
	width: parseInt(process.env.VIDEO_WIDTH) || 720,
	height: parseInt(process.env.VIDEO_HEIGHT) || 480,
	videoBitrate: process.env.VIDEO_BITRATE || '1200k',
	videoFps: process.env.VIDEO_FPS || '30',
	audioBitrate: process.env.AUDIO_BITRATE || '128k',

	startupUrl: process.env.STARTUP_URL || 'https://start.duckduckgo.com',

	bitDepth: 24
}
