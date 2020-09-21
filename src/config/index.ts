import 'dotenv/config'
import fs from 'fs'
import { verifyEnv } from '../utils/verifications.utils'

if (process.env.NODE_ENV === 'production') {
  // Security measure: Delete .env file, ignore silently
  // eslint-disable-next-line
  fs.unlink('.env', err => {})
}

verifyEnv('PORTALS_WS_URL', 'PORTALS_KEY', 'STREAMING_URL')

export default {
  width: parseInt(process.env.VIDEO_WIDTH) || 720,
  height: parseInt(process.env.VIDEO_HEIGHT) || 480,
  videoBitrate: process.env.VIDEO_BITRATE || '1200k',
  videoFps: process.env.VIDEO_FPS || '30',
  audioBitrate: process.env.AUDIO_BITRATE || '128k',

  startupUrl: process.env.STARTUP_URL || 'https://start.duckduckgo.com',

  bitDepth: 24
}
