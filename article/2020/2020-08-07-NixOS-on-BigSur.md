---
title: NixOS on Big Sur
subtitle:
date: 2020-08-07
tags: ["NixOS", "macOS"]
banner: /img/2020/08-07/banner.jpg
---
### Big Sur以前

/etc/synthetic.conf　に

```
nix
```

を追加してmountしていた。

### Big Sur

なんだかmountしてくれないので `/nix` をシンボリックリンクに変更して対応することにした。
そのため、/etc/synthetic.conf を

```
nix	/Volumes/Nix
```
に編集。さらにどこかで

```
export NIX_IGNORE_SYMLINK_STORE=1
```

を実行して、リンクを辿ってくれるようにすればいいようだ。

それにしてもGnomeだなぁ。。。

### 2020-08-09

/usr/lib/system/libcache.dylib がないのでrustプログラムがコンパイルできなくなっている。
