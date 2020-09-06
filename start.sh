#!/bin/bash

# Update Widevine, but only if glados user exists
if id -u glados > /dev/null 2>&1; then
    sudo -u glados bash ./widevine.sh
fi

# Start dbus only if it's not already running.
if ! pgrep dbus-daemon > /dev/null; then
    echo "Setting up dbus..."
    dbus-daemon --fork --config-file=/usr/share/dbus-1/system.conf
fi

# Check if user exists
if id -u glados > /dev/null 2>&1; then
    echo "Starting portal in glados user..."
    sudo -u glados yarn start $@
else
    echo "glados user seems to not exist. starting in current user..."
    if [ $(id -u) = 0 ]; then
        echo "--- We'll accept running as root - but it's not recommended nor supported. ---"
    fi
    yarn start $@
fi

echo "All done, shutting down!"
exit 0
