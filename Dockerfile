FROM node:latest

# Install Chromium, audio and other misc packages including minimal runtime used for executing non GUI Java programs
RUN apt-get update && \
    apt-get -qqy --no-install-recommends -y install \
    dbus \
    dbus-x11 \
    consolekit \
    xvfb \
    xdotool \
    openbox \
    pulseaudio \
    alsa-utils \
    x11-session-utils \
    ffmpeg \
    sudo \
    socat \
    grep \
    procps \
    wget

# Install the latest version of Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add
RUN echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list
RUN apt-get update && apt-get -y install google-chrome-stable

# Directory cleanup
RUN mkdir -p /var/run/dbus
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*
RUN rm -rf /home/glados

# Chrome policies
RUN mkdir -p //etc/opt/chrome/policies/managed /etc/opt/chrome/policies/recommended

# Add normal user
RUN useradd glados --shell /bin/bash --create-home

# Copy information
WORKDIR /home/glados/.internal
COPY . .

# Install deps & build
RUN yarn && yarn build

# Cleanup
RUN rm -rf src

# Chromium Policies
COPY ./configs/chromium_policy.json /etc/opt/chrome/policies/managed/policies.json

# Pulseaudio Configuration
COPY ./configs/pulse_config.pa /tmp/pulse_config.pa

ENTRYPOINT [ "./start.sh" ]
