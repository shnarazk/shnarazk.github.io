---
title: Liveness of nix-store created by 'nix-build'
subtitle: No 'nix-store --delete --ignore-liveness'
date: 2020-04-05
tags: ["NixOS"]
---
昨日、[nixOS](https://nixos.org) に [cadical](https://github.com/arminbiere/cadical) が追加されたけど、それに至るまでは[nixpkgsリポジトリ](https://github.com/NixOS/nixpkgs)のクローンを作って、自分でnix-buildを繰り返していた。
一旦 `nix-build -A cadical` でパッケージを作成するとnix expressionを変更してもartifactのstoreが更新されないことが多い。
調べて nix-storeのdeleteオプションで消せることがわかったけど、実行すると死んでないから削除できないというエラーが出る。`nix-env -e cadical` で削除しても同じエラーになる。

deleteオプションには`--ignore-liveness`という強力なフラグがあるのだけどこれを使っていたらnixの環境がgcされてnixでインストールしたものが一瞬全てなくなる羽目になってしまった。
これは結局 `/nix-profile/bin から辿れるシンボリックリンクを貼り直すことで回復できたけど、もうこのオプションは使いたくない。一体なぜパッケージを自分の環境から削除したのゴミにならないのか？

調べてみたら（いや、適当に見当つけて見たら）、nixpkgsワーキングツリーのトップにnix-buildで生成されたstoreへのシンボリックリンク result というのが自動的にできるのだけど、これがGCのrootになっていた。

ということで result をrmで消すと（そして nix-env -e すると）、 nix-store --delete で素直に消えてくれるようになりました。
