---
title: Nix flakeの作り方
subtitle: さあ来いnix-2.4
date: 2021-03-14
tags: ["NixOS"]
banner: "https://images.unsplash.com/photo-1482597869166-609e91429f40?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2400"
---
# Nix flakes

**cover image: https://unsplash.com/photos/U2L0qbBw9Jo**

2021-03-08にnixのベータ版？が三ヶ月ぶりに更新されて、ようやくnixを置き換えてもエラーなく使えるようになりました。
なので早速Splrで使ってみたのでいくつかメモ。

## restricted modeとは

`nix-env -u`でエラーはなくなったものの、flake.nixを作ろうとすると相変わらずrestricted modeではxxxxにアクセスできないというようなエラーが出る。これは`--impure`フラグを渡してやるといい。

```text
      When the --expr option is given, all installables are interpreted as  Nix  expressions.  You
         may need to specify --impure if the expression references impure inputs (such as <nixpkgs>).
```

ということで、多分12月頃からこうすればよかったようだ。

```shell
$ nix flake init --impure
$ nix build --impure
```

## flake.nixはどう書けばいいのか

[Nix Wiki](https://nixos.wiki/wiki/Flakes)に出てくるのは以下の例

```nix
{
  inputs = {
    home-manager.url = "github:nix-community/home-manager";
  };
}
```

```nix
{
  outputs = { self, nixpkgs }: {
     # replace 'joes-desktop' with your hostname here.
     nixosConfigurations.joes-desktop = nixpkgs.lib.nixosSystem {
       system = "x86_64-linux";
       modules = [ ./configuration.nix ];
     };
  };
}
```

しかし、2020年5月の記事だけど[NIX FLAKES, PART 1: AN INTRODUCTION AND TUTORIAL](https://www.tweag.io/blog/2020-05-25-flakes/)の以下の例がまず足掛かり。

```nix
{
  description = "A flake for building Hello World";
  inputs.nixpkgs.url = github:NixOS/nixpkgs/nixos-20.03;
  outputs = { self, nixpkgs }: {
    defaultPackage.x86_64-linux =
      # Notice the reference to nixpkgs here.
      with import nixpkgs { system = "x86_64-linux"; };
      stdenv.mkDerivation {
        name = "hello";
        src = self;
        buildPhase = "gcc -o hello ./hello.c";
        installPhase = "mkdir -p $out/bin; install -t $out/bin hello";
      };
  };
}
```

これを真似すればよさそうだが、この例ではsystemが `x86_64-linux` に限定されている。
いや `darwin` メインだし将来的には `aarm7` も期待したいのでもっとスマートな方法はないかと探すと、
Nix Wikiで使われている[flake-utils](https://github.com/numtide/flake-utils)がよさそうである。このパッケージは

```nix
eachDefaultSystem -> (<system> -> attrs)
```

を提供している。ええと、これは返値がないように見えるけどこういうこと：

```haskell
eachDefaultSystem : (<system> -> attrs) -> attrs
```

ただし、使い方は微妙である。
よくわからないまま使うと、例えば`defaultPackege.x86-64-darwin`がエクスポートされていないというエラーが出てしまった。
でこれによく似た関数`eachSystem`の[サンプル](https://github.com/numtide/flake-utils#eachsystem---system---system---attrs)をよく見る：

```nix
eachSystem allSystems (system: { hello = 42; })
# => {
   hello.aarch64-darwin = 42,
   hello.aarch64-genode = 42,
}
```

引数closureの中で`hello`を使うと最終的に`hello.${system}`にpopulateされるのだから、`defaultPackege.色々なシステム`をpopulateするにはclosureの中では`defaultPackage`にderivationを束縛すればいい。
ということで

```nix
{
  inputs.flake-utils.url = "github:numtide/flake-utils";
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: {
      defaultPackage =
        with import nixpkgs { system = "${system}"; };
        stdenv.mkDerivation {...};
    });
}
```

とするのが正解。
[実際のコード](https://github.com/shnarazk/splr/blob/f34a664f0f031a9ffe0c4c63558f33ab6b90eec1/flake.nix)はこれ:

```nix
{
  description = "A modern SAT solver in Rust";
  inputs.flake-utils.url = "github:numtide/flake-utils";
  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system: {
      defaultPackage =
        with import nixpkgs { system = "${system}"; };
        stdenv.mkDerivation {
          name = "splr";
          src = self;
          buildInputs = [ cargo rustc ];
          buildPhase = "cargo build --release";
          installPhase = "mkdir -p $out/bin; install -t $out/bin target/release/splr target/release/dmcr";
        }
      ;
    })
  ;
}
```

これでgit cloneしてnix buildでインストールできるようになりました。
うむ。簡単。
オーバレイでnixパッケージ化するよりもお手軽なので、[SAT-bench](https://github.com/shnarazk/SAT-bench)も乗り換えるかも。

初めてFlakesを知ってから半年というか約1年。
長い道のりでした。
