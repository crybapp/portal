require('dotenv').config();

export default {
    width: parseInt(process.env.VIDEO_WIDTH) || 720,
    height: parseInt(process.env.VIDEO_HEIGHT) || 480,
    videoBitrate: process.env.VIDEO_BITRATE || '900k',
    videoFps: process.env.VIDEO_FPS || '30',
    audioBitrate: process.env.AUDIO_BITRATE || '128k',

    startupUrl: process.env.STARTUP_URL || 'https://start.duckduckgo.com',

    bitDepth: 24
}
