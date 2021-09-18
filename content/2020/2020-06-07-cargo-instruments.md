---
title: How to compile cargo-instruments
subtitle: on NixOS on MacOS
date: 2020-06-07
tags: ["Rust", "macOS", "nixOS"]
banner: /img/2020/06-07/banner.jpg
---
## Rustでプロファイリングしたいんじゃあ

valgrindは動くけど、perfはない、massive-visualizerもない。
Linuxに比べてmacOSはRustのプロファイリングが不自由だなあ。
それでも、まともなLinuxマシンが手元にないのでなんとかmac上でプロファイリングしなければならない。
何かインストールしなければ。
いくつか調べてみて（そもそも検索でヒットするページが意外なほど少ないのだけど）[cargo-instruments](https://crates.io/crates/cargo-instruments)というのがよさそうだということがわかりました。
残念だけど、opensshのバージョン問題で単に`cargo install`とするだけではコンパイルできないようです。
brewを使っているのが前提になっているのだろうか。
うーん、これはいつものパターンだな。

## nix-shellでコンパイルしよう

sat-benchでの経験を基に、nix-shellで環境作ってcargoを呼び出す方法で、一つ一つ問題を潰していくと、こうなった。

```sh
$ nix-shell -p openssl pkg-config libiconv darwin.apple_sdk.frameworks.Security libcurl
$ cargo install cargo-instruments
```

これはコンパイルは最後まで走るのだけど、最後の最後のリンクフェーズで`_CFURLSetResourcePropertyForKey`が見つからないエラーで失敗する。
どうもこれはnixOS上のrustのコンパイルでよく知られた問題のようで、とあるrust関連のnix expressionにはコメントで出てきて、dirty hackで対応だ、みたいなことが書いてある。
-- `/pkgs/development/tools/rust/cargo-geiger/`

```nix
  # FIXME: Use impure version of CoreFoundation because of missing symbols.
  # CFURLSetResourcePropertyForKey is defined in the headers but there's no
  # corresponding implementation in the sources from opensource.apple.com.
  preConfigure = stdenv.lib.optionalString stdenv.isDarwin ''
    export NIX_CFLAGS_COMPILE="-F${CoreFoundation}/Library/Frameworks $NIX_CFLAGS_COMPILE"
  '';
```

だったら、derivation を作るしかないか。

# That works!

ということで色々nix expressionを見ながら作ったのがこちら。

### 1. /pkgs/development/tools/rust/cargo-instruments/default.nix

```nix
{ stdenv, runCommand, fetchFromGitHub, rustPlatform, Security, CoreFoundation, openssl, pkg-config, libiconv, curl }:

rustPlatform.buildRustPackage rec {
  pname = "cargo-instruments";
  version = "0.3.1";

  src = fetchFromGitHub {
    owner = "cmyr";
    repo = "cargo-instruments";
    rev = "7201328c3556b9d2872308869ac917b4b9d9b352";
    hash = "sha256:1dgp38bgdk4pnrph21zygi4xjcmj449h0m4shapy0nabqwd5l3yz";
  };

  nativeBuildInputs = [ pkg-config ];
  buildInputs = [ openssl libiconv curl Security ];
  cargoSha256 = "sha256:18m9gk2i798vbj48gv60f19fpd6qvk3jrpljp5ai4mzjirhbscxs";
  doCheck = false;
  preConfigure = stdenv.lib.optionalString stdenv.isDarwin ''
    export NIX_CFLAGS_COMPILE="-F${CoreFoundation}/Library/Frameworks $NIX_CFLAGS_COMPILE"
  '';

  meta = with stdenv.lib; {
    descriptin = "A cargo plugin to generate Xcode Instruments trace files";
    homepage = "https://github.com/cmyr/cargo-instruments";
    license = licenses.mit;
    maintainers = with maintainers; [ shnarazk ];
    platforms = platforms.darwin;
  };
}
```

### 2. /pkgs/top-level/all-packages.nix

```diff
modified   pkgs/top-level/all-packages.nix
@@ -9205,6 +9205,10 @@ in
   cargo-inspect = callPackage ../development/tools/rust/cargo-inspect {
     inherit (darwin.apple_sdk.frameworks) Security;
   };
+  cargo-instruments = callPackage ../development/tools/rust/cargo-instruments {
+    inherit (darwin) libiconv;
+    inherit (darwin.apple_sdk.frameworks) Security CoreFoundation;
+  };
   cargo-make = callPackage ../development/tools/rust/cargo-make {
     inherit (darwin.apple_sdk.frameworks) Security;
   };
```

ちゃんと動いているので、nixpkgs に入れてもらおうかな。
