# Builder image, we get the dependencies and stuff here
FROM node:14.17-alpine3.13 AS builder
WORKDIR /build
COPY package.json yarn.lock /build/
RUN yarn config set enableTelemetry false \
    && yarn install --frozen-lockfile
COPY . /build/
RUN yarn build && yarn pack --filename package.tgz

# Final distributed app image
FROM node:14.17-alpine3.13
WORKDIR /home/glados/.internal

RUN apk --no-cache add bash chromium dbus dbus-x11 ffmpeg ffmpeg-libs font-noto font-noto-emoji \
    gst-plugins-bad gst-plugins-base gst-plugins-good gst-plugins-ugly gstreamer gstreamer-tools \
    openbox procps pulseaudio rsync sudo tar ttf-dejavu ttf-droid-nonlatin ttf-freefont ttf-liberation xdg-utils xdotool xvfb \
    && addgroup -g 719 glados \
    && adduser -u 719 -G glados -s /bin/sh -D glados \
    && addgroup glados audio \
    && mkdir -p /var/run/dbus \
    && mkdir -p /etc/chromium/policies/managed /etc/chromium/policies/recommended \
    && mkdir /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix && chown root /tmp/.X11-unix \
    && npm rm -g npm; rm -rf /root/.npm

# Pulseaudio Configuration
COPY ./configs/pulse_config.pa /etc/pulse/default.pa
# Openbox Configuration
COPY ./configs/openbox_config.xml /var/lib/openbox/openbox_config.xml
# Chromium Policies & Preferences
COPY ./configs/chromium_policy.json /etc/chromium/policies/managed/policies.json
COPY ./configs/master_preferences.json /etc/chromium/master_preferences

COPY --from=builder /build/package.tgz /home/glados/.internal/

RUN tar -xzf /home/glados/.internal/package.tgz \
    && rsync -vua --delete-after /home/glados/.internal/package/ /home/glados/.internal/ \
    && apk --no-cache del rsync
COPY ./start.sh ./widevine.sh ./.env* /home/glados/.internal/

RUN sudo -u glados /home/glados/.internal/widevine.sh

ENTRYPOINT [ "/home/glados/.internal/start.sh" ]
