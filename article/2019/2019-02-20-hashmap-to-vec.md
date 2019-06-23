---
title: Make Vec from HashMap in Rust
subtitle: 関数型プログラミング的にHashMapからVecを作る
date: 2019-02-20
tags: ["rust"]
---

Think about [HashMap](https://doc.rust-lang.org/std/collections/struct.HashMap.html)

```rust
Struct std::collections::HashMap

    pub fn insert(&mut self, k: K, v: V) -> Option<V>
        Inserts a key-value pair into the map.

    pub fn keys(&self) -> Keys<K, V>[src]
        An iterator visiting all keys in arbitrary order. The iterator element type is &'a K.
```

As a straight application of `insert`, the following code seems to work well.

```rust
// collect keys of a HashMap into a Vec
let h: HashMap<K, V>;
let v: Vec<_> = h.keys().collect();
```

But in some case this is troublesome. For example,

```rust
// key is String
let h: HashMap<String, V>;
return h.keys().collect::<Vec<String>>();
```

is a type mismatch because the return type of `keys` is the reference to key:

```
error[E0277]: a collection of type `std::vec::Vec<std::string::String>` cannot be built from an iterator over elements of type `&std::string::String`
```

To fix it, make `hash` hold `&String` as *key*:

```rust
// change the key's type
let h: HashMap<&String, V>;
return h.keys().collect::<Vec<&String>>();
```

it emits another error in this case:

```
error[E0515]: cannot return value referencing local variable `h`
```

How about dereferencing and *injecting* them to the return value?

```rust
// &String to String
let h: HashMap<&String, V>;
let v: Vec<String> = h.keys().map(|k| *k).collect();
```

It can't work (we can't destruct data in order to make a return value):

```
error[E0507]: cannot move out of borrowed content
```

So we need to copy them explicitly, if `K` doesn't have `Copy` trait.

```rust
let hash: HashMap<String, V>;
return hash.keys().map(|k| k.to_string()).collect::<Vec<String>>();
```

But this code may contain unwanted memory copy. So make `hash` hold the reference.


```rust
// `hash` points the original data to avoid double allocation
let hash: HashMap<&String, V>;
return hash.keys().map(|k| k.to_string()).collect::<Vec<String>>();
```

That's it.
