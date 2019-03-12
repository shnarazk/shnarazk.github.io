---
title: NixOS administration
subtitle: NixOSのメモ
date: 2019-03-06
tags: ["NixOS"]
---

- Where's configuration: /etc/nixos/configuration.nix
   - The option `system.nixos.stateVersion` has been renamed `system.stateVersion`.
- Choose kernel version: https://nixos.wiki/wiki/Choose_your_kernel_on_NixOS
- how to update:
```
nixos-rebuild switch --upgrade
```
- 'nix search' is faster than `nix-env -qa`.

