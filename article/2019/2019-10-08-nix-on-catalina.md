---
title: Using Nix on Catalina
subtitle: Catalina上でNixを使う
date: 2019-10-08
tags: ["nixOS", "macOS"]
---

Catalinaではrootにディレクトリが作れなくなってしまったので`/nix`がどうにもならんことに
なってしまった。[Discourseのトピック](https://discourse.nixos.org/t/current-status-of-nix-on-macos-catalina/4286/2)によれば、
パーティションを作ってマウントすることが必要らしい。
うーむ、どうもこれしかなさそうなんだけど、
もうちょっとやり方が確定するまでメインマシンのアップグレードはしばらく待ってみようか。

ちなみに現在、Nixでインストールしているものは以下の通り。

- coreutils-8.31
- emacs-26.3
- git-2.23.0
- gnupg-2.2.17
- nix-2.3
- nodejs-12.5.0
- nss-cacert-3.46
- parallel-20190722
- pinentry-1.1.0
- R-3.6.1-wrapper
- sat-bench-0.6.3
- source-highlight-3.1.8
- tmux-2.9a
- xz-5.2.4

特に重要なものはemacs, git, parallel, tmux, xzあたり。
coreutils, sat-bench, R, source-highlightは多分捨てられる。
gunpg, nodejsは公式バイナリでもいいか。

とすると、残念だけど、色々と設定が必要ならNixをやめられない訳ではないようだ。
