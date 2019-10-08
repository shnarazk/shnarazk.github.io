---
title: Using Nix on Catalina
subtitle: Catalina上でNixを使う
date: 2019-10-08
tags: ["nixOS", "macOS"]
---

Catalinaではrootにディレクトリが作れなくなってしまったので
`/nix`がどうにもならんことになってしまった。
[Discourseのトピック](https://discourse.nixos.org/t/current-status-of-nix-on-macos-catalina/4286/2)によれば、
パーティションを作ってマウントすることが必要らしい。
うーむ、どうもこれしかなさそうなんだけど、
もうちょっとやり方が確定するまでメインマシンのアップグレードはしばらく待ってみようか。

ちなみに現在、Nixでインストールしているものは以下の通り。

- **coreutils-8.31** -- あって当然のGNU系のオプションを使うために重要
- **emacs-26.3**
- **git-2.23.0**
- **gnupg-2.2.17**
- nix-2.3
- nodejs-12.5.0 -- 各種サイトの生成に使用中
- nss-cacert-3.46
- **parallel-20190722** -- `git catchup`が依存している
- pinentry-1.1.0
- R-3.6.1-wrapper -- Cactus plotさえ描ければ捨ててもいい
- sat-bench-0.6.3 -- main machineでは重要
- source-highlight-3.1.8 -- なくてもいい
- **tmux-2.9a**
- **xz-5.2.4** -- benchmark結果の圧縮に使用

特に重要なものはcoreutils, emacs, git, parallel, tmux, xzあたり。
sat-bench, R, source-highlightは多分捨てられる。
gunpg, nodejsは公式バイナリでもいいか。

とすると、残念だけど、色々と設定が必要ならこの際Nixをやめられない訳ではないようだ。

# 2019-10-08T19:00:00 STEPS THAT WORK

などと言いつつ、敷居が低い人柱を志願。

1. synthetic.confを作る

```
sudo echo nix > /System/Volumes/Data/private/etc/synthetic.conf
```

（いや/usr/bin/vimを使うことになるのだけど。）

2. `/nix`を有効にするためまずreboot

3. ボリューム`Nix`を作る

```
sudo /usr/sbin/diskutil apfs addVolume disk1 APFSX Nix -mountpoint /nix
```

4. 色々attributeを設定

```
sudo /usr/sbin/diskutil enableOwneship /nix
sudo /usr/sbin/diskutil apfs encrypt Nix -user disk
sudo /usr/sbin/chown -R <user> /nix
```

5. nixをインストール

```
curl https://nixos.org/nix/install | sh
```

移動されたディレクトリから復帰するのはownerなどが変わっていたのでやめたほうがいいだろう。
ということでnix由来のプログラムも復活。

しかしinteractive shellをzshに変えよとうるさい。色々設定を変えるはめんどいんじゃあ。
