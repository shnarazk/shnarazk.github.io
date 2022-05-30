---
title: Calling Rust functions from Cuis-Smalltalk
extra:
  subtitle: FFI!
  banner: /2022/2022-05-30_banner.jpg
taxonomies:
  tags: ["Rust", "Smalltalk", "CuisSmalltalk"]
---
## 

なんということはない。

## Rust side

1. まず、crateを準備

2. Cargo.toml

```toml
[lib]
crate-type: ["cdylib"]
```

3. src/lib.rs

```rs
#[no_mangle]
pub extern "C" fn rustfunc1(...) -> ... {
      ...
}
```

4. `cargo build --release`

## Smalltalk side

1. Package Installer でFFIをインストール

2. Classを作りメソッドを用意

```smalltalk
test: arg
  <cdecl: returnType 'rustfunc1' (argTypes) module:  '/path-to-home-directory/.cargo/shared-target/release/crate_name.dylib' >
  ^self externalCallFailed
```

なお、cargo artifactsの置き場は共通、OSはMacOSを想定。

細かいことは https://wiki.squeak.org/squeak/2426 を参照のこと。

あっという間にできちゃった。
