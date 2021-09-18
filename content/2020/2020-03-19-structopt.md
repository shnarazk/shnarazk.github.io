---
title: Passing args to StructOpt
date: 2020-03-19
extra:
  subtitle: which start with '--'
taxonomies:
  tags: ["Rust"]
---

[SAT-bench](https://github.com/shnarazk/SAT-bench)はRust製SATソルバ
[Splr](https://github.com/shnarazk/splr)のベンチマーク支援Rust製ツールです。
設定を変えてベンチマークを実行するためにSplrへのオプションを受け渡せるように以下のような`Config`になっ
ています。

```rust
#[derive(Clone, Debug, StructOpt)]
#[structopt(name = "sat-bench", about = "A SAT Competition benchmark runner")]
pub struct Config {
    /// the problem
    #[structopt(long = "benchmark", short = "B", default_value = "SR19Core")]
    pub benchmark_name: String,
    /// solver names
    #[structopt(long = "solver", short = "s", default_value = "")]
    pub solver: String,
    /// arguments passed to solvers
    #[structopt(long = "options", default_value = "")]
    pub solver_options: String,
    ...
```

実行するときには

```
$ benchm --benchmark "SR19" --solver splr
```

のように実行するのですが、いざオプションを設定しようとすると

```
$ benchm --benchmark "SR19" --solver splr --options "--without-elim" -j 3
error: Found argument '--without' which wasn't expected, or isn't valid in this context
```

となってしまう。ダブルクォートで括っているから明らかに文字列なんだけどそれが意味をなしていない。
これはバグだと思うのだけど1年以上経っても直る気配はないので対処療法があるはず。探してみたら


```
$ benchm --benchmark "SR19" --solver splr --options \\--without-elim -j 3
```

ということだった。shell と structopt の二つのレベルのエスケープが必要。
対象文字列が空白文字を含むなら

```
 benchm --benchmark "SR19" --solver splr --options \\--rt\\ 0.8 -j 3
```

とすることで `--rt 0.8` を渡せるようになるみたいだ。
つまり、 `nix-env -qa` で正規表現を使う場合と同じことでした。
