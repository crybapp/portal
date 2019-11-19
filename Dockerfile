FROM node:lts-buster

RUN mv /etc/apt/sources.list /etc/apt/sources.list.old && \
    echo "deb http://ftp.us.debian.org/debian/ buster main contrib non-free\r\ndeb-src http://ftp.us.debian.org/debian/ buster main contrib non-free" \
    > /etc/apt/sources.list

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
        sudo \
        grep \
        procps \
        chromium \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
    && mkdir -p /var/run/dbus \
    && mkdir -p /etc/chromium/policies/managed /etc/chromium/policies/recommended \
    && mkdir /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix && chown root /tmp/.X11-unix
    
# Install Widevine component for Chromium
RUN WIDEVINE_VERSION=$(wget --quiet -O - https://dl.google.com/widevine-cdm/versions.txt | tail -n 1) && \
    wget "https://dl.google.com/widevine-cdm/$WIDEVINE_VERSION-linux-x64.zip" -O /tmp/widevine.zip && \
    unzip -p /tmp/widevine.zip libwidevinecdm.so > /usr/lib/chromium/libwidevinecdm.so && \
    chmod 644 /usr/lib/chromium/libwidevinecdm.so && \
    rm /tmp/widevine.zip

# Add normal user
RUN useradd glados --shell /bin/bash --create-home && usermod -a -G audio glados

# Copy information
WORKDIR /home/glados/.internal
COPY . .

# Chromium Policies
COPY ./configs/chromium_policy.json /etc/chromium/policies/managed/policies.json
# Chromium Preferences
COPY ./configs/master_preferences.json /etc/chromium/master_preferences
# Pulseaudio Configuration
COPY ./configs/pulse_config.pa /tmp/pulse_config.pa
# Openbox Configuration
COPY ./configs/openbox_config.xml /var/lib/openbox/openbox_config.xml

# Install deps, build then cleanup
RUN yarn && yarn build && yarn cache clean && rm -rf src

ENTRYPOINT [ "bash", "./start.sh" ]
