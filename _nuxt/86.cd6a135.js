(window.webpackJsonp=window.webpackJsonp||[]).push([[86],{563:function(n){n.exports=JSON.parse('{"title":"Clause Vivification updated 2020","subtitle":"vivification part 2","date":"2020-08-23T00:00:00.000Z","tags":["SAT","vivification","splr"],"banner":"https://images.unsplash.com/photo-1586508217007-6e8b3151a6f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80","bodyContent":"**cover image: https://unsplash.com/photos/tYs9rjaT8Vc**\\n\\nVivification についての調査第2弾、2018年投稿2019年公開の論文をまとめてみた。\\n\\n* Chu-Min Li *et al.*, \\"Clause vivification by unit propagation in CDCL SAT solvers,”*Artif. Intell.*, vol. 279, 2019.\\n\\n* [part 2](/2020/2020-08-19-splr-with-vivification/)\\n\\n### Errata\\n\\n* **Algorithm 3**のL17はforeachの内側\\n* **Algorithm 4**のLL.9-10はthen節の中\\n\\n### Outline\\n\\nVivificationは魅力的な節削減手法のでSAT competitionに提出されるようなソルバに導入されたもの、その後改善が計算量に見合わないため、取り下げられることが続いてきた。\\nこの論文はどのタイミングで、どの節を、どのリテラルからvivifyすればよいかについて論じている。\\n特に[原論文](/2020/2020-06-20-vivification/)では\'future work\'としてのみ触れられていたin-processorとして使う場合の改善に重きを置いている。\\nなお、Cadicalはこの論文で提案された手法とは無関係。所与の節にもvivificationをするべきだという主張の傍証実験に使われただけ。ただし、Cadicalが使っているのは著者らの別の論文に基づくものなので、無関係とは言い過ぎかも。\\n\\n結論は以下の通り。\\n\\n* タイミング -- 節削減の後のリスタート\\n* 対象節 -- LBD順で対象集合の半分\\n  * 与えられた節 -- LBDが20以下の学習節の導出に使われており、LBDが1になる、またはLBDが3回減少すれば再び対象に加える。それとは別に pre-processing phase で$10^8$リテラルまで処理する。\\n  * 学習節 -- LBDが1になる、またはLBDが2回減少すれば再び対象に加える\\n* リテラル順 -- as is\\n\\nなお、以下のようにin-processor向けに `vivify` のアルゴリズムが変更されている。\\n\\n![](/img/2020/07-05/vivi-algo3.jpg)\\n\\n* 節へのリテラルの追加は$\\\\vee$で、節集合および部分割り当てへの節または割り当ての追加は$\\\\cup$で表されている。つまり節が拡大するのはL17のみ。(**2020-08-21追記**)\\n* ~~なんか怪しい。なぜ $\\\\phi \\\\cup \\\\neg C\'$ なのだ？ どうして$C$に含まれていたリテラルの否定を集めた節が$\\\\text{vivified} C = C\'$ なのだ~~ ここがミソ。\\n* 何にせよ最初に存在した節は17行目で必ず削除される。\\n* 17行目は一つ内側のループに含まれるはずですけど。\\n* この関数は決定レベル0を想定していない。だから`conflictAnalysis`を呼び出している。もし決定レベル0を想定するなら、これは決定変数の否定からなる単位節を返す処理に帰着する。従ってL10は $C\' \\\\leftarrow \\\\{l_i\\\\}$と等価だか、そもそも$l_i$は割り当て済みだから何もしないのと同等。一方L13に関しては、その前のステップで決定による割り当てを行っている可能性があるのでレベル0が仮定できない。従って通常の矛盾解析を行い、**学習節を追加する**ことが必要である。\\n\\n### 節$C$が冗長であることを言う。\\n\\n数学的準備：\\n\\n* $(\\\\phi, \\\\omega) \\\\models \\\\omega\'$は節集合$\\\\phi$と部分割当集合$\\\\omega$から無矛盾な割り当て集合$\\\\omega\'$が導出されることを意味する。割当が空でも$\\\\omega$を導出できるなら$\\\\phi \\\\models \\\\omega$とも書く。\\n* $(\\\\phi, \\\\omega)$が矛盾を起こしているなら$\\\\bot$で矛盾を表し、$(\\\\phi, \\\\omega) \\\\models \\\\bot$と書くことにする。\\n* 節$C$が冗長とは式$\\\\phi$と$\\\\phi\\\\setminus{C}$が論理的に等値であることを意味する。\\n* 一般に節$C$に含まれる全てのリテラルを否定した節を$\\\\neg C$と書くと$\\\\forall C: (C \\\\cup \\\\neg C) \\\\models \\\\bot$が成立する。\\n* （⭐️）一般に節$C$に対して自身の部分節$C\'$の否定節$\\\\neg C\'$を加えることで矛盾が生じる（$C \\\\cup \\\\neg C\' \\\\models \\\\bot$）なら、節$C$は$C\'$に包含される。節$C$はリテラル$l\' \\\\in C\\\\setminus{C\'}$に対して何の制約にもなっていない。\\n\\n1. 前提として$\\\\phi \\\\nvDash \\\\bot$であるとする。\\n1. ある節Cの部分節$C\'$の否定節を加えても矛盾を導出しないなら、それは節Cは$C\\\\setminus{C\'}$に包摂できることを意味している。\\n1. そのような部分節にリテラル$l\' \\\\in C$の否定を加えた節を追加すると矛盾が起きたとする。それは部分節または$l\'$のどちらかが充足することが必要であることを意味している。これは$\\\\phi$から導出された学習節である（$\\\\phi$の論理的帰結）。\\n1. 学習節$\\\\neg \\\\neg C\' \\\\cup \\\\{\\\\neg \\\\neg l\'\\\\} = C\' \\\\cup l\'$は節$C$の部分節である。なので（⭐️）より置き換えてよい。\\n\\n### 余談\\n\\n* COMiniSATPS, MapleCOMSPS, MapleCOMSPS_LRB は学習節の3層管理をしている。節削減対象はLOCALのみ。\\n  * CORE -- LBDが小さいもの\\n  * TIER2 --　LBDが中間のもの。長期間依存グラフに現れないと格下げ。\\n  * LOCAL -- それ以外\\n* COMiniSATPS, MapleCOMSPS, MapleCOMSPS_LRB はGulcose的なリスタートフェーズとLuby列に基づくリスタートフェーズを交互に使っている。これはStabilizationの先駆け？\\n\\n\\n### 2020-07-05 Splr approach\\n\\n```rust\\nfn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) {\\n    \'next_clause: for ci in clauses.iter() {\\n        let c: &Clause = &cdb[ci];\\n        if c.is(Flag::DEAD) { continue; }\\n        let mut copied: Vec<Lit> = Vec::new();\\n        let mut vivified: Vec<Lit> = Vec::new();\\n        for l in c.lits.clone().iter() {\\n            match asg.assigned(*l) {\\n                Some(false) => copied.push(!*l),            // Rule 1\\n                Some(true) => continue \'next_clause,        // Rule 2\'\\n                None => {\\n                    let cid: Option<ClauseId> = match copied.len() {\\n                        0 => None,\\n                        1 => { asg.assign_by_decision(copied[0]); None }\\n                        _ => Some(cdb.new_clause(asg, &mut copied)), // L.12\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    let cc = asg.propagate(cdb);\\n                    if cc != ClauseId::default() {\\n                        vivified = asg.minimize(cdb, &v, &cdb[cc].lits); // Rule 3\\n                    }\\n                    if let Some(cj) = cid { cdb.remove_clause(cj); }\\n                    asg.cancel_until(asg.root_level);\\n                    if cc != ClauseId::default() { break; }\\n                    copied.push(!*l);                       // Rule 4\\n                }\\n            }\\n        }\\n        if vivified.is_empty() {\\n            for l in &mut copied { *l = !*l; }\\n            std::mem::swap(&mut vivified, &mut copied);\\n        }\\n        match vivified.len() {\\n            0 => break \'next_clause,\\n            1 => {\\n                asg.assign_at_rootlevel(vivified[0]).expect(\\"impossible\\");\\n                assert!(asg.propagate(cdb) == ClauseId::default(), \\"UNSAT\\");\\n            }\\n            _ => cdb.new_clause(asg, &mut vivified),\\n        }\\n        cdb.remove_clause(*ci);\\n    }\\n}\\n```\\n\\n* 空節の取り扱い（Rule 1\'）、充足節の除去（Rule 2）はsolverに任せるのがいいだろうから、こう変更することにした。ただ、空節があるのに先に行っていいものだろうかという疑問はある。また、空節の場合のみ31行が成立するから8行めは無意味かも。\\n\\n```diff\\n-                 Some(false) => copied.push(!*l),            // Rule 1\\n+                 Some(false) => continue,                    // Rule 1\'\\n```\\n\\n### 2020-07-07\\n\\n読了。そして理解した。プログラムを論文に忠実なものにした。\\n読む前はその分量に抵抗を感じていたのだけど、意外に素直な読みやすい論文だった。\\n「permanent clauseは `rank` を変更しない」というマイクロチューニングを放棄する日が来るとは。。。\\n\\n* Rule 1が正しいものに戻された\\n* Rule 2が正しいものに戻された\\n* 部分節なのかその否定なのかを変数`flipped`で保持\\n* flippedの役割も担っていた変数`vivified`は削除\\n* 部分節が空節の場合でも処理を続ける\\n* 部分節が単位節の場合の検査は省略して、そのまま例外を上流に投げる\\n\\n```rust\\nfn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) -> MaybeInconsistent {\\n    let mut clauses: Vec<ClauseId> = Vec::new();\\n    for (i, c) in cdb.iter_mut().enumerate() {\\n        if c.to_vivify() { clauses.push(ClauseId::from(i)); }\\n    }\\n    clauses.sort_by_key(|ci| cdb[*ci].rank);\\n    for ci in clauses.iter() {\\n        let c: &mut Clause = &mut cdb[ci];\\n        let mut copied: Vec<Lit> = Vec::new();\\n        let mut flipped = true;\\n        \'this_clause: for l in c.lits.iter() {\\n            match asg.assigned(*l) {\\n                Some(false) => continue \'this_clause,         // Rule 1\\n                Some(true) => {\\n                    copied.push(!*l);\\n                    let r = asg.reason_literals(cdb, *l);\\n                    copied = asg.minimize(cdb, &copied, &r);  // Rule 2\\n                    flipped = false;\\n                    break \'this_clause;\\n                }\\n                None => {\\n                    let cid: Option<ClauseId> = match copied.len() {\\n                        0 => None,\\n                        1 => { asg.assign_by_decision(copied[0]); None }\\n                        _ => Some(cdb.new_clause(asg, &mut copied)),\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    let cc = asg.propagate(cdb);\\n                    copied.push(!*l);                         // Rule 4\\n                    if cc != ClauseId::default() {\\n                        let r = cdb[cc].lits.clone();         // Rule 3\\n                        copied = asg.minimize(cdb, &copied, &r);\\n                        flipped = false;\\n                    }\\n                    asg.cancel_until(asg.root_level);\\n                    if let Some(cj) = cid { cdb.remove_clause(cj); }\\n                    if cc != ClauseId::default() { break \'this_clause; }\\n                }\\n            }\\n        }\\n        if flipped { flip(&mut copied); }\\n        match copied.len() {\\n            0 => (),\\n            1 => asg.assign_at_rootlevel(copied[0])?,\\n            _ => cdb.new_clause(asg, &mut copied),\\n        }\\n        cdb.remove_clause(*ci);\\n    }\\n\\tOk(())\\n}\\n```\\n\\n### 2020-07-08\\n\\nほぼ完成。\\n色々とチューニング中。\\n途中で答えの充足性が無茶苦茶になってしまってまた大変なデバッグが始まるのかと思いきや、原因を追っていくと決定レベルが0でないところでvivificationをしていただけだった。\\n\\n修正しながら、このコードは特に決定レベル0に依存するところはないなあ（lockされた節さえ避ければよい）と気づいたのだが、さて、そうすると、解の近くにきた場合にrandom walkというかbelief propagationというか、そういうのの代わりに使えないものだろうか。。。。\\n\\nそれは無理。12行目で割当てを調べているが、この値は現在の部分割当て列に依存している。これは単なる仮説。\\n従ってこの結果に基づいてリテラルを削除したり簡略化したりはできない。\\n\\n### 2020-07-09\\n\\nL45で追加してL47削除するのは無駄なので対消滅させた。なぜかinconsistent errorが出た。\\n`propagate`が矛盾を返す。なぜだろう。\\n\\nそのうちなくなった。。。\\n\\n### 2020-07-22\\n\\n250変数の問題でpanicを起こした！\\nトレースしてみると、27行目の`assign_by_decision`が実際には矛盾を発生していたにも関わらず、この関数は例外を投げないので、後の伝播で問題が発生したようだ。\\npropagate側の関数にはあまり手を入れたくなかったので、27行目の前にチェックを入れることにして対応した（24行目の方は論理的に大丈夫なはず）。\\nまさか、こんな小さな問題でバグが検出されるとは。\\n\\nついでに45行目の前にbiclauseだったら重複検査もすることにしました。\\n\\n\\n### 2020-08-14\\n\\nまだバグが出る。\\nやはりL44の`asg.assign_at_rootlevel(copied[0])?`で変数がassertされたら直後に`propagate`しないと、伝播の取りこぼしが起きてしまうようだ。\\nvivificationの対象リテラル数を増やすと現れてきたのでおそらくこの解釈でいいんだと思う。\\n\\n### 2020-08-15\\n\\nうーむ、ここではひっかかるまいとちょっとだけ期待していたのだが、天網恢恢疎にして漏らさず、やっぱり上で追加した`propagate`が矛盾を発生させることもあるわいなぁ。\\nちゃんと返値をチェックして`SolverError::Inconsistent`を返すことにしました。\\n\\n```\\nRunning on the 204-206th problem ezfact64_8.shuffled-as.sat03-1524-sc2002...SAT/SR19/f10nidw-sc2012.cnf: thread \'main\' panicked at \'Vivification found an uncatchable inconsistency.\', src/solver/vivify.rs:147:21\\nnote: run with `RUST_BACKTRACE=1` environment variable to display a backtrace\\n```","bodyHtml":"<p><strong>cover image: https://unsplash.com/photos/tYs9rjaT8Vc</strong></p>\\n<p>Vivification についての調査第2弾、2018年投稿2019年公開の論文をまとめてみた。</p>\\n<ul>\\n<li>\\n<p>Chu-Min Li <em>et al.</em>, &quot;Clause vivification by unit propagation in CDCL SAT solvers,”<em>Artif. Intell.</em>, vol. 279, 2019.</p>\\n</li>\\n<li>\\n<p><a href=\\"/2020/2020-08-19-splr-with-vivification/\\">part 2</a></p>\\n</li>\\n</ul>\\n<h3>Errata</h3>\\n<ul>\\n<li><strong>Algorithm 3</strong>のL17はforeachの内側</li>\\n<li><strong>Algorithm 4</strong>のLL.9-10はthen節の中</li>\\n</ul>\\n<h3>Outline</h3>\\n<p>Vivificationは魅力的な節削減手法のでSAT competitionに提出されるようなソルバに導入されたもの、その後改善が計算量に見合わないため、取り下げられることが続いてきた。\\nこの論文はどのタイミングで、どの節を、どのリテラルからvivifyすればよいかについて論じている。\\n特に<a href=\\"/2020/2020-06-20-vivification/\\">原論文</a>では\'future work\'としてのみ触れられていたin-processorとして使う場合の改善に重きを置いている。\\nなお、Cadicalはこの論文で提案された手法とは無関係。所与の節にもvivificationをするべきだという主張の傍証実験に使われただけ。ただし、Cadicalが使っているのは著者らの別の論文に基づくものなので、無関係とは言い過ぎかも。</p>\\n<p>結論は以下の通り。</p>\\n<ul>\\n<li>タイミング -- 節削減の後のリスタート</li>\\n<li>対象節 -- LBD順で対象集合の半分\\n<ul>\\n<li>与えられた節 -- LBDが20以下の学習節の導出に使われており、LBDが1になる、またはLBDが3回減少すれば再び対象に加える。それとは別に pre-processing phase で$10^8$リテラルまで処理する。</li>\\n<li>学習節 -- LBDが1になる、またはLBDが2回減少すれば再び対象に加える</li>\\n</ul>\\n</li>\\n<li>リテラル順 -- as is</li>\\n</ul>\\n<p>なお、以下のようにin-processor向けに <code>vivify</code> のアルゴリズムが変更されている。</p>\\n<p><img src=\\"/img/2020/07-05/vivi-algo3.jpg\\" alt=\\"\\"></p>\\n<ul>\\n<li>節へのリテラルの追加は$\\\\vee$で、節集合および部分割り当てへの節または割り当ての追加は$\\\\cup$で表されている。つまり節が拡大するのはL17のみ。(<strong>2020-08-21追記</strong>)</li>\\n<li><s>なんか怪しい。なぜ $\\\\phi \\\\cup \\\\neg C\'$ なのだ？ どうして$C$に含まれていたリテラルの否定を集めた節が$\\\\text{vivified} C = C\'$ なのだ</s> ここがミソ。</li>\\n<li>何にせよ最初に存在した節は17行目で必ず削除される。</li>\\n<li>17行目は一つ内側のループに含まれるはずですけど。</li>\\n<li>この関数は決定レベル0を想定していない。だから<code>conflictAnalysis</code>を呼び出している。もし決定レベル0を想定するなら、これは決定変数の否定からなる単位節を返す処理に帰着する。従ってL10は $C\' \\\\leftarrow {l_i}$と等価だか、そもそも$l_i$は割り当て済みだから何もしないのと同等。一方L13に関しては、その前のステップで決定による割り当てを行っている可能性があるのでレベル0が仮定できない。従って通常の矛盾解析を行い、<strong>学習節を追加する</strong>ことが必要である。</li>\\n</ul>\\n<h3>節$C$が冗長であることを言う。</h3>\\n<p>数学的準備：</p>\\n<ul>\\n<li>$(\\\\phi, \\\\omega) \\\\models \\\\omega\'$は節集合$\\\\phi$と部分割当集合$\\\\omega$から無矛盾な割り当て集合$\\\\omega\'$が導出されることを意味する。割当が空でも$\\\\omega$を導出できるなら$\\\\phi \\\\models \\\\omega$とも書く。</li>\\n<li>$(\\\\phi, \\\\omega)$が矛盾を起こしているなら$\\\\bot$で矛盾を表し、$(\\\\phi, \\\\omega) \\\\models \\\\bot$と書くことにする。</li>\\n<li>節$C$が冗長とは式$\\\\phi$と$\\\\phi\\\\setminus{C}$が論理的に等値であることを意味する。</li>\\n<li>一般に節$C$に含まれる全てのリテラルを否定した節を$\\\\neg C$と書くと$\\\\forall C: (C \\\\cup \\\\neg C) \\\\models \\\\bot$が成立する。</li>\\n<li>（⭐️）一般に節$C$に対して自身の部分節$C\'$の否定節$\\\\neg C\'$を加えることで矛盾が生じる（$C \\\\cup \\\\neg C\' \\\\models \\\\bot$）なら、節$C$は$C\'$に包含される。節$C$はリテラル$l\' \\\\in C\\\\setminus{C\'}$に対して何の制約にもなっていない。</li>\\n</ul>\\n<ol>\\n<li>前提として$\\\\phi \\\\nvDash \\\\bot$であるとする。</li>\\n<li>ある節Cの部分節$C\'$の否定節を加えても矛盾を導出しないなら、それは節Cは$C\\\\setminus{C\'}$に包摂できることを意味している。</li>\\n<li>そのような部分節にリテラル$l\' \\\\in C$の否定を加えた節を追加すると矛盾が起きたとする。それは部分節または$l\'$のどちらかが充足することが必要であることを意味している。これは$\\\\phi$から導出された学習節である（$\\\\phi$の論理的帰結）。</li>\\n<li>学習節$\\\\neg \\\\neg C\' \\\\cup {\\\\neg \\\\neg l\'} = C\' \\\\cup l\'$は節$C$の部分節である。なので（⭐️）より置き換えてよい。</li>\\n</ol>\\n<h3>余談</h3>\\n<ul>\\n<li>COMiniSATPS, MapleCOMSPS, MapleCOMSPS_LRB は学習節の3層管理をしている。節削減対象はLOCALのみ。\\n<ul>\\n<li>CORE -- LBDが小さいもの</li>\\n<li>TIER2 --　LBDが中間のもの。長期間依存グラフに現れないと格下げ。</li>\\n<li>LOCAL -- それ以外</li>\\n</ul>\\n</li>\\n<li>COMiniSATPS, MapleCOMSPS, MapleCOMSPS_LRB はGulcose的なリスタートフェーズとLuby列に基づくリスタートフェーズを交互に使っている。これはStabilizationの先駆け？</li>\\n</ul>\\n<h3>2020-07-05 Splr approach</h3>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">vivify</span></span>(asg: &amp;<span class=\\"hljs-keyword\\">mut</span> AssignStack, cdb: &amp;<span class=\\"hljs-keyword\\">mut</span> ClauseDB) {\\n    <span class=\\"hljs-symbol\\">\'next_clause</span>: <span class=\\"hljs-keyword\\">for</span> ci <span class=\\"hljs-keyword\\">in</span> clauses.iter() {\\n        <span class=\\"hljs-keyword\\">let</span> c: &amp;Clause = &amp;cdb[ci];\\n        <span class=\\"hljs-keyword\\">if</span> c.is(Flag::DEAD) { <span class=\\"hljs-keyword\\">continue</span>; }\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> copied: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> vivified: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">for</span> l <span class=\\"hljs-keyword\\">in</span> c.lits.clone().iter() {\\n            <span class=\\"hljs-keyword\\">match</span> asg.assigned(*l) {\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">false</span>) =&gt; copied.push(!*l),            <span class=\\"hljs-comment\\">// Rule 1</span>\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">true</span>) =&gt; <span class=\\"hljs-keyword\\">continue</span> <span class=\\"hljs-symbol\\">\'next_clause</span>,        <span class=\\"hljs-comment\\">// Rule 2\'</span>\\n                <span class=\\"hljs-literal\\">None</span> =&gt; {\\n                    <span class=\\"hljs-keyword\\">let</span> cid: <span class=\\"hljs-built_in\\">Option</span>&lt;ClauseId&gt; = <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n                        <span class=\\"hljs-number\\">0</span> =&gt; <span class=\\"hljs-literal\\">None</span>,\\n                        <span class=\\"hljs-number\\">1</span> =&gt; { asg.assign_by_decision(copied[<span class=\\"hljs-number\\">0</span>]); <span class=\\"hljs-literal\\">None</span> }\\n                        _ =&gt; <span class=\\"hljs-literal\\">Some</span>(cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied)), <span class=\\"hljs-comment\\">// L.12</span>\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    <span class=\\"hljs-keyword\\">let</span> cc = asg.propagate(cdb);\\n                    <span class=\\"hljs-keyword\\">if</span> cc != ClauseId::<span class=\\"hljs-keyword\\">default</span>() {\\n                        vivified = asg.minimize(cdb, &amp;v, &amp;cdb[cc].lits); <span class=\\"hljs-comment\\">// Rule 3</span>\\n                    }\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(cj) = cid { cdb.remove_clause(cj); }\\n                    asg.cancel_until(asg.root_level);\\n                    <span class=\\"hljs-keyword\\">if</span> cc != ClauseId::<span class=\\"hljs-keyword\\">default</span>() { <span class=\\"hljs-keyword\\">break</span>; }\\n                    copied.push(!*l);                       <span class=\\"hljs-comment\\">// Rule 4</span>\\n                }\\n            }\\n        }\\n        <span class=\\"hljs-keyword\\">if</span> vivified.is_empty() {\\n            <span class=\\"hljs-keyword\\">for</span> l <span class=\\"hljs-keyword\\">in</span> &amp;<span class=\\"hljs-keyword\\">mut</span> copied { *l = !*l; }\\n            std::mem::swap(&amp;<span class=\\"hljs-keyword\\">mut</span> vivified, &amp;<span class=\\"hljs-keyword\\">mut</span> copied);\\n        }\\n        <span class=\\"hljs-keyword\\">match</span> vivified.len() {\\n            <span class=\\"hljs-number\\">0</span> =&gt; <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'next_clause</span>,\\n            <span class=\\"hljs-number\\">1</span> =&gt; {\\n                asg.assign_at_rootlevel(vivified[<span class=\\"hljs-number\\">0</span>]).expect(<span class=\\"hljs-string\\">\\"impossible\\"</span>);\\n                <span class=\\"hljs-built_in\\">assert!</span>(asg.propagate(cdb) == ClauseId::<span class=\\"hljs-keyword\\">default</span>(), <span class=\\"hljs-string\\">\\"UNSAT\\"</span>);\\n            }\\n            _ =&gt; cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> vivified),\\n        }\\n        cdb.remove_clause(*ci);\\n    }\\n}</code></pre><ul>\\n<li>空節の取り扱い（Rule 1\'）、充足節の除去（Rule 2）はsolverに任せるのがいいだろうから、こう変更することにした。ただ、空節があるのに先に行っていいものだろうかという疑問はある。また、空節の場合のみ31行が成立するから8行めは無意味かも。</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-deletion\\">-                 Some(false) =&gt; copied.push(!*l),            // Rule 1</span>\\n<span class=\\"hljs-addition\\">+                 Some(false) =&gt; continue,                    // Rule 1\'</span></code></pre><h3>2020-07-07</h3>\\n<p>読了。そして理解した。プログラムを論文に忠実なものにした。\\n読む前はその分量に抵抗を感じていたのだけど、意外に素直な読みやすい論文だった。\\n「permanent clauseは <code>rank</code> を変更しない」というマイクロチューニングを放棄する日が来るとは。。。</p>\\n<ul>\\n<li>Rule 1が正しいものに戻された</li>\\n<li>Rule 2が正しいものに戻された</li>\\n<li>部分節なのかその否定なのかを変数<code>flipped</code>で保持</li>\\n<li>flippedの役割も担っていた変数<code>vivified</code>は削除</li>\\n<li>部分節が空節の場合でも処理を続ける</li>\\n<li>部分節が単位節の場合の検査は省略して、そのまま例外を上流に投げる</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">vivify</span></span>(asg: &amp;<span class=\\"hljs-keyword\\">mut</span> AssignStack, cdb: &amp;<span class=\\"hljs-keyword\\">mut</span> ClauseDB) -&gt; MaybeInconsistent {\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> clauses: <span class=\\"hljs-built_in\\">Vec</span>&lt;ClauseId&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n    <span class=\\"hljs-keyword\\">for</span> (i, c) <span class=\\"hljs-keyword\\">in</span> cdb.iter_mut().enumerate() {\\n        <span class=\\"hljs-keyword\\">if</span> c.to_vivify() { clauses.push(ClauseId::from(i)); }\\n    }\\n    clauses.sort_by_key(|ci| cdb[*ci].rank);\\n    <span class=\\"hljs-keyword\\">for</span> ci <span class=\\"hljs-keyword\\">in</span> clauses.iter() {\\n        <span class=\\"hljs-keyword\\">let</span> c: &amp;<span class=\\"hljs-keyword\\">mut</span> Clause = &amp;<span class=\\"hljs-keyword\\">mut</span> cdb[ci];\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> copied: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> flipped = <span class=\\"hljs-literal\\">true</span>;\\n        <span class=\\"hljs-symbol\\">\'this_clause</span>: <span class=\\"hljs-keyword\\">for</span> l <span class=\\"hljs-keyword\\">in</span> c.lits.iter() {\\n            <span class=\\"hljs-keyword\\">match</span> asg.assigned(*l) {\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">false</span>) =&gt; <span class=\\"hljs-keyword\\">continue</span> <span class=\\"hljs-symbol\\">\'this_clause</span>,         <span class=\\"hljs-comment\\">// Rule 1</span>\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">true</span>) =&gt; {\\n                    copied.push(!*l);\\n                    <span class=\\"hljs-keyword\\">let</span> r = asg.reason_literals(cdb, *l);\\n                    copied = asg.minimize(cdb, &amp;copied, &amp;r);  <span class=\\"hljs-comment\\">// Rule 2</span>\\n                    flipped = <span class=\\"hljs-literal\\">false</span>;\\n                    <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'this_clause</span>;\\n                }\\n                <span class=\\"hljs-literal\\">None</span> =&gt; {\\n                    <span class=\\"hljs-keyword\\">let</span> cid: <span class=\\"hljs-built_in\\">Option</span>&lt;ClauseId&gt; = <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n                        <span class=\\"hljs-number\\">0</span> =&gt; <span class=\\"hljs-literal\\">None</span>,\\n                        <span class=\\"hljs-number\\">1</span> =&gt; { asg.assign_by_decision(copied[<span class=\\"hljs-number\\">0</span>]); <span class=\\"hljs-literal\\">None</span> }\\n                        _ =&gt; <span class=\\"hljs-literal\\">Some</span>(cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied)),\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    <span class=\\"hljs-keyword\\">let</span> cc = asg.propagate(cdb);\\n                    copied.push(!*l);                         <span class=\\"hljs-comment\\">// Rule 4</span>\\n                    <span class=\\"hljs-keyword\\">if</span> cc != ClauseId::<span class=\\"hljs-keyword\\">default</span>() {\\n                        <span class=\\"hljs-keyword\\">let</span> r = cdb[cc].lits.clone();         <span class=\\"hljs-comment\\">// Rule 3</span>\\n                        copied = asg.minimize(cdb, &amp;copied, &amp;r);\\n                        flipped = <span class=\\"hljs-literal\\">false</span>;\\n                    }\\n                    asg.cancel_until(asg.root_level);\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(cj) = cid { cdb.remove_clause(cj); }\\n                    <span class=\\"hljs-keyword\\">if</span> cc != ClauseId::<span class=\\"hljs-keyword\\">default</span>() { <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'this_clause</span>; }\\n                }\\n            }\\n        }\\n        <span class=\\"hljs-keyword\\">if</span> flipped { flip(&amp;<span class=\\"hljs-keyword\\">mut</span> copied); }\\n        <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n            <span class=\\"hljs-number\\">0</span> =&gt; (),\\n            <span class=\\"hljs-number\\">1</span> =&gt; asg.assign_at_rootlevel(copied[<span class=\\"hljs-number\\">0</span>])?,\\n            _ =&gt; cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied),\\n        }\\n        cdb.remove_clause(*ci);\\n    }\\n\\t<span class=\\"hljs-literal\\">Ok</span>(())\\n}</code></pre><h3>2020-07-08</h3>\\n<p>ほぼ完成。\\n色々とチューニング中。\\n途中で答えの充足性が無茶苦茶になってしまってまた大変なデバッグが始まるのかと思いきや、原因を追っていくと決定レベルが0でないところでvivificationをしていただけだった。</p>\\n<p>修正しながら、このコードは特に決定レベル0に依存するところはないなあ（lockされた節さえ避ければよい）と気づいたのだが、さて、そうすると、解の近くにきた場合にrandom walkというかbelief propagationというか、そういうのの代わりに使えないものだろうか。。。。</p>\\n<p>それは無理。12行目で割当てを調べているが、この値は現在の部分割当て列に依存している。これは単なる仮説。\\n従ってこの結果に基づいてリテラルを削除したり簡略化したりはできない。</p>\\n<h3>2020-07-09</h3>\\n<p>L45で追加してL47削除するのは無駄なので対消滅させた。なぜかinconsistent errorが出た。\\n<code>propagate</code>が矛盾を返す。なぜだろう。</p>\\n<p>そのうちなくなった。。。</p>\\n<h3>2020-07-22</h3>\\n<p>250変数の問題でpanicを起こした！\\nトレースしてみると、27行目の<code>assign_by_decision</code>が実際には矛盾を発生していたにも関わらず、この関数は例外を投げないので、後の伝播で問題が発生したようだ。\\npropagate側の関数にはあまり手を入れたくなかったので、27行目の前にチェックを入れることにして対応した（24行目の方は論理的に大丈夫なはず）。\\nまさか、こんな小さな問題でバグが検出されるとは。</p>\\n<p>ついでに45行目の前にbiclauseだったら重複検査もすることにしました。</p>\\n<h3>2020-08-14</h3>\\n<p>まだバグが出る。\\nやはりL44の<code>asg.assign_at_rootlevel(copied[0])?</code>で変数がassertされたら直後に<code>propagate</code>しないと、伝播の取りこぼしが起きてしまうようだ。\\nvivificationの対象リテラル数を増やすと現れてきたのでおそらくこの解釈でいいんだと思う。</p>\\n<h3>2020-08-15</h3>\\n<p>うーむ、ここではひっかかるまいとちょっとだけ期待していたのだが、天網恢恢疎にして漏らさず、やっぱり上で追加した<code>propagate</code>が矛盾を発生させることもあるわいなぁ。\\nちゃんと返値をチェックして<code>SolverError::Inconsistent</code>を返すことにしました。</p>\\n<pre><code>Running on the 204-206th problem ezfact64_8.shuffled-as.sat03-1524-sc2002...SAT/SR19/f10nidw-sc2012.cnf: thread \'main\' panicked at \'Vivification found an uncatchable inconsistency.\', src/solver/vivify.rs:147:21\\nnote: run with `RUST_BACKTRACE=1` environment variable to display a backtrace\\n</code></pre>\\n","dir":"article/.json/2020","base":"2020-07-05-vivification2.json","ext":".json","sourceBase":"2020-07-05-vivification2.md","sourceExt":".md"}')}}]);