FROM node:lts-buster

# Install Chromium, audio and other misc packages including minimal runtime used for executing non GUI Java programs
RUN apt-get update && \
    apt-get -qqy --no-install-recommends -y install \
    dbus \
    dbus-x11 \
    xvfb \
    xdotool \
    openbox \
    fonts-opensymbol \
    fonts-symbola \
    fonts-liberation \
    fonts-freefont-ttf \
    fonts-droid-fallback \
    fonts-dejavu-core \
    fonts-arphic-ukai \
    fonts-arphic-uming \
    fonts-ipafont-mincho \
    fonts-ipafont-gothic \
    fonts-unfonts-core \
    fonts-noto-color-emoji \
    fonts-noto \
    fonts-nanum \
    pulseaudio \
    alsa-utils \
    x11-session-utils \
    ffmpeg \
    sudo \
    socat \
    grep \
    procps \
    chromium

# Directory cleanup
RUN mkdir -p /var/run/dbus
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*
RUN rm -rf /home/glados

# Chromium policies
RUN mkdir -p /etc/chromium/policies/managed /etc/chromium/policies/recommended

# Add normal user
RUN useradd glados --shell /bin/bash --create-home
RUN usermod -a -G audio glados

# Copy information
WORKDIR /home/glados/.internal
COPY . .

# Install deps & build
RUN yarn && yarn build

# Cleanup
RUN rm -rf src

# Chromium Policies
COPY ./configs/chromium_policy.json /etc/chromium/policies/managed/policies.json
# Pulseaudio Configuration
COPY ./configs/pulse_config.pa /tmp/pulse_config.pa

ENTRYPOINT [ "bash", "./start.sh" ]
