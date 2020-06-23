(window.webpackJsonp=window.webpackJsonp||[]).push([[83],{555:function(n){n.exports=JSON.parse('{"title":"Vivification of a CNF formula","subtitle":"as a SAT solver\'s preprocessor","date":"2020-06-21T00:00:00.000Z","tags":["SAT"],"bodyContent":"Vivification がなんなのか、日本語で探しても出てこないので以下の論文をまとめてみた。\\n（最新の話かと思っていたけど2008年とは。。。）\\n\\n* C. Piette, Y. Hamadi, and L. Saïs, \\"Vivifying propositional clausal formulae,” *Front. Artif. Intell*. Appl., vol. 178, pp. 525–529, 2008.\\n\\nSplr でいうところの `processor` が節数に対する制約内での網羅的な変数除去と節包摂(clause subsumption)とを実行するのに対し、vivification は（その節に「対応」する割り当てを仮定して）propagateを行った結果を用いて節の包摂方針を決めるというもの。\\nその分、不要な複雑さの導入を抑えることができるらしい。\\n効果は1割程度のようである。\\n\\n# アルゴリズム（上記論文より引用）\\n\\n![](/img/2020/06-20/algorithm1.jpg)\\n\\n* 6行目で $c$ を $\\\\Sigma$ から削除して、30行目で戻している。しかし $\\\\Sigma$ に対する伝播は行わないので、30行目まで残しておいても構わない。\\n* 20行目の解釈： 節 $c$ が存在しない $\\\\Sigma_b$ において、リテラル $l$ に対して決定による割当てを行うと矛盾した（11行目）。しかし、学習節 $c_l$ は節 $c$ に含まれないなら（16行目）。これは矛盾は別の節集合によって生じたことを意味する。従ってこの節は冗長かもしれない。もし学習節 $c_l$ が節 $c$ より小さいなら（17行目）、これは節 $c$ より強い制約であるので $\\\\Sigma_b$ に追加する。そして節 $c$ 自身も $\\\\Sigma_b$ に戻した上で、節 $c$ に対する検査を終了させる（矛盾節を含む式と学習節を含む式とは充足可能性において等価である（矛盾の回避は割当て列に関する枝刈であって論理式の等価変換であることには違いない））。そうでないなら（19行目）、つまり節 $c$ （に含まれるリテラル集合）は今回の矛盾とは関係ないが今回の矛盾によって吸収できるとは言い切れない場合には、節 $c$ に含まれていたリテラル集合 $c_b$ を $\\\\Sigma_b$ に追加し（代わりに $c$ を削除し）て節 $c$ に対する処理を終了する（より強い制約に置き換えている？？）。\\n\\n> 1. $\\\\exists i \\\\in \\\\{1, \\\\cdots, n-1\\\\} s.t. \\\\Sigma\\\\backslash\\\\{c\\\\} \\\\cup \\\\{\\\\neg l_1, \\\\cdots, \\\\neg l_i\\\\} \\\\models_{UP} \\\\bot$: In this case, we have $\\\\Sigma\\\\backslash\\\\{c\\\\} \\\\models_{UP} c\'$ with $c\' = (l_1 \\\\vee \\\\cdots \\\\vee l_i)$. This new clause $c\'$ strictly subsumes $c$. Hence, the original clause can be substituted by the new deduced one. Obviously, $c\'$ is not necessarily minimally redundant modulo UP. Indeed, another ordering on the literals $\\\\{l_1, l_2, \\\\cdots, l_i\\\\}$ might lead to an even shorter sub-clause. Thanks to a conflict analysis, the deduced sub-clause $c\'$ could be shortened again leading to an even smaller sub-clause. Indeed, a new clause η can be generated by a complete traversal of the implication graph associated to $\\\\Sigma$ and to the assignments of the literals $\\\\{\\\\neg l_1, \\\\cdots, \\\\neg l_i\\\\}$. The complete traversal of the implication graph ensure that the clause η contains only literals from $c\'$. Thereby, η is a sub-clause of $(l_1 \\\\vee \\\\cdots \\\\vee l_i)$.\\n\\n* 23, 27行目の型が合わないんだけどなあ。念のためもう一本読んでおいた方がよさそうだ。\\n\\nもう少し説明を加えるとこういう感じ。\\n\\n```rust\\nwhile 不動点になるまで\\n    for sigma中の全ての節cに対して\\n        現在のsigmaのコピーをenvとする\\n        cb.clear();\\n        shortened = false;\\n        while !shortened && c != cb                             // == until shorten || c == cb { .. }\\n            c\\\\cbから適当にリテラルlを選ぶ\\n            cbにlを追加する\\n            !lを割当て伝播させる\\n            if 矛盾しているなら\\n                その学習節をclとする\\n                if 学習節clが元々の節cを包摂するなら\\n                    clをsigmaに追加; shortened = true;\\n                else\\n                    if cよりclの方が節長が短いなら\\n                        clをsigmaに追加; cb = c;                // これは終了条件, cは後でsigmaに追加される\\n                    if c != cb   　　　                         // ここがわからない\\n                        cbをsigmaに追加; shortened = true;\\n            else\\n                if cの残りに含まれるリテラルlsの中で、env中に含まれるものがあるなら\\n                    if cの残りが単位節{ls}になっていたら\\n                        単位節{ls}を sigma に追加; shortened = true;\\n                if cの残りに含まれるリテラルlsの中で、env中にその反リテラルが含まれるものがあるなら\\n　　　　　　　     cからリテラルlsを除いてsigma に追加; shortened = true;\\n            if shorted\\n                sigma.remove(c);\\n                change = true;\\n```\\n\\n# Splr実装案\\n\\nこれを何も考えずにRustで書いてみるとこんな感じだろうか。\\nSplr だと単位節は `cdb` に入れられないので CNF というよりも`(asg, cdb)` を持ち回るとした方が現実的かも。\\n\\n```rust\\n/// Vivification of a given CNF formula, returning a vivified CNF formula\\n/// Note: `remove` used here is a non-destructive function (`Fn<T>([T]) -> Vec<T>`).\\nfn vivify(mut sigma: (AssginStack, ClauseDB)) {\\n    let mut env: (AssignStack, ClauseDB);\\n    let mut change: bool = true;\\n    let mut shortened: bool = true;\\n    let mut cb: Vec<Lit> = Vec::new();\\n    let mut ci: usize;\\n    while change {\\n        change = false;\\n        ci = 0;\\n        while ci < sigma.len() {\\n            let mut c = &mut sigma[ci];\\n            let c_len = c.len();\\n            ci += 1;\\n            env = sigma.clone();\\n            env.remove_clause(ci);\\n            cb.clear();\\n            shortened = false;\\n            while !shortened && c != cb {\\n                let cx = c.remove_items(cb);\\n                l = select_literal(cx);\\n                cb.push(l);                                     // cb = cb ∪ {l};\\n                env.add_assignment(!l);                         // Σb ← (Σb ∪ {¬l})\\n                if let Some(ls) = env.propagate() {             // ⊥ ∈ UP(Σb)\\n                    let learnt = conflict_analyze();            // returns a learnt clause\\n                    if learnt.iter().all(|l| c.includes(l)) {   // cl ⊂ c\\n                        sigma.new_clause(learnt);               // Σ ← Σ ∪ {cl}\\n                        shortened = true;\\n                    } else {\\n                        if learnt.len() == c_len {\\n                            sigma.new_clause(learnt);           // Σ ← Σ ∪ {cl}\\n                            cb = c;\\n                        }\\n                        if c != cb {\\n                            sigma.new_clause(cb);               // Σ ← Σ ∪ {cb}\\n                            shortened = true;\\n                        }\\n                    }\\n                } else {\\n                    if let Some(ls) = cx.iter().find(|l| env.contains(l)) { // ∃(ls ∈ (c\\\\cb))\\n                        if 1 < cx.len() {                       // (c\\\\cb) /= {ls}\\n                            sigma.new_clause(cb.push(ls));      // Σ ← Σ ∪ {cb ∪ {ls}} ;\\n                            shortened = true;\\n                        }\\n                    }\\n                    if let Some(ls) = cx.iter().find(|l| env.contains(!l)) { // ∃(¬ls ∈ (c\\\\cb))\\n                        sigma.new_clause(c.remove(ls));         // Σ ← Σ ∪ {c\\\\{ls}}\\n                        shortened = true;\\n                    }\\n                }\\n                if shortened {\\n                    sigma.kill(c);\\n                    change = true;\\n                }\\n            }\\n        }\\n    }\\n    // return sigma;\\n}\\n```\\n\\n##  2020-06-23\\n\\n`AssignStack` や `ClauseDB` のコピーはコストが大きいので $\\\\Sigma$ だけで対応したい。\\n\\n* $\\\\Sigma$ と `env` の違いは$l$の割り当てをもつかどうか。これは割り当てをキャンセルできればいいはず。\\n* 内側のwhile文中で $\\\\Sigma$ に対して節や割り当てを追加しているので、これを遅延させる。\\n* `assign`, `conflict_analysis`, `cancel_until`を呼び出すので変数および節の活性度が影響を受ける。どうしたものか。\\n\\n```rust\\nfn vivify(mut sigma: (AssginStack, ClauseDB)) {\\n    let mut change: bool = true;\\n    while change {\\n        change = false;\\n        let mut ci: usize = 0;\\n        let mut clauses: Vec<Vec<Lit>> = Vec::new();\\n        while ci < sigma.len() {\\n            let mut c = &mut sigma[ci];\\n            let c_lits = c.lits.clone();\\n            let c_len = c.len();\\n            let dl = sigma.decision_level();\\n            i += 1;\\n            sigma.remove_clause(ci);\\n            let mut cb: Vec<Lit> = Vec::new();\\n            let mut shortened = false;\\n            while !shortened && c != cb {\\n                let cx = c.remove_items(cb);\\n                l = select_literal(cx);\\n                cb.push(l);                                     // cb = cb ∪ {l};\\n                sigma.assign_by_decision(!l);                   // Σb ← (Σb ∪ {¬l})\\n                if let Some(ls) = sigma.propagate() {           // ⊥ ∈ UP(Σb)\\n                    let learnt = conflict_analyze();            // returns a learnt clause\\n                    if learnt.iter().all(|l| c.includes(l)) {   // cl ⊂ c\\n                        clauses.push(learnt);                   // MODIFIED: Σ ← Σ ∪ {cl}\\n                        shortened = true;\\n                    } else {\\n                        if learnt.len() == c_len {\\n                            clauses.push(learnt);               // MODIFIED: Σ ← Σ ∪ {cl}\\n                            cb = c;\\n                        }\\n                        if c != cb {\\n                            clauses.push(cb);                   // MODIFIED: Σ ← Σ ∪ {cb}\\n                            shortened = true;\\n                        }\\n                    }\\n                } else {\\n                    if let Some(ls) = cx.iter().find(|l| sigma.contains(l)) { // ∃(ls ∈ (c\\\\cb))\\n                        if 1 < cx.len() {                       // (c\\\\cb) /= {ls}\\n                            clauses.push(cb.push(ls));          // MODIFIED: Σ ← Σ ∪ {cb ∪ {ls}} ;\\n                            shortened = true;\\n                        }\\n                    }\\n                    if let Some(ls) = cx.iter().find(|l| sigma.contains(!l)) { // ∃(¬ls ∈ (c\\\\cb))\\n                        clauses.push(c.remove(ls));             // MODIFIED: Σ ← Σ ∪ {c\\\\{ls}}\\n                        shortened = true;\\n                    }\\n                }\\n                if !shortened {\\n                    sigma.new_clause(c_lits);\\n                } else {\\n                    change = true;\\n                }\\n                sigma.cancel_until(dl);\\n            }\\n            for c in &clauses {\\n                if c.len() == 1 {\\n                    sigma.new_assignment(c[0]);\\n                } else {\\n                    sigma.new_clause(c);\\n                }\\n            }\\n        }\\n    }\\n}\\n```\\n\\nこれでどうだろうか。実装してみなくては。\\n\\nこうしてみると、統計的ソルバの手法みたい。","bodyHtml":"<p>Vivification がなんなのか、日本語で探しても出てこないので以下の論文をまとめてみた。\\n（最新の話かと思っていたけど2008年とは。。。）</p>\\n<ul>\\n<li>C. Piette, Y. Hamadi, and L. Saïs, &quot;Vivifying propositional clausal formulae,” <em>Front. Artif. Intell</em>. Appl., vol. 178, pp. 525–529, 2008.</li>\\n</ul>\\n<p>Splr でいうところの <code>processor</code> が節数に対する制約内での網羅的な変数除去と節包摂(clause subsumption)とを実行するのに対し、vivification は（その節に「対応」する割り当てを仮定して）propagateを行った結果を用いて節の包摂方針を決めるというもの。\\nその分、不要な複雑さの導入を抑えることができるらしい。\\n効果は1割程度のようである。</p>\\n<h1>アルゴリズム（上記論文より引用）</h1>\\n<p><img src=\\"/img/2020/06-20/algorithm1.jpg\\" alt=\\"\\"></p>\\n<ul>\\n<li>6行目で $c$ を $\\\\Sigma$ から削除して、30行目で戻している。しかし $\\\\Sigma$ に対する伝播は行わないので、30行目まで残しておいても構わない。</li>\\n<li>20行目の解釈： 節 $c$ が存在しない $\\\\Sigma_b$ において、リテラル $l$ に対して決定による割当てを行うと矛盾した（11行目）。しかし、学習節 $c_l$ は節 $c$ に含まれないなら（16行目）。これは矛盾は別の節集合によって生じたことを意味する。従ってこの節は冗長かもしれない。もし学習節 $c_l$ が節 $c$ より小さいなら（17行目）、これは節 $c$ より強い制約であるので $\\\\Sigma_b$ に追加する。そして節 $c$ 自身も $\\\\Sigma_b$ に戻した上で、節 $c$ に対する検査を終了させる（矛盾節を含む式と学習節を含む式とは充足可能性において等価である（矛盾の回避は割当て列に関する枝刈であって論理式の等価変換であることには違いない））。そうでないなら（19行目）、つまり節 $c$ （に含まれるリテラル集合）は今回の矛盾とは関係ないが今回の矛盾によって吸収できるとは言い切れない場合には、節 $c$ に含まれていたリテラル集合 $c_b$ を $\\\\Sigma_b$ に追加し（代わりに $c$ を削除し）て節 $c$ に対する処理を終了する（より強い制約に置き換えている？？）。</li>\\n</ul>\\n<blockquote>\\n<ol>\\n<li>$\\\\exists i \\\\in {1, \\\\cdots, n-1} s.t. \\\\Sigma\\\\backslash{c} \\\\cup {\\\\neg l_1, \\\\cdots, \\\\neg l_i} \\\\models_{UP} \\\\bot$: In this case, we have $\\\\Sigma\\\\backslash{c} \\\\models_{UP} c\'$ with $c\' = (l_1 \\\\vee \\\\cdots \\\\vee l_i)$. This new clause $c\'$ strictly subsumes $c$. Hence, the original clause can be substituted by the new deduced one. Obviously, $c\'$ is not necessarily minimally redundant modulo UP. Indeed, another ordering on the literals ${l_1, l_2, \\\\cdots, l_i}$ might lead to an even shorter sub-clause. Thanks to a conflict analysis, the deduced sub-clause $c\'$ could be shortened again leading to an even smaller sub-clause. Indeed, a new clause η can be generated by a complete traversal of the implication graph associated to $\\\\Sigma$ and to the assignments of the literals ${\\\\neg l_1, \\\\cdots, \\\\neg l_i}$. The complete traversal of the implication graph ensure that the clause η contains only literals from $c\'$. Thereby, η is a sub-clause of $(l_1 \\\\vee \\\\cdots \\\\vee l_i)$.</li>\\n</ol>\\n</blockquote>\\n<ul>\\n<li>23, 27行目の型が合わないんだけどなあ。念のためもう一本読んでおいた方がよさそうだ。</li>\\n</ul>\\n<p>もう少し説明を加えるとこういう感じ。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">while</span> 不動点になるまで\\n    <span class=\\"hljs-keyword\\">for</span> sigma中の全ての節cに対して\\n        現在のsigmaのコピーをenvとする\\n        cb.clear();\\n        shortened = <span class=\\"hljs-literal\\">false</span>;\\n        <span class=\\"hljs-keyword\\">while</span> !shortened &amp;&amp; c != cb                             <span class=\\"hljs-comment\\">// == until shorten || c == cb { .. }</span>\\n            c\\\\cbから適当にリテラルlを選ぶ\\n            cbにlを追加する\\n            !lを割当て伝播させる\\n            <span class=\\"hljs-keyword\\">if</span> 矛盾しているなら\\n                その学習節をclとする\\n                <span class=\\"hljs-keyword\\">if</span> 学習節clが元々の節cを包摂するなら\\n                    clをsigmaに追加; shortened = <span class=\\"hljs-literal\\">true</span>;\\n                <span class=\\"hljs-keyword\\">else</span>\\n                    <span class=\\"hljs-keyword\\">if</span> cよりclの方が節長が短いなら\\n                        clをsigmaに追加; cb = c;                <span class=\\"hljs-comment\\">// これは終了条件, cは後でsigmaに追加される</span>\\n                    <span class=\\"hljs-keyword\\">if</span> c != cb   　　　                         <span class=\\"hljs-comment\\">// ここがわからない</span>\\n                        cbをsigmaに追加; shortened = <span class=\\"hljs-literal\\">true</span>;\\n            <span class=\\"hljs-keyword\\">else</span>\\n                <span class=\\"hljs-keyword\\">if</span> cの残りに含まれるリテラルlsの中で、env中に含まれるものがあるなら\\n                    <span class=\\"hljs-keyword\\">if</span> cの残りが単位節{ls}になっていたら\\n                        単位節{ls}を sigma に追加; shortened = <span class=\\"hljs-literal\\">true</span>;\\n                <span class=\\"hljs-keyword\\">if</span> cの残りに含まれるリテラルlsの中で、env中にその反リテラルが含まれるものがあるなら\\n　　　　　　　     cからリテラルlsを除いてsigma に追加; shortened = <span class=\\"hljs-literal\\">true</span>;\\n            <span class=\\"hljs-keyword\\">if</span> shorted\\n                sigma.remove(c);\\n                change = <span class=\\"hljs-literal\\">true</span>;</code></pre><h1>Splr実装案</h1>\\n<p>これを何も考えずにRustで書いてみるとこんな感じだろうか。\\nSplr だと単位節は <code>cdb</code> に入れられないので CNF というよりも<code>(asg, cdb)</code> を持ち回るとした方が現実的かも。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// Vivification of a given CNF formula, returning a vivified CNF formula</span>\\n<span class=\\"hljs-comment\\">/// Note: `remove` used here is a non-destructive function (`Fn&lt;T&gt;([T]) -&gt; Vec&lt;T&gt;`).</span>\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">vivify</span></span>(<span class=\\"hljs-keyword\\">mut</span> sigma: (AssginStack, ClauseDB)) {\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> env: (AssignStack, ClauseDB);\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> change: <span class=\\"hljs-built_in\\">bool</span> = <span class=\\"hljs-literal\\">true</span>;\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> shortened: <span class=\\"hljs-built_in\\">bool</span> = <span class=\\"hljs-literal\\">true</span>;\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> cb: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> ci: <span class=\\"hljs-built_in\\">usize</span>;\\n    <span class=\\"hljs-keyword\\">while</span> change {\\n        change = <span class=\\"hljs-literal\\">false</span>;\\n        ci = <span class=\\"hljs-number\\">0</span>;\\n        <span class=\\"hljs-keyword\\">while</span> ci &lt; sigma.len() {\\n            <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> c = &amp;<span class=\\"hljs-keyword\\">mut</span> sigma[ci];\\n            <span class=\\"hljs-keyword\\">let</span> c_len = c.len();\\n            ci += <span class=\\"hljs-number\\">1</span>;\\n            env = sigma.clone();\\n            env.remove_clause(ci);\\n            cb.clear();\\n            shortened = <span class=\\"hljs-literal\\">false</span>;\\n            <span class=\\"hljs-keyword\\">while</span> !shortened &amp;&amp; c != cb {\\n                <span class=\\"hljs-keyword\\">let</span> cx = c.remove_items(cb);\\n                l = select_literal(cx);\\n                cb.push(l);                                     <span class=\\"hljs-comment\\">// cb = cb ∪ {l};</span>\\n                env.add_assignment(!l);                         <span class=\\"hljs-comment\\">// Σb ← (Σb ∪ {¬l})</span>\\n                <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ls) = env.propagate() {             <span class=\\"hljs-comment\\">// ⊥ ∈ UP(Σb)</span>\\n                    <span class=\\"hljs-keyword\\">let</span> learnt = conflict_analyze();            <span class=\\"hljs-comment\\">// returns a learnt clause</span>\\n                    <span class=\\"hljs-keyword\\">if</span> learnt.iter().all(|l| c.includes(l)) {   <span class=\\"hljs-comment\\">// cl ⊂ c</span>\\n                        sigma.new_clause(learnt);               <span class=\\"hljs-comment\\">// Σ ← Σ ∪ {cl}</span>\\n                        shortened = <span class=\\"hljs-literal\\">true</span>;\\n                    } <span class=\\"hljs-keyword\\">else</span> {\\n                        <span class=\\"hljs-keyword\\">if</span> learnt.len() == c_len {\\n                            sigma.new_clause(learnt);           <span class=\\"hljs-comment\\">// Σ ← Σ ∪ {cl}</span>\\n                            cb = c;\\n                        }\\n                        <span class=\\"hljs-keyword\\">if</span> c != cb {\\n                            sigma.new_clause(cb);               <span class=\\"hljs-comment\\">// Σ ← Σ ∪ {cb}</span>\\n                            shortened = <span class=\\"hljs-literal\\">true</span>;\\n                        }\\n                    }\\n                } <span class=\\"hljs-keyword\\">else</span> {\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ls) = cx.iter().find(|l| env.contains(l)) { <span class=\\"hljs-comment\\">// ∃(ls ∈ (c\\\\cb))</span>\\n                        <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-number\\">1</span> &lt; cx.len() {                       <span class=\\"hljs-comment\\">// (c\\\\cb) /= {ls}</span>\\n                            sigma.new_clause(cb.push(ls));      <span class=\\"hljs-comment\\">// Σ ← Σ ∪ {cb ∪ {ls}} ;</span>\\n                            shortened = <span class=\\"hljs-literal\\">true</span>;\\n                        }\\n                    }\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ls) = cx.iter().find(|l| env.contains(!l)) { <span class=\\"hljs-comment\\">// ∃(¬ls ∈ (c\\\\cb))</span>\\n                        sigma.new_clause(c.remove(ls));         <span class=\\"hljs-comment\\">// Σ ← Σ ∪ {c\\\\{ls}}</span>\\n                        shortened = <span class=\\"hljs-literal\\">true</span>;\\n                    }\\n                }\\n                <span class=\\"hljs-keyword\\">if</span> shortened {\\n                    sigma.kill(c);\\n                    change = <span class=\\"hljs-literal\\">true</span>;\\n                }\\n            }\\n        }\\n    }\\n    <span class=\\"hljs-comment\\">// return sigma;</span>\\n}</code></pre><h2>2020-06-23</h2>\\n<p><code>AssignStack</code> や <code>ClauseDB</code> のコピーはコストが大きいので $\\\\Sigma$ だけで対応したい。</p>\\n<ul>\\n<li>$\\\\Sigma$ と <code>env</code> の違いは$l$の割り当てをもつかどうか。これは割り当てをキャンセルできればいいはず。</li>\\n<li>内側のwhile文中で $\\\\Sigma$ に対して節や割り当てを追加しているので、これを遅延させる。</li>\\n<li><code>assign</code>, <code>conflict_analysis</code>, <code>cancel_until</code>を呼び出すので変数および節の活性度が影響を受ける。どうしたものか。</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">vivify</span></span>(<span class=\\"hljs-keyword\\">mut</span> sigma: (AssginStack, ClauseDB)) {\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> change: <span class=\\"hljs-built_in\\">bool</span> = <span class=\\"hljs-literal\\">true</span>;\\n    <span class=\\"hljs-keyword\\">while</span> change {\\n        change = <span class=\\"hljs-literal\\">false</span>;\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> ci: <span class=\\"hljs-built_in\\">usize</span> = <span class=\\"hljs-number\\">0</span>;\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> clauses: <span class=\\"hljs-built_in\\">Vec</span>&lt;<span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt;&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">while</span> ci &lt; sigma.len() {\\n            <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> c = &amp;<span class=\\"hljs-keyword\\">mut</span> sigma[ci];\\n            <span class=\\"hljs-keyword\\">let</span> c_lits = c.lits.clone();\\n            <span class=\\"hljs-keyword\\">let</span> c_len = c.len();\\n            <span class=\\"hljs-keyword\\">let</span> dl = sigma.decision_level();\\n            i += <span class=\\"hljs-number\\">1</span>;\\n            sigma.remove_clause(ci);\\n            <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> cb: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n            <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> shortened = <span class=\\"hljs-literal\\">false</span>;\\n            <span class=\\"hljs-keyword\\">while</span> !shortened &amp;&amp; c != cb {\\n                <span class=\\"hljs-keyword\\">let</span> cx = c.remove_items(cb);\\n                l = select_literal(cx);\\n                cb.push(l);                                     <span class=\\"hljs-comment\\">// cb = cb ∪ {l};</span>\\n                sigma.assign_by_decision(!l);                   <span class=\\"hljs-comment\\">// Σb ← (Σb ∪ {¬l})</span>\\n                <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ls) = sigma.propagate() {           <span class=\\"hljs-comment\\">// ⊥ ∈ UP(Σb)</span>\\n                    <span class=\\"hljs-keyword\\">let</span> learnt = conflict_analyze();            <span class=\\"hljs-comment\\">// returns a learnt clause</span>\\n                    <span class=\\"hljs-keyword\\">if</span> learnt.iter().all(|l| c.includes(l)) {   <span class=\\"hljs-comment\\">// cl ⊂ c</span>\\n                        clauses.push(learnt);                   <span class=\\"hljs-comment\\">// MODIFIED: Σ ← Σ ∪ {cl}</span>\\n                        shortened = <span class=\\"hljs-literal\\">true</span>;\\n                    } <span class=\\"hljs-keyword\\">else</span> {\\n                        <span class=\\"hljs-keyword\\">if</span> learnt.len() == c_len {\\n                            clauses.push(learnt);               <span class=\\"hljs-comment\\">// MODIFIED: Σ ← Σ ∪ {cl}</span>\\n                            cb = c;\\n                        }\\n                        <span class=\\"hljs-keyword\\">if</span> c != cb {\\n                            clauses.push(cb);                   <span class=\\"hljs-comment\\">// MODIFIED: Σ ← Σ ∪ {cb}</span>\\n                            shortened = <span class=\\"hljs-literal\\">true</span>;\\n                        }\\n                    }\\n                } <span class=\\"hljs-keyword\\">else</span> {\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ls) = cx.iter().find(|l| sigma.contains(l)) { <span class=\\"hljs-comment\\">// ∃(ls ∈ (c\\\\cb))</span>\\n                        <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-number\\">1</span> &lt; cx.len() {                       <span class=\\"hljs-comment\\">// (c\\\\cb) /= {ls}</span>\\n                            clauses.push(cb.push(ls));          <span class=\\"hljs-comment\\">// MODIFIED: Σ ← Σ ∪ {cb ∪ {ls}} ;</span>\\n                            shortened = <span class=\\"hljs-literal\\">true</span>;\\n                        }\\n                    }\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ls) = cx.iter().find(|l| sigma.contains(!l)) { <span class=\\"hljs-comment\\">// ∃(¬ls ∈ (c\\\\cb))</span>\\n                        clauses.push(c.remove(ls));             <span class=\\"hljs-comment\\">// MODIFIED: Σ ← Σ ∪ {c\\\\{ls}}</span>\\n                        shortened = <span class=\\"hljs-literal\\">true</span>;\\n                    }\\n                }\\n                <span class=\\"hljs-keyword\\">if</span> !shortened {\\n                    sigma.new_clause(c_lits);\\n                } <span class=\\"hljs-keyword\\">else</span> {\\n                    change = <span class=\\"hljs-literal\\">true</span>;\\n                }\\n                sigma.cancel_until(dl);\\n            }\\n            <span class=\\"hljs-keyword\\">for</span> c <span class=\\"hljs-keyword\\">in</span> &amp;clauses {\\n                <span class=\\"hljs-keyword\\">if</span> c.len() == <span class=\\"hljs-number\\">1</span> {\\n                    sigma.new_assignment(c[<span class=\\"hljs-number\\">0</span>]);\\n                } <span class=\\"hljs-keyword\\">else</span> {\\n                    sigma.new_clause(c);\\n                }\\n            }\\n        }\\n    }\\n}</code></pre><p>これでどうだろうか。実装してみなくては。</p>\\n<p>こうしてみると、統計的ソルバの手法みたい。</p>\\n","dir":"article/.json/2020","base":"2020-06-20-vivification.json","ext":".json","sourceBase":"2020-06-20-vivification.md","sourceExt":".md"}')}}]);