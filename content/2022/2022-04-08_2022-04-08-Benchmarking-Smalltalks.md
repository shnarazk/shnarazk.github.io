---
title: Benchmarking Squeak, Pharo and Cuis
updated: 2021-04-09
extra:
  subtitle: Let's pi
taxonomies:
  tags: ["Squeak", "Cuis", "Pharo", "Smalltalk", "Rust"]
---
### 2022-04-09

- 最近のVMでCuisを測り直してみたけど、まあ大きな変化はありませんでした。
- Rayonを使った並列版Rustを追加しました。

# They depend on opensmalltalk-vm, of course.

全くつまらないPHPでのプログラミングなどというようなものをやらされているので、そんなもん使うくらいならSmalltalkの方がマシ。
とイライラが募り続けたせいで数年ぶりにSmalltalkをインストールしてチュートリアルをやりたい病にかかりました。

今回は[Cuis Smalltalk](http://www.cuis-smalltalk.org)を試してみたのが新しいところ。
と思っていたらちょうど[Pharo 10](https://pharo.org/news/pharo10-released)が出たのでそっちも試してみた。
さらにオープンソースがforkすると大抵本家はダメになっていくものだけど(X-Window Systems, Owncloud, LibreOffice, ...)、では現状一体どうなっているのか日本語の情報が全く途絶えてしまった[Squeak](https://squeak.org)もついでにインストールして久しぶりにいじってみました。

結論から言うと個人的にはやっぱり型リッチな静的型付け関数型プログラミング全面支援言語をemacsかhelixでnixpkgsの基で作って使うのが一番だなあという結論なのだが、でもそれなりにSmalltalkは面白い。
実際のところどれ使ってもそれなりに面白いと言って過言ではない。
そしてダメダメな印象だったSqueakも十分に綺麗なデスクトップ環境で楽しく使えるのが今回の発見。
PHPよりはるかに楽しい。PHPよりはるかに楽しい。PHPよりはるかに楽しい。PHPよりはるかに楽しい。
金のためにXXXXXXXXX以下省略。

3大オープンソースSmalltalk語族をインストールしているというなかなかない状況なので、ベンチマークしてみた。題材は[円周率の計算](https://youtu.be/skh9suWVoD8)というnumber crunchingもの。
プラットフォームはMacOS 12.3.1, x86-64.

|  language / implementation        |   N    |              value | tallies | time(msec.) |
|-----------------------------------|-------:|:-------------------|--------:|------------:|
| Squeak 6.0alpha-21557-64bit.image | 100000 | 3.141602653489794  |  31,129 |  31,511     |
|                                   | 200000 | 3.1415976535647934 | 126,296 | 127,893     |
| Pharo10                           | 100000 | 3.141602653489794  |  32,107 |  32,107     |
|                                   | 200000 | 3.1415976535647934 | 129,213 | 129,213     |
| Cuis6.0-5105 + vm 6cd4bb2         | 100000 | 3.141602653489794  |  19,289 |  36,136     |
|                                   | 200000 | 3.1415976535647934 |  76,744 | 145,776     |
| Cuis6.0-5069.image                | 100000 | 3.141602653489794  |  17,571 |  37,985     |
|                                   | 200000 | 3.1415976535647934 |  77,079 | 150,123     |
|                                   |        |                    |         |             |
| Rust with [rug-1.15.0](https://crates.io/crates/rug) on [GMP](https://gmplib.org/) | 100000 | 3.1416026534897936 |      -- | 2.38 x 10^3 |
|                                   | 200000 | 3.141597653564793  |      -- | 9.78 x 10^3 |
| Rust with Rayon                   | 100000 | 3.1416026534897936 |      -- | 0.18 x 10^3 |
|                                   | 200000 | 3.141597653564793  |      -- | 0.61 x 10^3 |

まあcriterion使ったわけではなく、JITなシステムで一回のみの実行結果をまとめたものだから、細かい数値差には意味がないのは気に留めておく必要があるので、まずは大差なしというべきだろう。
Pharoなんか速くなってそうな印象があるのだけど結局同じ（ような）VMに依存しているので大きなアドバンテージがあるわけではないようだ。

そして、逆にSqueakが意外にいいじゃん(別に時代遅れなのはお前ら全部だw)という印象をここでも受けることになってしまった。

なのでここまではどれを使っても同じようなものという結論。
ただしSqueakのauto completion frameworkが一番肌に合わなかった、ドキュメントが全然更新されてなくてチュートリアル本すらないので敷居がどんどん高くなっているということは付け加えておきます。

さらに言うとPharoも公式サイトでリンクされたドキュメントが全然更新されない、または存在しないのでストレス溜まる。
Spec2とかFluidとかだから何なのか？
なんかRustと文化が違う。

### ついでにRustも-- 2022-04-08

GMPをwrapしたライブラリで有理数を実装したRust版だとまあ10倍速い。

```rust
use rug::Rational;

fn main() {
    let limit = 200_000;
    let mut curr_sum: Rational = Rational::from((1i64, 1i64));
    let mut denominator: i64 = 3;
    let mut adding = false;
    for _ in 0..limit {
        if adding {
            curr_sum += Rational::from((1i64, denominator));
        } else {
            curr_sum -= Rational::from((1i64, denominator));
        }
        denominator += 2;
        adding = !adding;
    }
    println!("limit:{} => {}", limit, 4.0 * curr_sum.to_f64());
}
```

そして、Rayonで自動並列化をさせると（8core CPU）、「一瞬」で終わってしまう。
Smalltalkはmulti coreやGPUといった現在のハードウェア資源をどう有効利用するのかという点でブレークスルーが必要だなあ。

```rust
use {rayon::prelude::*, rug::Rational};

fn main() {
    let limit = 200_000;
    let result = (0i64..=limit)
        .into_par_iter()
        .map(|i| if i % 2 == 0 { 2 * i + 1 } else { -2 * i - 1 })
        .map(|denominator| Rational::from((1i64, denominator)))
        .reduce(
            || Rational::from((0i64, 1i64)),
            |sum: Rational, frac: Rational| sum + frac,
        );
    println!("limit:{} => {}", limit, 4.0 * result.to_f64());
}
```
