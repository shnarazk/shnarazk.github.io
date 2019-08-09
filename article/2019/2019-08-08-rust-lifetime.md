---
title: A trait definition with lifetimes
subtitle: 生存期間もややこしい
date: 2019-08-08
tags: ['Rust']
---

あるプログラムでアルゴリズムのバリエーションを併用するため、以下のトレイトが必要になったとしよう。

```rust
pub trait RestartHeuristics {
    type Item;
    fn add(&mut self, item: Self::Item);
    ...
```

ここで、実装ごとにメソッド`add`に渡す引数を変えたいので、関連型`Item`を引数の型としてもたせた。
例えば、以下のような実装を実現したい。

- 単なる数値(`f64`)を受け取って計算する`add`
- 何か構造体へのmut pointer(`&mut Var`)をもらってそれに対して変更を加えながら計算する`add`

それぞれ以下のような定義になった。

```rust
impl RestartHeuristics for RestartByLBD {
    type Item = usize;
    fn add(&mut self, item: Self::Item) {...
```

そして問題となる二つ目の定義：

```rust
impl RestartHeuristics for VarSet {
    type Item = &mut Var;
    fn add(&mut self, v: Self::Item) {...
```

これで `r.add(4);` とか `r.add(&mut v);` とか自由に書けてスマート。
つまり、意味もなく`r.add(&mut 4)`なんてことを強制されずに済んだ。
ところが、これはコンパイルエラーになる。

```
error[E0106]: missing lifetime specifier
   --> src/var.rs:114:17
    |
114 |     type Item = &mut Var;
    |                 ^ help: consider using the named lifetime: `&'a`
```

ポインタを渡しているので生存時間が必要らしい。うーむ、メソッド`add`の中ではCopy可能なフィールドを参
照、変更するだけなので生存時間が問題になることはないと思うのだけど。。。
ともあれ、上記のヘルプに従ってこの引数に生存時間を追加した。


```rust
impl RestartHeuristics for VarSet {
    type Memory = Ema2;
    type Item = &'a mut Var;
    fn add(&mut self, v: Self::Item) {
```

すると以下のエラー。

```
error[E0261]: use of undeclared lifetime name `'a`
   --> src/var.rs:114:18
    |
114 |     type Item = &'a mut Var;
    |                  ^^ undeclared lifetime
```

なので、生存期間`'a`をパラメータとして宣言できる唯一の場所`impl`に追加する（ここが間違い）。

```
impl<'a> RestartHeuristics for VarSet {
    type Memory = Ema2;
    type Item = &'a mut Var;
    fn add(&mut self, v: Self::Item) {
```

すると今度は以下のエラー。

```
error[E0207]: the lifetime parameter `'a` is not constrained by the impl trait, self type, or predicates
   --> src/var.rs:112:6
    |
112 | impl<'a> RestartHeuristics for VarSet {
    |      ^^ unconstrained lifetime parameter
```

定義したものはトレイト（指示詞）かself型か述語(predicates)中で使え、だそうなので、
トレイトに追加してみる。

```rust
pub trait RestartHeuristics<'a> {
    type Item;
    fn add(&mut self, item: Self::Item);
```

ここで、この生存期間パラメータの追加を各実装に反映させないと以下のエラーになる。

```
error[E0726]: implicit elided lifetime not allowed here
   --> src/restart.rs:100:6
    |
100 | impl RestartHeuristics for RestartByLBD {
    |      ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `<'_>`

error[E0726]: implicit elided lifetime not allowed here
   --> src/var.rs:112:10
    |
112 | impl<'a> RestartHeuristics for VarSet {
    |          ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `<'_>`
```

以下のように各実装に追加して、これで解決。

- ポインタが出てくるのでトレイトには生存期間パラメータが必要
- `usize`に対してはワイルドカードでOK
- 構造体へのポインタに対しては、それをトレイトのパラメータに反映

```rust
impl RestartHeuristics<'_> for RestartByLBD {
    type Item = usize;
    fn add(&mut self, item: Self::Item) {...
```	
	
```rust
impl<'a> RestartHeuristics<'a> for VarSet {
    type Item = &'a mut Var;
    fn add(&mut self, item: Self::Item) {...
```
