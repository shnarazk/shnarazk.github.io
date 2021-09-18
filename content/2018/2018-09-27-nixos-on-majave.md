---
title: NixOS on MacOS Mojave
date: 2018-09-27
tags: ["nixOS", "macOS"]
---

Mojaveへのアップグレードでまた共有ライブラリがなくなってnix由来のプログラムが動かなくなった。

```
dyld: Library not loaded: /usr/lib/system/libsystem_network.dylib
  Referenced from: /nix/store/zk0kw320dn3dq56lpk7rgmf4pgk06g4f-Libsystem-osx-10.11.6/lib/libSystem.B.dylib
  Reason: image not found
```

関連するissueは色々立っているけどどれもよくわからない。

- https://github.com/NixOS/nixpkgs/issues/42719

多くの回答は再インストールを勧めているけど、それでも問題がある人もいるようだ。
結局以下の方法で対応できた。

```
# 問題を起こしている（存在しなくなったライブラリを読もうとしている）パッケージを全て削除：
sudo rm -fr /nix/store/*-Libsystem-osx-10.11.6

# macOSの元環境でnix-2.1.2を再インストール
/bin/bash
export PATH=/usr/bin:/bin
curl https://nixos.org/nix/install > install
bash install
```

これでよくなった。nixOSが動くようになったのでTexLive2018の更新もまたできるようになった。
