---
title: NixOS administration
date: 2019-03-06
tags: ["NixOS"]
---

1. configuration @ /etc/nixos/configuration.nix

#### changes

- The option `system.nixos.stateVersion' has been renamed to `system.stateVersion'.

2. update

```
nixos-rebuild switch --upgrade
```
