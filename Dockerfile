FROM node:latest

# Install misc packages including minimal runtime used for executing non GUI Java programs
RUN apt-get update && \
    apt-get clean && \
    apt-get -qqy --no-install-recommends -y install \
    xvfb \
    xdotool \
    ffmpeg \
    openbox \
    dbus \
    dbus-x11 \
    sudo

# Install audio packages
RUN apt-get update && \
  apt-get -qqy install \
    pulseaudio \
    socat \
    alsa-utils \
    x11-session-utils

# Directory cleanup
RUN mkdir -p /var/run/dbus
RUN mkdir -p /root/.config/pulse
RUN rm -rf /var/lib/apt/lists/* /var/cache/apt/*

# Install Chrome
RUN apt-get update && apt-get -y install chromium
RUN mkdir /etc/chromium /etc/chromium/policies /etc/chromium/policies/managed /etc/chromium/policies/recommended

# Add normal user with passwordless sudo
RUN useradd glados --shell /bin/bash --create-home
RUN chown glados:glados /home/glados
RUN echo glados ALL=\(ALL\) NOPASSWD:ALL >> /etc/sudoers

# Switch to glados user and run initial setup
USER glados
ENV PATH="/home/glados/bin:${PATH}"

# Switch to root user
USER root

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
COPY ./configs/pulse_config.pa /bin/pulse-config.pa
COPY ./configs/pulse_default.pa /root/.config/pulse/default.pa

ENTRYPOINT [ "yarn", "start" ]