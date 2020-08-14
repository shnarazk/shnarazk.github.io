---
title: Clause Vivification updated 2020
subtitle: vivification part 2
date: 2020-08-14
tags: ["SAT", "vivification", "splr"]
banner: "https://images.unsplash.com/photo-1586508217007-6e8b3151a6f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80"
---
**cover image: https://unsplash.com/photos/tYs9rjaT8Vc**

Vivification についての調査第2弾、2018年投稿2019年公開の論文をまとめてみた。

* Chu-Min Li *et al.*, "Clause vivification by unit propagation in CDCL SAT solvers,”*Artif. Intell.*, vol. 279, 2019.

### Outline

Vivificationは魅力的な節削減手法のでSAT competitionに提出されるようなソルバに導入されたもの、その後改善が計算量に見合わないため、取り下げられることが続いてきた。
この論文はどのタイミングで、どの節を、どのリテラルからvivifyすればよいかについて論じている。
特に[原論文](/2020/2020-06-20-vivification/)では'future work'としてのみ触れられていたin-processorとして使う場合の改善に重きを置いている。
なお、Cadicalはこの論文で提案された手法とは無関係。所与の節にもvivificationをするべきだという主張の傍証実験に使われただけ。ただし、Cadicalが使っているのは著者らの別の論文に基づくものなので、無関係とは言い過ぎかも。

結論は以下の通り。

* タイミング -- 節削減の後のリスタート
* 対象節 -- LBD順で対象集合の半分
  * 与えられた節 -- LBDが20以下の学習節の導出に使われており、LBDが1になる、またはLBDが3回減少すれば再び対象に加える。それとは別に pre-processing phase で$10^8$リテラルまで処理する。
  * 学習節 -- LBDが1になる、またはLBDが2回減少すれば再び対象に加える
* リテラル順 -- as is

なお、以下のようにin-processor向けに `vivify` のアルゴリズムが変更されている。

![](/img/2020/07-05/vivi-algo3.jpg)

* ~~なんか怪しい。なぜ $\phi \cup \neg C'$ なのだ？ どうして$C$に含まれていたリテラルの否定を集めた節が$\text{vivified} C = C'$ なのだ~~ ここがミソ。
* 何にせよ最初に存在した節は17行目で必ず削除される。
* 17行目は一つ内側のループに含まれるはずですけど。


### 節$C$が冗長であることを言う。

数学的準備：

* $(\phi, \omega) \models \omega'$は節集合$\phi$と部分割当集合$\omega$から無矛盾な割り当て集合$\omega'$が導出されることを意味する。割当が空でも$\omega$を導出できるなら$\phi \models \omega$とも書く。
* $(\phi, \omega)$が矛盾を起こしているなら$\bot$で矛盾を表し、$(\phi, \omega) \models \bot$と書くことにする。
* 節$C$が冗長とは式$\phi$と$\phi\setminus{C}$が論理的に等値であることを意味する。
* 一般に節$C$に含まれる全てのリテラルを否定した節を$\neg C$と書くと$\forall C: (C \cup \neg C) \models \bot$が成立する。
* （⭐️）一般に節$C$に対して自身の部分節$C'$の否定節$\neg C'$を加えることで矛盾が生じる（$C \cup \neg C' \models \bot$）なら、節$C$は$C'$に包含される。節$C$はリテラル$l' \in C\setminus{C'}$に対して何の制約にもなっていない。

1. 前提として$\phi \nvDash \bot$であるとする。
1. ある節Cの部分節$C'$の否定節を加えても矛盾を導出しないなら、それは節Cは$C\setminus{C'}$に包摂できることを意味している。
1. そのような部分節にリテラル$l' \in C$の否定を加えた節を追加すると矛盾が起きたとする。それは部分節または$l'$のどちらかが充足することが必要であることを意味している。これは$\phi$から導出された学習節である（$\phi$の論理的帰結）。
1. 学習節$\neg \neg C' \cup \{\neg \neg l'\} = C' \cup l'$は節$C$の部分節である。なので（⭐️）より置き換えてよい。

### 余談

* COMiniSATPS, MapleCOMSPS, MapleCOMSPS_LRB は学習節の3層管理をしている。節削減対象はLOCALのみ。
  * CORE -- LBDが小さいもの
  * TIER2 --　LBDが中間のもの。長期間依存グラフに現れないと格下げ。
  * LOCAL -- それ以外
* COMiniSATPS, MapleCOMSPS, MapleCOMSPS_LRB はGulcose的なリスタートフェーズとLuby列に基づくリスタートフェーズを交互に使っている。これはStabilizationの先駆け？


### 2020-07-05 Splr approach

```rust
fn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) {
    'next_clause: for ci in clauses.iter() {
        let c: &Clause = &cdb[ci];
        if c.is(Flag::DEAD) { continue; }
        let mut copied: Vec<Lit> = Vec::new();
        let mut vivified: Vec<Lit> = Vec::new();
        for l in c.lits.clone().iter() {
            match asg.assigned(*l) {
                Some(false) => copied.push(!*l),            // Rule 1
                Some(true) => continue 'next_clause,        // Rule 2'
                None => {
                    let cid: Option<ClauseId> = match copied.len() {
                        0 => None,
                        1 => { asg.assign_by_decision(copied[0]); None }
                        _ => Some(cdb.new_clause(asg, &mut copied)), // L.12
                    };
                    asg.assign_by_decision(!*l);
                    let cc = asg.propagate(cdb);
                    if cc != ClauseId::default() {
                        vivified = asg.minimize(cdb, &v, &cdb[cc].lits); // Rule 3
                    }
                    if let Some(cj) = cid { cdb.remove_clause(cj); }
                    asg.cancel_until(asg.root_level);
                    if cc != ClauseId::default() { break; }
                    copied.push(!*l);                       // Rule 4
                }
            }
        }
        if vivified.is_empty() {
            for l in &mut copied { *l = !*l; }
            std::mem::swap(&mut vivified, &mut copied);
        }
        match vivified.len() {
            0 => break 'next_clause,
            1 => {
                asg.assign_at_rootlevel(vivified[0]).expect("impossible");
                assert!(asg.propagate(cdb) == ClauseId::default(), "UNSAT");
            }
            _ => cdb.new_clause(asg, &mut vivified),
        }
        cdb.remove_clause(*ci);
    }
}
```

