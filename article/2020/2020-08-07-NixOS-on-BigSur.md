---
title: NixOS on Big Sur
subtitle: 毎年右往左往
date: 2020-08-17
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

Cコンパイラも動かないのでemacs27も作れない。

### 2020-08-11

結果としてリンクにするのがNixOSをインストールするためのベストプラクティスみたいだ。
以前は/Volumes/Nix をリブートするたびに手で/nixにマウントしなおしていたのが、その必要がなくなった。

### 2020-08-17

コンパイルできない問題はお手上げ状態みたいだ。
https://github.com/NixOS/nixpkgs/issues/91748
