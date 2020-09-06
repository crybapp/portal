#!/bin/bash
# ToDo: Not hardcode to glados user.

WIDEVINE_VERSION=$(wget --quiet -O - https://dl.google.com/widevine-cdm/versions.txt | tail -n 1)
# Check if this version exists, and if not, do nothing
if [ ! -d "/home/glados/.config/chromium/WidevineCdm/$WIDEVINE_VERSION" ]; then
  # Delete all old versions
  rm -rf /home/glados/.config/chromium/WidevineCdm/*

  wget "https://dl.google.com/widevine-cdm/$WIDEVINE_VERSION-linux-x64.zip" -O /tmp/widevine.zip
  mkdir -p "/home/glados/.config/chromium/WidevineCdm/$WIDEVINE_VERSION/_platform_specific/linux_x64"
  unzip -p /tmp/widevine.zip manifest.json > "/home/glados/.config/chromium/WidevineCdm/$WIDEVINE_VERSION/manifest.json"
  unzip -p /tmp/widevine.zip LICENSE.txt > "/home/glados/.config/chromium/WidevineCdm/$WIDEVINE_VERSION/LICENSE.txt"
  unzip -p /tmp/widevine.zip libwidevinecdm.so > "/home/glados/.config/chromium/WidevineCdm/$WIDEVINE_VERSION/_platform_specific/linux_x64/libwidevinecdm.so"
  rm /tmp/widevine.zip
fi

echo "{ \"Path\": \"/home/glados/.config/chromium/WidevineCdm/$WIDEVINE_VERSION\" }" > /home/glados/.config/chromium/WidevineCdm/latest-component-updated-widevine-cdm
