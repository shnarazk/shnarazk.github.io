----
title: Lifetime of trait object type
subtitle:
date: 2020-07-27
tags: ["Rust"]
----
オブジェクトからフィールドを借用したい。
借用したいオブジェクトの型がいくつもあり、型ごとに借用したい個数が違うので、できるだけgenericなtrait化してみた。
よくわかってないとこの程度のことでもつまづいてしまうのでメモしておく。

### Box

困った時は一旦スタックに持っていく、そのために `Box` を使う、という定石を使ってみるとこうなる。

```rust
pub trait ExportBox<'a, T> {
    fn exports_box(&'a self) -> Box<T>;
}

impl<'a> ExportBox<'a, (&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2)> for Restarter {
    fn exports_box(&'a self) -> Box<(&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2)> {
        Box::from((&self.asg.ema, &self.lbd.ema, &self.mld.ema, &self.mva.ema))
    }
}
```

問題なくコンパイルできる。

### タプル

タプルに置き換えても問題ない。

```rust
pub trait ExportEma<'a, T> {
    fn exports_ema(&'a self) -> T;
}

impl<'a> ExportEma<'a, (&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2)> for Restarter {
    fn exports_ema(&'a self) -> (&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2) {
	    (&self.asg.ema, &self.lbd.ema, &self.mld.ema, &self.mva.ema)
    }
}
```

### CoW

さらに一般化して定数データもコピーなしで返すためにCoWでくるんでも全然問題ない。

```rust
use std::borrow::Cow;

trait ExportCow<'a> {
    fn export(&'a self) -> (Cow<'a, &Ema2>, Cow<'a, &Ema2>);
}

impl<'a> ExportCow<'a> for Restarter {
    fn export(&'a self) -> (Cow<'a, &Ema2>, Cow<'a, &Ema2>) {
        (Cow::Owned(&self.asg.ema), Cow::Owned(&self.lbd.ema))
    }
}
```

ただし、これは2要素タプルに特定してしまっている。

一般化した問題に戻して、

```rust
trait ExportCow<'a, T> {
    fn export(&'a self) -> T;
}
```

とするなら、

```rust
impl<'a> ExportCow<'a, (Cow<'a, &'a Ema2>, Cow<'a, &'a Ema2>)> for Restarter {
    fn export(&'a self) -> (Cow<'a, &'a Ema2>, Cow<'a, &'a Ema2>) {
        (Cow::Owned(&self.asg.ema), Cow::Owned(&self.lbd.ema))
    }
}
```

とすればいい。どれも全く同じことだった。
なお、これを

```rust
impl<'a> ExportCow<'a, (Cow<'a, &Ema2>, Cow<'a, &Ema2>)> for Restarter
```

などとして、ライフタイム制約が不十分なものに（うっかり）してしまうと、

```
error[E0308]: method not compatible with trait
   --> src/solver/restart.rs:833:5
    |
833 |     fn export(&'a self) -> (Cow<'a, &'a Ema2>, Cow<'a, &'a Ema2>) {
    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ lifetime mismatch
    |
    = note: expected fn pointer `fn(&'a solver::restart::Restarter) -> (std::borrow::Cow<'_, &types::Ema2>, std::borrow::Cow<'_, _>)`
               found fn pointer `fn(&'a solver::restart::Restarter) -> (std::borrow::Cow<'_, &'a types::Ema2>, std::borrow::Cow<'_, _>)`
```

だとか、

```
error[E0308]: method not compatible with trait
   --> src/solver/restart.rs:833:5
    |
833 |     fn export(&'a self) -> (Cow<'a, &Ema2>, Cow<'a, &Ema2>) {
    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ lifetime mismatch
    |
    = note: expected fn pointer `fn(&'a solver::restart::Restarter) -> (std::borrow::Cow<'_, &types::Ema2>, std::borrow::Cow<'_, &types::Ema2>)`
               found fn pointer `fn(&'a solver::restart::Restarter) -> (std::borrow::Cow<'_, &'a types::Ema2>, std::borrow::Cow<'_, &'a types::Ema2>)`
note: the lifetime `'_` as defined on the impl at 832:33...
```

と言われてしまうが、まあそりゃ当たり前のことである。

以下は単なる文法間違いがもたらしたエラー。

```
error: lifetime in trait object type must be followed by `+`
  --> src/types.rs:32:38
   |
32 |     fn exports_ema(&'a self) -> (CoW('a, Ema), CoW('a, Ema));
   |                                      ^^
```

ちゃんとライフタイム制約まで目を配りましょうというだけのことでした。
