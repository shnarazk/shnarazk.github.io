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

### UPDATE

`overrideDerivation` is almost depricated. Here's a better version:

```
self: super:
{
    emacs26 = super.emacs26.overrideAttrs (attrs: rec {
        name = "emacs-26.1.92";
        version = "26.1.92";
        src = super.fetchurl {
            url = "https://alpha.gnu.org/gnu/emacs/pretest/emacs-26.1.92.tar.xz";
            sha256 = "0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41";
        };
        patches = [];
    });
}
```

### nixファイルの構造

nixファイルはnix式を定義するもの。

- nix-buildはderivationを生成する式を要求する。そしてその環境のシェルを走らせる。?
- config.nixやオーバレイはnixpkgsを更新する関数を定義するもの。?

- https://nixos.org/nixos/manual/index.html#sec-nix-syntax-summary
- https://nixos.org/nixos/manual/index.html#sec-configuration-syntax

### そもそもの関数の構文

- `:`が引数と本体のセパレータ。

```nix
x : x + 1
```

- 複数引数の関数なら引数は{}で括る（カンマ区切り）

```nix
{ x, y }: x + y
```

衝撃的にヘンタイ。

なお、カリー化すれば以下のようにも書けるはず（overlayの多くの例が使用している）:

```nix
self: super:
...
```

ということで、例えばletなしで集合型の返値が計算できるなら

```nix
{ config, pkgs }:
{
	属性の定義式;
}
```

となるし、let文を使いたいなら以下のようになる。

```nix
{ config, pkgs }:
let
  x = { ... };
  y = { ... };
  ...
in
  x
```

- nix-buildに与えるべきnixファイル(shell.nixがconvention?)はこんな感じ:

```nix
with import <nixgkgs> {};   # この;は文を区切るものではなく、withは次の行まで続いている
  ...  # derivationを返すこと
```

a derivationを返すwith式が一つあるだけ。

- nix-shellに与えるべきnixファイル（default.nixがデフォールト）はこんな感じ:

```nix
with import <nixgkgs> {};
{ ... } # 集合を返す
```

pkgsを更新している？

### モジュールの構文

ということで多くのファイルは以下の構造で単一の関数が定義されているだけ。

```nix
{ 依存するモジュール（カンマ区切り） }:
返値
```

オーバレイも ~/.config/nixpkgs/config.nix もこんな感じ。

```nix
{ pkgs }:
{
	...
}
```

ここで`with import <nixpkgs>`を使っても問題ないはず。
試してみたところ、下のどちらでも正しく評価できる。

```nix
with import <inxpkgs>; self: super:
...
```


```nix
with import <inxpkgs> {}; self: super:
```

それどころか以下でも問題ない。

```nix
with import <inxpkgs> {} {}; self: super:
```

何故ならば、`import <nixpkgs>`は`関数：集合 -> 集合`。
なので`with import <inxpkgs> {}`は関数適用。もちろん返値は集合を受け付ける関数。
そして評価が終わった`import <inxpkgs> {} {}`までを環境として、セミコロン以下の本体を評価する。
括弧で構文糖衣を被せればこういうこと。

```
with ((import <inxpkgs>) {} {}) (self: super)
```

やはりヘンタイ。
