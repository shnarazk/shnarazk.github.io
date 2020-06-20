---
title: Vivification
subtitle: a CNF preprocessor
date: 2020-06-20
tags: ["SAT"]
---
Vivification がなんなのか、日本語で探しても出てこないので以下をまとめる。
（最新の話かと思っていたけど2008年とは。。。）

* C. Piette, Y. Hamadi, and L. Saïs, "Vivifying propositional clausal formulae,” *Front. Artif. Intell*. Appl., vol. 178, pp. 525–529, 2008.

Splrでいうところの、現在のprocessorが網羅的に節数に対する制約内での全ての変数除去、節包摂(clause subsumption)を実行するのに対し、vivificationは（その節に「対応」する割り当てを仮定して）propagateを行った結果を用いて節の包摂方針を決めるというもの。
その分、不要な複雑さの導入を抑えることができるらしい。

### アルゴリズム

![](/img/2020/06-20/algorithm1.jpg)

何も考えずにRustで書いてみるとこんな感じ。

```rust
/// Vivification of a given CNF formula, returning a vivified CNF formula
/// ## Note
/// `remove` used here is a non-destructive function (`Fn<T>([T]) -> Vec<T>`).
fn vivify(mut sigma: &CNF) {
    let mut testing_cnf;
    let mut change: bool = true;
    let mut shortened: bool = true;
    let mut cb: Vec<Lit> = Vec::new();
    let mut ci: usize;
    while change {
        change = false;
        i = 0;
        while i < sigma.len() {
            let mut c = &mut sigma[i];
            let c_len = c.len();
            i += 1;
            testing_cnf = sigma.remove(c).clone();
            cb.clear();
            shortened = false;
            while !shortened && c != cb {
                let cx = c.remove_items(cb);
                l = select_literal(cx);
                cb.push(l);                                   // cb = cb ∪ {l};
                testing_cnf.push(vec![!l]);                   // Σb ← (Σb ∪ {¬l})
                if let Some(ls) == testing_cnf.propagate() {  // ⊥ ∈ UP(Σb)
                    let learnt = conflict_analyze();          // returns a learnt clause
                    if learnt.iter().all(|l| c.includes(l)) { // cl ⊂ c
                        sigma.new_clause(learnt);             // Σ ← Σ ∪ {cl}
                        shortened = true;
                    } else {
                        if learnt.len() == c_len {
                            sigma.new_clause(learnt);         // Σ ← Σ ∪ { cl }
                            cb = c;
                        }
                        if c != cb {
                            sigma.new_clause(cb);             // Σ ← Σ ∪ {cb}
                            shortened = true;
                        }
                    }
                } else {
                    if cx.includes(ls) {                      // ∃(ls ∈ (c\cb))
                        if 1 < cx.len() {                     // (c\cb) /= {ls}
                            sigma.new_clause(cb.push(ls));    // Σ ← Σ ∪ {cb ∪ {ls}} ;
                            shortened = true;
                        }
                    }
                    if cx.includes(!ls) {                     // ∃(¬ls ∈ (c\cb))
                        sigma.new_clause(c.remove(ls));       // Σ ← Σ ∪ {c\{ls}}
                        shortened = true;
                    }
                }
                if shortened {
                    sigma.remove(c);
                    change = true;
                }
            }
        }
    }
    // return sigma;
}
```

つまり

```rust
fn vivify(mut sigma: CNF) -> CNF {
    let mut testing_cnf;
    let mut change: bool = true;                            // 変化したかどうか
    let mut shortened: bool = true;                         // 節cを短い節で置き換えできたかどうか
    let mut cb: Vec<Lit> = Vec::new();                      // 節cの中で処理した部分
    while 不動点になるまで
        for sigma中の全ての節cに対して
            現在のsigmaのコピーをtesting_cnfとする
            sigmaからcを削除する
            cb.clear();
            shortened = false;
            while !shortened && c != cb                     // == until shorten || c == cb { .. }
                c\cbから適当に選んだリテラルlを割り当ててみて伝播させる
                cbにlを追加する
                if 矛盾してないなら
                    その学習節をclとする
                    if 学習節clが元々の節cを包摂するなら
                        clをsigmaに追加; shortened = true;
                    else
                        if cとclが同じ長さなら
                            clをsigmaに追加; cb = c;        // これは終了条件, cは後でsigmaに追加される
                        if c != cb   　　　                 // ここがわからん
                            sigma.push(cb); shortened = true
                else
                    if cの残り(c.remove(cb))が ls を含むなら
                        if cの残りが単位節{ls}になっていたら
                            単位節{ls}を sigma に追加; shortened = true;
                    if cの残り(c.remove(cb))が !ls を含むなら
　　　　　　　　　　　     cからリテラルlsを除いてsigma に追加; shortened = true;
                if !shorted
                    sigma.push(c);
                else
                    change = true;
    return sigma;
}
```

うーむ、実装してみなくては。
