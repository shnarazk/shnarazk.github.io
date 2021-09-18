---
title: Disable auto-suspend by gdm
date: 2018-11-16
tags: ["Gnome"]
---


```
u - gdm -s /bin/sh
export $(dbus-launch)
GSETIINGS_BACKEND=dconf gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type 'nothing`
```
