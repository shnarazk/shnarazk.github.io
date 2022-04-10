---
title: MacOS -> Nixpkgs -> Alacritty -> Tmux -> truecolor
extra:
  subtitle: terminal-overridesが有効になるまで
taxonomies:
  tags: ["MacOS", "Nix", "tmux"]
---
MacOSの上でnixpkgsを使っている少数派なので一筋縄ではいかない。

1. まずはnixでncursesをインストール（/usr/shareを書き換えない）
1. ネットですぐ見つかる方法で、.tmux.confで`default-terminal`と`terminal-overrides`を記述
1. tmux show -sでそれらが有効にならない。
1. どうもzshが新しいncursesのterminfoを拒否しているらしいことがわかる
1. そこでzshをインストールして(/bin/zshは書き換えない)、~/.nix-profile/bin/zshを指定してやると、.tmux.confの設定が有効になる。
1. ということで.config/alacritty/config.ymlのshell設定を書き換え
1. 同じく.tmux.confの起動シェルを書き換え

以上で成功。

##### インストールしたもの

```
nix profile install nixpkgs#{zsh, ncurses, tmux, alacritty}
```

##### 書き換えたもの

```
# .tmux.conf
set-option -g default-shell "${HOME}/.nix-profile/bin/zsh"
set-option -g default-terminal "xterm-256color"
set-option -ag terminal-overrides ",${TERM}:RGB"
```

```yml
# config.yml
  shell:
    program: ..../.nix-profile/bin/zsh
    args
      - --login
```
