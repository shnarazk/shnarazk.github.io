---
title: rustc-1.41.1 on nixOS
subtitle: especially for macOS
date: 2020-03-09
tags: ["Rust", "nixOS"]
---
sat-benchのバージョン上げる際にRust 1.41での新しい構文を使ったせいでrustc-1.41が必須になってしまった。
そんなことは全然問題ないかと思ったらnixpkgsでの標準のRustPlatformの使用バージョンが1.37だったのでま
ずrustc-1.41を指定することが必要になった。ところがrustc-1.41がコンパイルできない。
llvmのリンカがAMDGPUなんたらが見つからないというエラーが出る。時間を作って調べてみた。

結論から言うと、

1. [nixpkgs](https://github.com/NixOS/nixpkgs)をcloneして適当な新しめのブランチ（例えばnixpkgs-unstable）をcheckout。
1. top directoryで `nix-build -A rustc-1.41` を実行すると問題なく生成できる
1. なので
   [pkgs/development/compilers/rust/1_41_0.nix](https://github.com/NixOS/nixpkgs/tree/master/pkgs/development/compilers/rust/)
   で`rustcVersion`を"1.41.1"に変更（`rustcSha256`は変更してないのだが。。。）してbuildする
1. 生成できたら同じディレクトリで`nix-build -A sat-bench`
1. 生成できたら `nix-env -i path-to-the-derivation`を実行してインストール

これでOK。これまで`NIXPKGS`環境変数とかで指定したつもりだったのだが`nix-build`の利用が正解だったようだ。
