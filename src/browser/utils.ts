import { spawn } from 'child_process'

export const dbus = (env: NodeJS.ProcessEnv) => spawn('sudo', [
    'dbus-daemon',
    '--nofork',
    '--config-file=/usr/share/dbus-1/system.conf'
], {
    env,
    stdio: [
        'ignore',
        'inherit',
        'inherit'
    ]
})

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

export const openbox = (env: NodeJS.ProcessEnv) => spawn('openbox', [], {
    env,
    stdio: [
        'ignore',
        'inherit',
        'inherit'
    ]
})

export const ffmpeg = (env: NodeJS.ProcessEnv, token: string, width: number, height: number) => spawn('ffmpeg', [
    '-f', 'x11grab',
    '-s', `${width}x${height}`,
    '-r', '30',
    '-i', env.DISPLAY,

    '-preset', 'ultrafast',
    '-tune', 'zerolatency',
    '-qscale', '0',
    
    '-c:v', 'mpeg1video',
    '-f', 'mpegts',
    `${env.APERTURE_URL}/?t=${token}`
], {
    env,
    stdio: [
        'ignore',
        'inherit',
        'inherit'
    ]
})

export const ffmpegaudio = (env: NodeJS.ProcessEnv, token: string) => spawn('ffmpeg', [
    '-f', 'alsa',
    '-ac', '2',
    '-ar', '44100',
    '-i', 'default',
    '-vn',
    
    '-c:a', 'mp2',
    '-b:a', '256k',
    '-f', 'mpegts',
    `${env.APERTURE_URL}/?t=${token}`
], {
    env,
    stdio: [
        'ignore',
        'inherit',
        'inherit'
    ]
})

export const chromium = (env: NodeJS.ProcessEnv) => spawn('/usr/bin/chromium', [
    '-bwsi',
    '-test-type',
    '-no-sandbox',
    '-disable-gpu',
    '-start-maximized',
    '-disable-file-system',
    '-disable-software-rasterizer',

    `--display=${env.DISPLAY}`,

    'https://www.google.com'
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