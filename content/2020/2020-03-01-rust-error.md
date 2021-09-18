---
title: A Weird Rust Compile Error
date: 2020-03-02
extra:
  subtitle: by structopt-derive or proc-macro2
taxonomies:
  tags: ["Rust", "splr"]
---
突然、こんなコンパイルエラーが出るようになった。

```
 cargo install --path . --force
  Installing splr v0.3.1
   Compiling structopt-derive v0.4.2
error[E0277]: the trait bound `syn::expr::Expr: std::clone::Clone` is not satisfied
  --> ~/.cargo/registry/src/github.com-1ecc6299db9ec823/structopt-derive-0.4.2/src/attrs
.rs:28:10
   |
28 |     Skip(Option<Expr>),
   |          ^^^^^^^^^^^^
   |          |
   |          expected an implementor of trait `std::clone::Clone`
   |          help: consider borrowing here: `&Option<Expr>`
   |
   = note: required because of the requirements on the impl of `std::clone::Clone` for `std::option::Option<syn::expr::Expr>`
   = note: required by `std::clone::Clone::clone`
```

他のリポジトリではならない。いくつか古いコミットまで戻すとエラーがなくなる。
どうも、proc-macro2のバージョンが上がった後でcargo updateしたのが原因で、その結果
何か変なのをダウンロードしているような気がするのだが、
他のリポジトリでcargo updateしてもこうはならない。ぐぐっても特に引っかかるものはなし。
うーむ、何がいかんのだろうか。

とりあえず、古いcargo.lockを持ってきてコンパイルするときには

```
cargo install ... --frozen --offline
```

とすることで急場を凌ぐことにした。

## 2020-03-02

`structopt-derive`のバージョンが0.4.4に上がっている。エラーもなくなったようだ。


