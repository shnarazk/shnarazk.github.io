---
title: Compiling Rust programs using openssl
subtitle: 新しいopensslに移行したディストリビューションでopensslを使う
date: 2019-03-28
tags: ["Rust", "ArchLinux"]
---

The simplest way is using the old version of openssl.

```
$ pacman -Ss openssl
core/openssl 1.1.1.b-1 [installed]
    The Open Source toolkit for Secure Sockets Layer and Transport Layer Security
core/openssl-1.0 1.0.2.r-1 [installed]
    The Open Source toolkit for Secure Sockets Layer and Transport Layer Security
```

Select it by environment variables.

```
OPENSSL_LIB_DIR=/usr/lib/openssl-1.0 OPENSSL_INCLUDE_DIR=/usr/include/openssl-1.0 cargo build
```

### On NixOS

```
nix-shell -p openssl pkg-config
cargo build
```

If you face 'no Security' error, that occured by 'mongodb with ssl', try:

```
nix-shell -p openssl_1_1 pkg-config darwin.apple_sdk.frameworks.Security
```

That's it.

