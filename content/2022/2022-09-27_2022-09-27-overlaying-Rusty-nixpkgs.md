---
title: Overlaying Rustic Nixpkgs
updated: 2022-09-28
extra:
  subtitle: how to fix openssl problem
taxonomies:
  tags: ["nix", "rust"]
---
# Rust crateをNix flakeにしたい場合のあれこれ

## ちょっと試したいcrateがopensslを要求する場合

pkg-configとopenssl-devが必要。さらにpkg-configにopensslの情報を渡してやることが必要。
なので以下のようになる
（なぜか私の環境では相変わらずnix-shellが追加した環境をprofileに渡せないままなのだ）。

```sh
$ nix shell nixpkgs#pkg-config nixpkgs#openssl
$ PKG_CONFIG_PATH=/nix/store/${OPENSSL_DEV}/lib PATH=/nix/store/${PKG_CONFIG}/bin cargo build
```

## crateのバージョンを上げるために`cargoSha256`を変更する必要がある場合

- https://discourse.nixos.org/t/is-it-possible-to-override-cargosha256-in-buildrustpackage/4393

```nix
cargoDeps = PACKAGE.cargoDeps.overrideAttrs (lib.const {
  name = "${pname}-vendor.tar.gz";
  inherit src;
  outputHash = "sha256-AyRsxT+4TdRdtKrodK+7N+Y/UkeA67OepnMLIpK1WR8=";
});
```

`cargoSha256`は評価されてしまって`cargoDeps.outputHash`なる内部データになってしまっているそうだ。

## 2022-09-28:「私の環境では相変わらずnix-shellが追加した環境をprofileに渡せない」理由

アホのような原因だった。.bashrc, .zshrcの中でPATHをリセットしていたからだった。
SHELLを/bin/shに切り替えるとちゃんと動作することから判明しました。

