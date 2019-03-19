---
title: Memo on Nixpkgs
subtitle: nixで最強パッケージ管理
date: 2019-02-27
tags: ["nixos"]
---

## Location of my configuration file

is **~/.config/nixpkgs/config.nix**.

- https://nixos.wiki/wiki/FAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F


## Overriding nix package

- 'error: attribute `override' missing'

Probably you're trying to override a non-existing package.

For example, the following emits the error because `emacs26` doesn't exist.

```
# ~/.config/nixpkgs/config.nix
{ pkgs }:
{
    allowBroken = true;
    allowUnfree = true;

    packageOverrides = pkgs : rec {
   	emacs26 = pkgs.stdenv.lib.overrideDerivation pkgs.emacs26 (oldAttrs : {
	    name = "emacs-26.1.92";
	    version = "26.1.92";
	    src = pkgs.fetchurl {
	        url = "https://alpha.gnu.org/gnu/emacs/pretest/emacs-26.1.92.tar.xz";
		    sha256 = "0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41";
		};
	});
  };
}
```

By changing the package name to `emacs`, it works.

- https://github.com/NixOS/nixpkgs/issues/4017

### nixファイルの構造

nixファイルはnix式を定義するもの。

- nix-buildはderivationを生成する式を要求する。そしてその環境のシェルを走らせる。
- config.nixやオーバレイはnixpkgsを更新する関数を定義するもの。

- https://nixos.org/nixos/manual/index.html#sec-nix-syntax-summary
- https://nixos.org/nixos/manual/index.html#sec-configuration-syntax

### そもそもの関数の構文

- `:`が引数と本体のセパレータ。

```nix
x : x + 1
```

例えばletなしで集合型の返値が計算できるなら

```nix
{ config, pkgs }
{
	属性の定義式;
}
```

となるし、let文を使いたいなら以下のようになる。

```nix
{ config, pkgs }
let
  x = { ... };
  y = { ... };
  ...
in
  x
```

- 複数引数の関数なら引数は{}で括る（カンマ区切り） 

```nix
{ x, y }: x + y
```

衝撃的にヘンタイ。

カリー化すれば以下のようにも書けるはず（overlayの例が多用している）:

```nix
self: super:
...
```

- nix-build(shell.nixがconvention?)に与えるべきnixファイルはこんな感じ:

```nix
with import <nixgkgs> {};
  ...  # derivationを返すこと
```

- nix-shell（default.nixがデフォールト）に与えるべきnixファイルはこんな感じ:

```nix
with import <nixgkgs> {};
{ ... } # 集合を返す
```

### モジュールの構文

これは単なる関数。

```nix
{ 依存するモジュール（カンマ区切り） }: 
返値
```

- オーバレイは以下のような構造。

```nix
self: super:
{
}
```

- ~/.config/nixpkgs/config.nix はこんな感じ。

```nix
{ pkgs }:
{
	...
}
```
