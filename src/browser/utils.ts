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

export const brave = (env: NodeJS.ProcessEnv, width: number, height: number, startupUrl) => {
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

    return spawn('brave-browser', [
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

export const janusVideo = (env: NodeJS.ProcessEnv, port: number, width: number, height: number, fps: string, bitrate: string, streamingIp) => spawn('gst-launch-1.0', [
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

export const janusAudio = (env: NodeJS.ProcessEnv, port: number, bitrate: string, streamingIp: string) => spawn('gst-launch-1.0', [
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

export const apertureVideo = (
	env: NodeJS.ProcessEnv,
	token: string,
	width: number,
	height: number,
	fps: string,
	bitrate: string
) => spawn('ffmpeg', [
	'-f', 'x11grab',
	'-s', `${width}x${height}`,
	'-r', fps,
	'-i', env.DISPLAY,
	'-an',

	'-f', 'mpegts',
	'-c:v', 'mpeg1video',
	'-b:v', bitrate,
	'-bf', '0',

	`${env.STREAMING_URL || env.APERTURE_URL}/?t=${token}`
], {
	env,
	stdio: [
		'ignore',
		'inherit',
		'inherit'
	]
})

export const apertureAudio = (env: NodeJS.ProcessEnv, token: string, bitrate: string) => spawn('ffmpeg', [
	'-f', 'pulse',
	'-ac', '2',
	'-ar', '44100',
	'-i', 'default',
	'-vn',

	'-f', 'mpegts',
	'-c:a', 'mp2',
	'-b:a', bitrate,

	`${env.STREAMING_URL || env.APERTURE_URL}/?t=${token}`
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
		'pipe',
		'inherit'
	]
})