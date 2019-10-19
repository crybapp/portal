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
    '--file=/tmp/pulse_config.pa'
], {
    env,
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

export const chromium = (env: NodeJS.ProcessEnv) => {
    const config = [
        '-bwsi',
        '-test-type',
        '-no-sandbox',
        '-disable-gpu',
        '-start-maximized',
        '-force-dark-mode',
        '-disable-file-system',
        '-disable-software-rasterizer',
    
        `--display=${env.DISPLAY}`
    ]

    if(process.env.IS_CHROMIUM_DARK_MODE === 'false')
        config.splice(config.indexOf('-force-dark-mode'), 1)

    return spawn('chromium', [
        ...config,
        'https://www.google.com'
    ], {
        env,
        stdio: [
            'ignore',
            'inherit',
            'inherit'
        ]
    })
}

export const ffmpeg = (env: NodeJS.ProcessEnv, token: string, width: number, height: number) => spawn('ffmpeg', [
    '-f', 'x11grab',
    '-s', `${width}x${height}`,
    '-r', '30',
    '-i', env.DISPLAY,
    '-an',

    '-f', 'mpegts',
    '-c:v', 'mpeg1video',
    //'-q:v', '2',
    '-b:v', '2400k',
    '-bf', '0',

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

    '-f', 'mpegts',
    '-c:a', 'mp2',
    '-b:a', '128k',

    `${env.APERTURE_URL}/?t=${token}`
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
