# Builder image, we get the dependencies and stuff here
FROM node:22-bookworm AS builder
WORKDIR /build
COPY logo.txt package.json pnpm-lock.yaml tsconfig.json /build/
RUN npm i -g pnpm && pnpm i
COPY ./src /build/src
RUN pnpm build && pnpm pack

FROM node:22-bookworm
WORKDIR /home/glados/.internal

# Install Chromium, audio and other misc packages, cleanup, create Chromium policies folders, workarounds
RUN apt-get update && apt-get -y dist-upgrade && \
    apt-get --no-install-recommends -y install \
        psmisc \
        rsync \
        dbus \
        dbus-x11 \
        xvfb \
        x11-xserver-utils \
        mesa-utils \
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
        fonts-recommended \
        pulseaudio \
        x11-session-utils \
        gstreamer1.0-plugins-base \
        gstreamer1.0-plugins-good \
        gstreamer1.0-tools \
        chromium \
        sudo \
        grep \
        procps \
        xdg-utils \
        libnss3 \
        libnspr4 \
        libappindicator3-1 \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
    && mkdir -p /var/run/dbus \
    && mkdir -p /etc/chromium/policies/managed \
    && mkdir /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix && chown root /tmp/.X11-unix \
    && useradd glados --shell /bin/bash --create-home \
    && usermod -a -G audio glados

# Chromium Policies & Preferences
COPY ./configs/chromium_policy.json /etc/chromium/policies/managed/policies.json
COPY ./configs/master_preferences.json /etc/chromium/master_preferences
# Pulseaudio Configuration
COPY ./configs/pulse_config.pa /etc/pulse/default.pa
# Openbox Configuration
COPY ./configs/openbox_config.xml /var/lib/openbox/openbox_config.xml

COPY --from=builder /build/cryb-portal-1.0.0.tgz /home/glados/.internal/

RUN tar -xzf /home/glados/.internal/cryb-portal-1.0.0.tgz \
    && rsync -vua --delete-after /home/glados/.internal/package/ /home/glados/.internal/ \
    && chown -R glados:glados /home/glados
COPY ./start.sh ./widevine.sh ./.env* /home/glados/.internal/
RUN sudo -u glados bash /home/glados/.internal/widevine.sh

ENTRYPOINT [ "/home/glados/.internal/start.sh" ]
