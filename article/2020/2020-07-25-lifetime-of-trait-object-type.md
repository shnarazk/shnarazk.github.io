---
title: まとめて借用
subtitle: in Rust
date: 2020-07-27
tags: ["Rust"]
---
オブジェクトからフィールドを借用したい。
借用したいオブジェクトの型がいくつもあり、型ごとに借用したい個数が違うので、できるだけgenericなtrait化が望ましい。
よくわかってないとこの程度のことでもつまづいてしまうのでメモしておく。

### Box

困った時は一旦スタックに持っていく、そのために `Box` を使う、という定石を使ってみるとこうなる。

```rust
pub trait Export<'a, T> {
    fn exports(&'a self) -> Box<T>;
}

impl<'a> Export<'a, (&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2)> for Restarter {
    fn exports(&'a self) -> Box<(&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2)> {
        Box::from((&self.asg.ema, &self.lbd.ema, &self.mld.ema, &self.mva.ema))
    }
}
```

問題なくコンパイルできる。

### タプル

タプルに置き換えても問題ない。

```rust
pub trait Export<'a, T> {
    fn exports(&'a self) -> T;
}

impl<'a> Export<'a, (&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2)> for Restarter {
    fn exports(&'a self) -> (&'a Ema2, &'a Ema2, &'a Ema2, &'a Ema2) {
	    (&self.asg.ema, &self.lbd.ema, &self.mld.ema, &self.mva.ema)
    }
}
```

### CoWs in tuple

さらに一般化して定数データもコピーなしで返すために[CoW](https://doc.rust-lang.org/std/borrow/enum.Cow.html)でくるんでも全然問題ない。

```rust
use std::borrow::Cow;

trait Export<'a> {
    fn export(&'a self) -> (Cow<'a, &Ema2>, Cow<'a, &Ema2>);
}

impl<'a> Export<'a> for Restarter {
    fn export(&'a self) -> (Cow<'a, &Ema2>, Cow<'a, &Ema2>) {
        (Cow::Owned(&self.asg.ema), Cow::Owned(&self.lbd.ema))
    }
}
```

ただし、これは2要素タプルに特定してしまっている。

一般化した問題に戻して、

```rust
trait Export<'a, T> {
    fn export(&'a self) -> T;
}
```

とするなら、

```rust
impl<'a> Export<'a, (Cow<'a, &'a Ema2>, Cow<'a, &'a Ema2>)> for Restarter {
    fn export(&'a self) -> (Cow<'a, &'a Ema2>, Cow<'a, &'a Ema2>) {
        (Cow::Owned(&self.asg.ema), Cow::Owned(&self.lbd.ema))
    }
}
```

とすればいい。どれも全く同じことだった。

# エンバグ

なお、これを

```rust
impl<'a> Export<'a, (Cow<'a, &Ema2>, Cow<'a, &Ema2>)> for Restarter
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
32 |     fn exports(&'a self) -> (CoW('a, Ema), CoW('a, Ema));
   |                                  ^^
```

ちゃんとライフタイム制約まで目を配りましょうというだけのことでした。
