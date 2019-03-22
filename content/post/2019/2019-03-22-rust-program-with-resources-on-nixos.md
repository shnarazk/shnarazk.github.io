---
title: Install Rust programs with resources on NixOS
subtitle: リソース付きRustプログラムのNixOSへのインストール
date: 2019-03-22
tags: ["NixOS", "Rust"]
---

## 目標

同梱ファイルを参照するRustプログラムをNixOSにインストールしたい。

## 方法

1. build.rsで頑張る →試してません
1. 最終保存場所をソースに書き込む

ここでは2番目の手法についてメモしておきます。


## 前提条件

rustPlatform.buildRustProgramを使っている

## 実現手段

1. patchPhaseでsedで`$out`をソースに埋め込む
2. PostInstallで同梱ファイルを`$out`にコピーする

# 実例

[satbench]](https://github.com/shnarazk/SAT-bench)はSATソルバーのベンチマークをするためのユーティリティなので、
複数のCNFファイルを同梱している。実行時にはこのファイルを参照することが必要。
しかし、そもそもcargoは実行ファイルしかインストールしないので、CNFファイルはコンパイルを行ったディレクトリ
を基準に指定するようにして、
コンパイル時にpwdを`env!("PWD")`で埋め込んだりしている。他にもコマンドラインからディレクトリを指定す
るためのコマンドオプションを持つ。
しかし、これだとnixにインストールできないので、上の手法でパッチを当てることにする。

ディレクトリを指定しているのは以下の`Config::lib_dir`のデフォルト値。

```rust
#[structopt(name = "sat-bench", about = "Run simple SAT benchmarks")]
struct Config {
    ...
    /// directory holding instances
    #[structopt(long = "lib", default_value = "")]
    lib_dir: String,
```

（別件だが、ここで`default_value = env!("PWD")`とか書きたいのだが、
そうするとコンパイルエラーになってしまう。残念。）

なのでこのパターンをsedで修正する。ここで、CNFファイルが保存されるのは`$out/lib`とした。

```nix
  satbench = super.rustPlatform.buildRustPackage rec {
    ...
    patchPhase = ''
      sed -i "s|long = \"lib\", default_value = \"\"|long = \"lib\", default_value = \"$out/lib\"|" src/bin/sat-bench.rs
    '';
```

コンパイルやインストールの挙動はいじらないように`postInstall`フックを使って、
インストール後の処理としてファイルをターゲットディレクトリ`$out/lib`にコピー。

```nix
    postInstall = ''
      mkdir -p $out/lib
      cp -r 3-SAT SAT09 SR2015 $out/lib/
    '';
```

このようなnix式を評価してパッケージをインストールすると、
以下のように適切なデフォルト値が埋め込まれているのがわかる。

```
$ sat-bench --help
...

OPTIONS:
    -K, --aux-key <aux_key>   [default: ]
    -H, --header <header>     [default: ]
        --lib <lib_dir>       [default: /nix/store/63765vm6s1gjp3sqmip7i1mp9xwm3nj5-satbench-0.4/lib]
    -M, --message <message>   [default: ]
...  
```

めでたし。
