---
title: Glucose on NixOS
subtitle: nix-shellを使ってglucoseをインストール
date: 2018-06-21
tags: ["NixOS", "Glucose", "SAT"]
---
<script src="https://gitlab.com/satisfiability01/satisfiability01.gitlab.io/snippets/1726649.js"></script>


builder.sh

```
cd simp
make clean
make
mv glucose glucose3
```

### build

```
$ nix-shell -p zlib
$ cd simp; make clean; make;
$ cp glucose3 ~/.local/bin
```
