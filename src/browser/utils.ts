import { ChildProcess, spawn } from 'child_process'

export const xvfb = (env: NodeJS.ProcessEnv, width: number,
  height: number, bitDepth: number) : ChildProcess => spawn('Xvfb', [
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

export const pulseaudio = (env: NodeJS.ProcessEnv) : ChildProcess => spawn('pulseaudio', [
  '--exit-idle-time=-1',
  '--file=/etc/pulse/default.pa',
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

export const openbox = (env: NodeJS.ProcessEnv) : ChildProcess => spawn('openbox', [
  '--config-file', '/var/lib/openbox/openbox_config.xml'
], {
  env,
  stdio: [
    'ignore',
    'inherit',
    'inherit'
  ]
})

export const chromium = (env: NodeJS.ProcessEnv, startupUrl: string) : ChildProcess => {
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

export const janusVideo = (env: NodeJS.ProcessEnv, port: number, width: number,
  height: number, fps: string, bitrate: string, streamingIp: string) : ChildProcess => spawn('gst-launch-1.0', [
  '-v',
  'ximagesrc', 'use-damage=0',
  '!', 'videoconvert',
  '!', `video/x-raw,width=${width},height=${height},framerate=${fps}/1`,
  '!', 'vp8enc',
  'cpu-used=8',
  'error-resilient=1',
  `target-bitrate=${bitrate}`,
  'deadline=50000',
  'threads=2',
  'token-partitions=2',
  '!', 'rtpvp8pay',
  '!', 'udpsink',
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

export const janusAudio = (env: NodeJS.ProcessEnv, port: number, bitrate: string,
  streamingIp: string) : ChildProcess => spawn('gst-launch-1.0', [
  '-v', 'pulsesrc',
  '!', 'audioresample',
  '!', 'audio/x-raw,channels=2,rate=24000',
  '!', 'opusenc',
  `bitrate=${bitrate}`,
  '!', 'rtpopuspay',
  '!', 'udpsink',
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

export const xdotool = (env: NodeJS.ProcessEnv) : ChildProcess => spawn('xdotool', ['-'], {
  env,
  stdio: [
    'pipe',
    'inherit',
    'inherit'
  ]
})
