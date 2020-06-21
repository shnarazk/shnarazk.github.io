---
title: Vivification of a CNF formula
subtitle: as a CNF preprocessor
date: 2020-06-20
tags: ["SAT"]
---
Vivification がなんなのか、日本語で探しても出てこないので以下の論文をまとめてみた。
（最新の話かと思っていたけど2008年とは。。。）

* C. Piette, Y. Hamadi, and L. Saïs, "Vivifying propositional clausal formulae,” *Front. Artif. Intell*. Appl., vol. 178, pp. 525–529, 2008.

Splr でいうところの `processor` が節数に対する制約内での網羅的な変数除去と節包摂(clause subsumption)とを実行するのに対し、vivification は（その節に「対応」する割り当てを仮定して）propagateを行った結果を用いて節の包摂方針を決めるというもの。
その分、不要な複雑さの導入を抑えることができるらしい。
効果は1割程度のようである。

# アルゴリズム（上記論文より引用）

![](/img/2020/06-20/algorithm1.jpg)

* 6行目で *c* を $\Sigma$ から削除して、30行目で戻している。しかし $\Sigma$ に対する伝播は行わないので、30行目まで残しておいても構わない。
* 20行目の解釈： 節 *c* が存在しない「環境」において、リテラル *l* に対して決定による割当てを行うと矛盾した（11行目）。しかし、学習節*c<sub>l</sub>* は節 *c* に含まれないなら（16行目）。これは矛盾は別の節集合によって生じたことを意味する。従ってこの節は冗長かもしれない。もし学習節 *c<sub>l</sub>* が節 *c* より小さいなら（17行目）、これは節 *c* より強い制約であるので環境に追加する。そして節 *c* 自身も環境に戻した上で、節 *c* に対する検査を終了させる（矛盾節を含む式と学習節を含む式とは充足可能性において等価である（矛盾の回避は割当て列に関する枝刈であって論理式の等価変換であることには違いない））。そうでないなら（19行目）、つまり節 *c* （に含まれるリテラル集合）は今回の矛盾とは関係ないが今回の矛盾によって吸収できるとは言い切れない場合、節 *c* に含まれていたリテラル集合 *c<sub>b</sub>* を「環境」に追加する。（より強い制約に置き換えている？？）
* 23, 27行目の型が合わないんだけどなあ。念のためもう一本読んでおいた方がよさそうだ。

# Splr実装案

これを何も考えずにRustで書いてみるとこんな感じだろうか。
Splr だと単位節は `cdb` に入れられないので CNF というよりも`(asg, cdb)` を持ち回るとした方が現実的かも。

```rust
/// Vivification of a given CNF formula, returning a vivified CNF formula
/// ## Note
/// `remove` used here is a non-destructive function (`Fn<T>([T]) -> Vec<T>`).
fn vivify(mut sigma: (AssginStack, ClauseDB)) {
    let mut env: (AssignStack, ClauseDB);
    let mut change: bool = true;
    let mut shortened: bool = true;
    let mut cb: Vec<Lit> = Vec::new();
    let mut ci: usize;
    while change {
        change = false;
        ci = 0;
        while ci < sigma.len() {
            let mut c = &mut sigma[ci];
            let c_len = c.len();
            i += 1;
            env = sigma.clone();
            env.remove_clause(ci);
            cb.clear();
            shortened = false;
            while !shortened && c != cb {
                let cx = c.remove_items(cb);
                l = select_literal(cx);
                cb.push(l);                                     // cb = cb ∪ {l};
                env.add_assignment(!l);                         // Σb ← (Σb ∪ {¬l})
                if let Some(ls) == env.propagate() {            // ⊥ ∈ UP(Σb)
                    let learnt = conflict_analyze();            // returns a learnt clause
                    if learnt.iter().all(|l| c.includes(l)) {   // cl ⊂ c
                        sigma.new_clause(learnt);               // Σ ← Σ ∪ {cl}
                        shortened = true;
                    } else {
                        if learnt.len() == c_len {
                            sigma.new_clause(learnt);           // Σ ← Σ ∪ { cl }
                            cb = c;
                        }
                        if c != cb {
                            sigma.new_clause(cb);               // Σ ← Σ ∪ {cb}
                            shortened = true;
                        }
                    }
                } else {
                    if let Some(ls) = cx.iter().find(|l| env.contains(l)) {
                        if cx.includes(ls) {                    // ∃(ls ∈ (c\cb))
                            if 1 < cx.len() {                   // (c\cb) /= {ls}
                                sigma.new_clause(cb.push(ls));  // Σ ← Σ ∪ {cb ∪ {ls}} ;
                                shortened = true;
                            }
                        }
                    }
                    if let Some(ls) = cx.iter().find(|l| env.contains(!l)) {
                        if cx.includes(!ls) {                   // ∃(¬ls ∈ (c\cb))
                            sigma.new_clause(c.remove(ls));     // Σ ← Σ ∪ {c\{ls}}
                            shortened = true;
                        }
                }
                if shortened {
                    sigma.kill(c);
                    change = true;
                }
            }
        }
    }
    // return sigma;
}
```

もう少し説明を加えるとこういう感じ。

```rust
while 不動点になるまで
    for sigma中の全ての節cに対して
        現在のsigmaのコピーをenvとする
        cb.clear();
        shortened = false;
        while !shortened && c != cb                             // == until shorten || c == cb { .. }
            c\cbから適当に選んだリテラルlを割当て伝播させる
            cbにlを追加する
            if 矛盾しているなら
                その学習節をclとする
                if 学習節clが元々の節cを包摂するなら
                    clをsigmaに追加; shortened = true;
                else
                    if cよりclの方が節長が短いなら
                        clをsigmaに追加; cb = c;                // これは終了条件, cは後でsigmaに追加される
                    if c != cb   　　　                         // ここがわからない
                        cbをsigmaに追加; shortened = true;
            else
                if cの残りに含まれるリテラルlsの中で、env中に含まれるものがあるなら
                    if cの残りが単位節{ls}になっていたら
                        単位節{ls}を sigma に追加; shortened = true;
                if cの残りに含まれるリテラルlsの中で、env中にその反リテラルが含まれるものがあるなら
　　　　　　　     cからリテラルlsを除いてsigma に追加; shortened = true;
            if shorted
                sigma.remove(c);
                change = true;
```

うーむ、実装してみなくては。
