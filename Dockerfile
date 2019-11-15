FROM node:lts-buster

# Install Chromium, audio and other misc packages, cleanup, create Chromium policies folders, workarounds
RUN apt-get clean && apt-get update && apt-get -y dist-upgrade && \
    apt-get --no-install-recommends -y install \
        dbus \
        dbus-x11 \
        xvfb \
        autoconf \
        automake \
        build-essential \
        cmake \
        git-core \
        libass-dev \
        libfreetype6-dev \
        libsdl2-dev \
        libtool \
        libva-dev \
        libvdpau-dev \
        libvorbis-dev \
        libxcb1-dev \
        libxcb-shm0-dev \
        libxcb-xfixes0-dev \
        libx264-dev \
        libopus-dev \
        pkg-config \
        texinfo \
        wget \
        zlib1g-dev\
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
        sudo \
        grep \
        procps \
        chromium \
    && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
    && mkdir -p /var/run/dbus \
    && mkdir -p /etc/chromium/policies/managed /etc/chromium/policies/recommended \
    && mkdir /tmp/.X11-unix && chmod 1777 /tmp/.X11-unix && chown root /tmp/.X11-unix \
    && mkdir -p /root/ffmpeg_sources /root/bin

#Compile FFMPEG with x.264 and opus support
RUN cd /root/ffmpeg_sources && \
    wget -O ffmpeg-snapshot.tar.bz2 https://ffmpeg.org/releases/ffmpeg-snapshot.tar.bz2 && \
    tar xjvf ffmpeg-snapshot.tar.bz2 && \
    cd ffmpeg && \
    PATH="$HOME/bin:$PATH" PKG_CONFIG_PATH="$HOME/ffmpeg_build/lib/pkgconfig" ./configure \
    --prefix="$HOME/ffmpeg_build" \
    --pkg-config-flags="--static" \
    --extra-cflags="-I$HOME/ffmpeg_build/include" \
    --extra-ldflags="-L$HOME/ffmpeg_build/lib" \
    --extra-libs="-lpthread -lm" \
    --bindir="$HOME/bin" \
    --enable-gpl \
    --enable-libass \
    --enable-libfreetype \
    --enable-libopus \
    --enable-libvorbis \
    --enable-libx264 \
    --enable-nonfree && \
    PATH="$HOME/bin:$PATH" make && \
    make install && \
    hash -r

#remove compilation deps
RUN apt purge autoconf \
        automake \
        build-essential \
        cmake \
        git-core \
        libass-dev \
        libfreetype6-dev \
        libsdl2-dev \
        libtool \
        libva-dev \
        libvdpau-dev \
        libvorbis-dev \
        libxcb1-dev \
        libxcb-shm0-dev \
        libxcb-xfixes0-dev \
        libx264-dev \
        libopus-dev \
        pkg-config \
        texinfo \
        wget \
        zlib1g-dev && \
    rm -rf ~/ffmpeg_build ~/ffmpeg_sources

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
