import { spawn } from 'child_process'

export const xvfb = (env: NodeJS.ProcessEnv, width: number, height: number, bitDepth: number) => spawn('Xvfb', [
	env.DISPLAY,
	'-ac',
	'-screen', '0', `${width}x${height}x${bitDepth}`
], {
	stdio: [
		'ignore',
		'inherit',
		'inherit'
	]
})

export const pulseaudio = (env: NodeJS.ProcessEnv) => spawn('pulseaudio', [
	'--exit-idle-time=-1',
	'--file=/tmp/pulse_config.pa',
	'-n',
	'--daemonize=false',
	'--disallow-module-loading'
], {
	env,
	stdio: [
		'ignore',
		'inherit',
		'inherit'
	]
})

export const openbox = (env: NodeJS.ProcessEnv) => spawn('openbox', ['--config-file', '/var/lib/openbox/openbox_config.xml'], {
	env,
	stdio: [
		'ignore',
		'inherit',
		'inherit'
	]
})

export const chromium = (env: NodeJS.ProcessEnv, width: number, height: number, startupUrl) => {
    const config = [
        '-bwsi',
        '-test-type',
        '-no-sandbox',
        '-disable-gpu',
        '-start-maximized',
        '-force-dark-mode',
        '-disable-file-system',
        '-disable-software-rasterizer',
        '--window-position=0,0',
        `--window-size=${width},${height}`,

		`--display=${env.DISPLAY}`
	]

	if (process.env.IS_CHROMIUM_DARK_MODE === 'false')
		config.splice(config.indexOf('-force-dark-mode'), 1)

    return spawn('chromium', [
        ...config,
        startupUrl
    ], {
        env,
        stdio: [
            'ignore',
            'inherit',
            'inherit'
        ]
    })
}

export const ffmpeg = (env: NodeJS.ProcessEnv, port: number, width: number, height: number, fps: string, bitrate: string) => spawn('ffmpeg', [
    '-f', 'x11grab',
    '-s', `${width}x${height}`,
    '-r', fps,
    '-i', env.DISPLAY,
    '-an',

    '-f', 'rtp',
    '-c:v', 'libvpx',
    '-b:v', bitrate,
    '-crf', '30',
    '-speed', '1',
    '-quality', 'realtime',
    '-slices', '3',
    '-threads', '3',

    `rtp://${env.STREAMING_URL || env.APERTURE_URL}:${port}?pkt_size=1300` //pkt_size to 1300 to allow padding for webRTC overhead.
], {
    env,
    stdio: [
        'ignore',
        'inherit',
        'inherit'
    ]
})

export const gstreamer = (env: NodeJS.ProcessEnv, port: number, width: number, height: number, fps: string, bitrate: string, streamingIp) => spawn('gst-launch-1.0', [
    '-v',
    'ximagesrc', 'use-damage=0', 
    '!', 'videoconvert', 
    '!', `video/x-raw,width=${width},height=${height},framerate=${fps}/1`, 
    `!`, 'vp8enc', 
        'cpu-used=8',
        'error-resilient=1', 
        `target-bitrate=${bitrate}`, 
        'deadline=50000',
	'threads=2',
        'token-partitions=2',	
    '!', 'rtpvp8pay', 
    '!','udpsink', 
        `host=${streamingIp}`,
        `port=${port}`
], {
    env,
    stdio: [
        'ignore',
        'inherit',
        'inherit'
    ]
})

export const gstreameraudio = (env: NodeJS.ProcessEnv, port: number, bitrate: string, streamingIp: string) => spawn('gst-launch-1.0', [
    "-v", "pulsesrc", 
    "!", "audioresample", 
    "!", "audio/x-raw,channels=2,rate=24000", 
    "!", `opusenc`, 
        `bitrate=${bitrate}`,
    `!`, "rtpopuspay", 
    "!", "udpsink",
        `host=${streamingIp}`,
        `port=${port}`
], {
	env,
	stdio: [
		'ignore',
		'inherit',
		'inherit'
	]
})

export const ffmpegaudio = (env: NodeJS.ProcessEnv, port: number, bitrate: string) => spawn('ffmpeg', [
    '-f', 'pulse',
    '-ac', '2',
    '-ar', '36000',
    '-i', 'default',
    '-vn',

    '-f', 'rtp',
    '-c:a', 'libopus',
    '-b:a', bitrate,
    '-compression_level', '10',
    '-frame_duration', '20',
    '-application', 'lowdelay',

    `rtp://${env.STREAMING_URL || env.APERTURE_URL}:${port}?pkt_size=1300` //pkt_size to 1300 to allow padding for webRTC overhead.
], {
	env,
	stdio: [
		'ignore',
		'inherit',
		'inherit'
	]
})

export const xdotool = (env: NodeJS.ProcessEnv) => spawn('xdotool', ['-'], {
	env,
	stdio: [
		'pipe',
		'inherit',
		'inherit'
	]
})
