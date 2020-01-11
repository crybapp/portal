FROM node:lts-buster

# Install Chromium, audio and other misc packages, cleanup, create Chromium policies folders, workarounds
RUN apt-get update && apt-get -y dist-upgrade && \
    apt-get --no-install-recommends -y install \
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
        x11-session-utils \
        libgstreamer1.0-0 \
        gstreamer1.0-plugins-base \
        gstreamer1.0-plugins-good \
        gstreamer1.0-plugins-bad \
        gstreamer1.0-plugins-ugly \ 
        gstreamer1.0-libav \
        gstreamer1.0-doc \
        gstreamer1.0-tools \
        gstreamer1.0-x \
        gstreamer1.0-alsa \
        gstreamer1.0-gl \
        gstreamer1.0-gtk3 \
        gstreamer1.0-qt5 \
        gstreamer1.0-pulseaudio \
        ffmpeg \
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
    && mkdir -p /etc/opt/chrome/policies/managed \
    && mkdir /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix && chown root /tmp/.X11-unix

# Install Widevine component for Chromium
RUN WIDEVINE_VERSION=$(wget --quiet -O - https://dl.google.com/widevine-cdm/versions.txt | tail -n 1) \
    && wget "https://dl.google.com/widevine-cdm/$WIDEVINE_VERSION-linux-x64.zip" -O /tmp/widevine.zip \
    && unzip /tmp/widevine.zip -d /usr/lib/chromium/WidevineCdm \
    && rm /tmp/widevine.zip

# Add normal user
RUN useradd glados --shell /bin/bash --create-home \
    && usermod -a -G audio glados \ 
    && mkdir -r /home/glados/.config/google-chrome \
    && chown -R glados:glados /home/glados/.config/google-chrome \
    && touch "/home/glados/.config/google-chrome/First Run"

# Copy information
WORKDIR /home/glados/.internal
COPY . .

# Chromium Policies and Preferences
COPY ./configs/chromium_policy.json /etc/chromium/policies/managed/policies.json
COPY ./configs/master_preferences.json /etc/chromium/master_preferences
# Chrome Policies and Preferences
COPY ./configs/managed_policies.json /etc/opt/chrome/policies/managed/policies.json
COPY ./configs/master_preferences.json /etc/opt/chrome/master_preferences
# Pulseaudio Configuration
COPY ./configs/pulse_config.pa /tmp/pulse_config.pa
# Openbox Configuration
COPY ./configs/openbox_config.xml /var/lib/openbox/openbox_config.xml

# Install deps, build then cleanup
RUN yarn && yarn build && yarn cache clean && rm -rf src

ENTRYPOINT [ "bash", "./start.sh" ]
