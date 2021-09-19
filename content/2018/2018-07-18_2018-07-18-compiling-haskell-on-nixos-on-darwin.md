---
title: Compiling Haskell programs on NixOS on MacOS
taxonomies:
  tags: ["Haskell", "NixOS", "macOS"]
---
最近Haskellプログラムのコンパイルができなくなった。リンク時にiconv周りで未定義エラーが出てしまう。
対応するiconvをnixOS側に用意してやればいいようだ。

```
nix:
  enable: true
  packages: [ haskellPackages.iconv ]
```

これで治った。