* 空節の取り扱い（Rule 1'）、充足節の除去（Rule 2）はsolverに任せるのがいいだろうから、こう変更することにした。ただ、空節があるのに先に行っていいものだろうかという疑問はある。また、空節の場合のみ31行が成立するから8行めは無意味かも。

```diff
-                 Some(false) => copied.push(!*l),            // Rule 1
+                 Some(false) => continue,                    // Rule 1'
```

### 2020-07-07

読了。そして理解した。プログラムを論文に忠実なものにした。
読む前はその分量に抵抗を感じていたのだけど、意外に素直な読みやすい論文だった。
「permanent clauseは `rank` を変更しない」というマイクロチューニングを放棄する日が来るとは。。。

* Rule 1が正しいものに戻された
* Rule 2が正しいものに戻された
* 部分節なのかその否定なのかを変数`flipped`で保持
* flippedの役割も担っていた変数`vivified`は削除
* 部分節が空節の場合でも処理を続ける
* 部分節が単位節の場合の検査は省略して、そのまま例外を上流に投げる

```rust
fn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) -> MaybeInconsistent {
    let mut clauses: Vec<ClauseId> = Vec::new();
    for (i, c) in cdb.iter_mut().enumerate() {
        if c.to_vivify() { clauses.push(ClauseId::from(i)); }
    }
    clauses.sort_by_key(|ci| cdb[*ci].rank);
    for ci in clauses.iter() {
        let c: &mut Clause = &mut cdb[ci];
        let mut copied: Vec<Lit> = Vec::new();
        let mut flipped = true;
        'this_clause: for l in c.lits.iter() {
            match asg.assigned(*l) {
                Some(false) => continue 'this_clause,         // Rule 1
                Some(true) => {
                    copied.push(!*l);
                    let r = asg.reason_literals(cdb, *l);
                    copied = asg.minimize(cdb, &copied, &r);  // Rule 2
                    flipped = false;
                    break 'this_clause;
                }
                None => {
                    let cid: Option<ClauseId> = match copied.len() {
                        0 => None,
                        1 => { asg.assign_by_decision(copied[0]); None }
                        _ => Some(cdb.new_clause(asg, &mut copied)),
                    };
                    asg.assign_by_decision(!*l);
                    let cc = asg.propagate(cdb);
                    copied.push(!*l);                         // Rule 4
                    if cc != ClauseId::default() {
                        let r = cdb[cc].lits.clone();         // Rule 3
                        copied = asg.minimize(cdb, &copied, &r);
                        flipped = false;
                    }
                    asg.cancel_until(asg.root_level);
                    if let Some(cj) = cid { cdb.remove_clause(cj); }
                    if cc != ClauseId::default() { break 'this_clause; }
                }
            }
        }
        if flipped { flip(&mut copied); }
        match copied.len() {
            0 => (),
            1 => asg.assign_at_rootlevel(copied[0])?,
            _ => cdb.new_clause(asg, &mut copied),
        }
        cdb.remove_clause(*ci);
    }
	Ok(())
}
```

### 2020-07-08

ほぼ完成。
色々とチューニング中。
途中で答えの充足性が無茶苦茶になってしまってまた大変なデバッグが始まるのかと思いきや、原因を追っていくと決定レベルが0でないところでvivificationをしていただけだった。

修正しながら、このコードは特に決定レベル0に依存するところはないなあ（lockされた節さえ避ければよい）と気づいたのだが、さて、そうすると、解の近くにきた場合にrandom walkというかbelief propagationというか、そういうのの代わりに使えないものだろうか。。。。

それは無理。12行目で割当てを調べているが、この値は現在の部分割当て列に依存している。これは単なる仮説。
従ってこの結果に基づいてリテラルを削除したり簡略化したりはできない。

### 2020-07-09

L45で追加してL47削除するのは無駄なので対消滅させた。なぜかinconsistent errorが出た。
`propagate`が矛盾を返す。なぜだろう。

そのうちなくなった。。。

### 2020-07-22

250変数の問題でpanicを起こした！
トレースしてみると、27行目の`assign_by_decision`が実際には矛盾を発生していたにも関わらず、この関数は例外を投げないので、後の伝播で問題が発生したようだ。
propagate側の関数にはあまり手を入れたくなかったので、27行目の前にチェックを入れることにして対応した（24行目の方は論理的に大丈夫なはず）。
まさか、こんな小さな問題でバグが検出されるとは。

ついでに45行目の前にbiclauseだったら重複検査もすることにした。


### 2020-08-14

まだバグが出る。
やはりL44の`asg.assign_at_rootlevel(copied[0])?`で変数がassertされたら直後に`propagate`しないと、伝播の取りこぼしが起きてしまうようだ。
vivificationの対象リテラル数を増やすと現れてきたのでおそらくこの解釈でいいんだと思う。

