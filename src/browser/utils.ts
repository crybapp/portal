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

export const janusStream = (env: NodeJS.ProcessEnv, videoPort: number, videoRtcpPort: number, audioPort: number, audioRtcpPort: number,
  fps: string, videoBitrate: string, audioBitrate: string, streamingIp: string) :
  ChildProcess => spawn('gst-launch-1.0', [
  '-v',
  'rtpbin', 'name=rtpbin', 'rtp-profile=avpf',
  // use-damage=true uses too much CPU, use-damage=false stutters (when not 30/60 FPS)
  // https://gitlab.freedesktop.org/gstreamer/gst-plugins-good/-/issues/809
  // hi Amby, and thanks for your work at Hyperbeam :)
  'ximagesrc', 'show-pointer=true', `use-damage=${Number(fps) % 5 === 0 ? 'false' : 'true'}`,
  '!', 'videoconvert', '!', 'videorate', '!', `video/x-raw,framerate=${fps}/1`,
  '!', 'queue',
  '!', 'vp8enc',
  'deadline=1',
  'cpu-used=5', // 3 ends up too pixelated. 5 is a good point for real-time
  'end-usage=cbr',
  'error-resilient=partitions',
  `target-bitrate=${videoBitrate}`,
  'threads=2', // todo tune later
  'token-partitions=4',
  `keyframe-max-dist=${Number(fps)*2}`, // adjust once we add keyframe requests
  'min-quantizer=0',
  'max-quantizer=50',
  'static-threshold=0',
  '!', 'rtpvp8pay', 'pt=100', 'mtu=1204',
  '!', 'rtpbin.send_rtp_sink_0',
  'rtpbin.send_rtp_src_0', '!', 'udpsink', `host=${streamingIp}`, `port=${videoPort}`,
  'rtpbin.send_rtcp_src_0', '!', 'udpsink', `host=${streamingIp}`, `port=${videoRtcpPort}`, 'sync=false', 'async=false',
  'pulsesrc',
  '!', 'audioconvert', '!', 'audioresample', '!', 'audio/x-raw,channels=2,rate=48000',
  '!', 'queue',
  '!', 'opusenc',
  'audio-type=restricted-lowdelay',
  `bitrate=${audioBitrate}`,
  'bitrate-type=vbr',
  'frame-size=10',
  '!', 'rtpopuspay', 'pt=101', 'mtu=1204',
  '!', 'rtpbin.send_rtp_sink_1',
  'rtpbin.send_rtp_src_1', '!', 'udpsink', `host=${streamingIp}`, `port=${audioPort}`,
  'rtpbin.send_rtcp_src_1', '!', 'udpsink', `host=${streamingIp}`, `port=${audioRtcpPort}`, 'sync=false', 'async=false'
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
