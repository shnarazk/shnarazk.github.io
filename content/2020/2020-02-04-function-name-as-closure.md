---
title: Function name as a 1-argumented closure
date: 2020-02-04
extra:
  subtitle: more functional style
taxonomies:
  tags: ["rust"]
---
rustc 1.41でcargo clippyを走らせて以下が指摘された。

```
cargo clippy
    Checking splr v0.3.0 (/Users/nash/Repositories/splr)
warning: redundant closure found
   --> src/types.rs:394:69
    |
394 |         let fs = File::open(path).map_or(Err(SolverError::IOError), | f | Ok(f))?;
    |                                                                     ^^^^^^^^^^^ help: remove closure as shown: `Ok`
    |
    = note: `#[warn(clippy::redundant_closure)]` on by default
    = help: for further information visit https://rust-lang.github.io/rust-clippy/master/index.html#redundant_closure
```

ということで以下のように変更した。

```diff
-        let fs = File::open(path).map_or(Err(SolverError::IOError), |f| Ok(f))?;
+        let fs = File::open(path).map_or(Err(SolverError::IOError), Ok)?;
```

なんだ、こう書けたのか。随分と関数型プログラミングらしくなるな。
