---
title: NixOS administration
subtitle: NixOSのメモ
date: 2019-03-06
tags: ["NixOS"]
---

1. configuration @ /etc/nixos/configuration.nix
   - The option `system.nixos.stateVersion` has been renamed `system.stateVersion`.
1. update
```
nixos-rebuild switch --upgrade
```
1. 'nix search' is fast.

