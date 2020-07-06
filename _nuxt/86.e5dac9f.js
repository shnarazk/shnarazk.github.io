(window.webpackJsonp=window.webpackJsonp||[]).push([[86],{559:function(n){n.exports=JSON.parse('{"title":"Clause Vivification updated 2020","subtitle":"vivification part 2","date":"2020-07-06T00:00:00.000Z","tags":["SAT","vivification","splr"],"banner":"https://images.unsplash.com/photo-1586508217007-6e8b3151a6f2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80","bodyContent":"**cover image: https://unsplash.com/photos/tYs9rjaT8Vc**\\n\\nVivification についての第2弾、2018年投稿2020年公開（？）の論文をまとめてみた。\\n\\n* Chu-Min Li *et al.*, \\"Clause vivification by unit propagation in CDCL SAT solvers,”*Artif. Intell.*, vol. 279, 2020.\\n\\n### Outline\\n\\nVivificationは魅力的な節削減手法のでSAT competitionに提出されるようなソルバに導入されたもの、その後改善が計算量に見合わないため、取り下げられることが続いてきた。\\nこの論文はどのタイミングで、どの節を、どのリテラルからvivifyすればよいかについて論じている。\\n特に[原論文](/2020/2020-06-20-vivification/)では\'future work\'としてのみ触れられていたin-processorとして使う場合の改善に重きを置いている。\\n\\n結論は以下の通り。\\n\\n* タイミング -- 節削減の後のリスタート\\n* 対象節 -- 活性度順で半分、ただし1回のみ\\n* リテラル順 -- as is\\n\\nなお、以下のようにin-processor向けに `vivify` のアルゴリズムが変更されている。\\n\\n![](/img/2020/07-05/vivi-algo3.jpg)\\n\\n* なんか怪しい。なぜ $\\\\phi \\\\cup \\\\not C\\\\prime$ なのだ？\\n* 何にせよ最初に存在した節は17行目で必ず削除される。\\n* 17行目は一つ内側のループに含まれるはずですけど。\\n\\n### Splr approach\\n\\n```rust\\nfn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) {\\n    \'next_clause: for ci in clauses.iter() {\\n        let c: &Clause = &cdb[ci];\\n        if c.is(Flag::DEAD) { continue; }\\n        let mut copied: Vec<Lit> = Vec::new();\\n        let mut vivified: Vec<Lit> = Vec::new();\\n        for l in c.lits.clone().iter() {\\n            match asg.assigned(*l) {\\n                Some(false) => copied.push(!*l),            // Rule 1\\n                Some(true) => continue \'next_clause,        // Rule 2\'\\n                None => {\\n                    let cid: Option<ClauseId> = match copied.len() {\\n                        0 => None,\\n                        1 => { asg.assign_by_decision(copied[0]); None }\\n                        _ => Some(cdb.new_clause(asg, &mut copied)), // L.12\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    let cc = asg.propagate(cdb);\\n                    if cc != ClauseId::default() {\\n                        vivified = asg.minimize(cdb, &v, &cdb[cc].lits); // Rule 3\\n                    }\\n                    if let Some(cj) = cid { cdb.remove_clause(cj); }\\n                    asg.cancel_until(asg.root_level);\\n                    if cc != ClauseId::default() { break; }\\n                    copied.push(!*l);                       // Rule 4\\n                }\\n            }\\n        }\\n        if vivified.is_empty() {\\n            for l in &mut copied { *l = !*l; }\\n            std::mem::swap(&mut vivified, &mut copied);\\n        }\\n        match vivified.len() {\\n            0 => break \'next_clause,\\n            1 => {\\n                asg.assign_at_rootlevel(vivified[0]).expect(\\"impossible\\");\\n                assert!(asg.propagate(cdb) == ClauseId::default(), \\"UNSAT\\");\\n            }\\n            _ => cdb.new_clause(asg, &mut vivified),\\n        }\\n        cdb.remove_clause(*ci);\\n    }\\n}\\n```\\n\\n* 空節の取り扱い（Rule 1\'）、充足節の除去（Rule 2）はsolverに任せるのがいいだろうから、こう変更することにした。ただ、空節があるのに先に行っていいものだろうかという疑問はある。また、空節の場合のみ31行が成立するから8行めは無意味かも。\\n\\n```diff\\n-                 Some(false) => copied.push(!*l),            // Rule 1\\n+                 Some(false) => continue,                    // Rule 1\'\\n```","bodyHtml":"<p><strong>cover image: https://unsplash.com/photos/tYs9rjaT8Vc</strong></p>\\n<p>Vivification についての第2弾、2018年投稿2020年公開（？）の論文をまとめてみた。</p>\\n<ul>\\n<li>Chu-Min Li <em>et al.</em>, &quot;Clause vivification by unit propagation in CDCL SAT solvers,”<em>Artif. Intell.</em>, vol. 279, 2020.</li>\\n</ul>\\n<h3>Outline</h3>\\n<p>Vivificationは魅力的な節削減手法のでSAT competitionに提出されるようなソルバに導入されたもの、その後改善が計算量に見合わないため、取り下げられることが続いてきた。\\nこの論文はどのタイミングで、どの節を、どのリテラルからvivifyすればよいかについて論じている。\\n特に<a href=\\"/2020/2020-06-20-vivification/\\">原論文</a>では\'future work\'としてのみ触れられていたin-processorとして使う場合の改善に重きを置いている。</p>\\n<p>結論は以下の通り。</p>\\n<ul>\\n<li>タイミング -- 節削減の後のリスタート</li>\\n<li>対象節 -- 活性度順で半分、ただし1回のみ</li>\\n<li>リテラル順 -- as is</li>\\n</ul>\\n<p>なお、以下のようにin-processor向けに <code>vivify</code> のアルゴリズムが変更されている。</p>\\n<p><img src=\\"/img/2020/07-05/vivi-algo3.jpg\\" alt=\\"\\"></p>\\n<ul>\\n<li>なんか怪しい。なぜ $\\\\phi \\\\cup \\\\not C\\\\prime$ なのだ？</li>\\n<li>何にせよ最初に存在した節は17行目で必ず削除される。</li>\\n<li>17行目は一つ内側のループに含まれるはずですけど。</li>\\n</ul>\\n<h3>Splr approach</h3>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">vivify</span></span>(asg: &amp;<span class=\\"hljs-keyword\\">mut</span> AssignStack, cdb: &amp;<span class=\\"hljs-keyword\\">mut</span> ClauseDB) {\\n    <span class=\\"hljs-symbol\\">\'next_clause</span>: <span class=\\"hljs-keyword\\">for</span> ci <span class=\\"hljs-keyword\\">in</span> clauses.iter() {\\n        <span class=\\"hljs-keyword\\">let</span> c: &amp;Clause = &amp;cdb[ci];\\n        <span class=\\"hljs-keyword\\">if</span> c.is(Flag::DEAD) { <span class=\\"hljs-keyword\\">continue</span>; }\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> copied: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> vivified: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">for</span> l <span class=\\"hljs-keyword\\">in</span> c.lits.clone().iter() {\\n            <span class=\\"hljs-keyword\\">match</span> asg.assigned(*l) {\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">false</span>) =&gt; copied.push(!*l),            <span class=\\"hljs-comment\\">// Rule 1</span>\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">true</span>) =&gt; <span class=\\"hljs-keyword\\">continue</span> <span class=\\"hljs-symbol\\">\'next_clause</span>,        <span class=\\"hljs-comment\\">// Rule 2\'</span>\\n                <span class=\\"hljs-literal\\">None</span> =&gt; {\\n                    <span class=\\"hljs-keyword\\">let</span> cid: <span class=\\"hljs-built_in\\">Option</span>&lt;ClauseId&gt; = <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n                        <span class=\\"hljs-number\\">0</span> =&gt; <span class=\\"hljs-literal\\">None</span>,\\n                        <span class=\\"hljs-number\\">1</span> =&gt; { asg.assign_by_decision(copied[<span class=\\"hljs-number\\">0</span>]); <span class=\\"hljs-literal\\">None</span> }\\n                        _ =&gt; <span class=\\"hljs-literal\\">Some</span>(cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied)), <span class=\\"hljs-comment\\">// L.12</span>\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    <span class=\\"hljs-keyword\\">let</span> cc = asg.propagate(cdb);\\n                    <span class=\\"hljs-keyword\\">if</span> cc != ClauseId::<span class=\\"hljs-keyword\\">default</span>() {\\n                        vivified = asg.minimize(cdb, &amp;v, &amp;cdb[cc].lits); <span class=\\"hljs-comment\\">// Rule 3</span>\\n                    }\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(cj) = cid { cdb.remove_clause(cj); }\\n                    asg.cancel_until(asg.root_level);\\n                    <span class=\\"hljs-keyword\\">if</span> cc != ClauseId::<span class=\\"hljs-keyword\\">default</span>() { <span class=\\"hljs-keyword\\">break</span>; }\\n                    copied.push(!*l);                       <span class=\\"hljs-comment\\">// Rule 4</span>\\n                }\\n            }\\n        }\\n        <span class=\\"hljs-keyword\\">if</span> vivified.is_empty() {\\n            <span class=\\"hljs-keyword\\">for</span> l <span class=\\"hljs-keyword\\">in</span> &amp;<span class=\\"hljs-keyword\\">mut</span> copied { *l = !*l; }\\n            std::mem::swap(&amp;<span class=\\"hljs-keyword\\">mut</span> vivified, &amp;<span class=\\"hljs-keyword\\">mut</span> copied);\\n        }\\n        <span class=\\"hljs-keyword\\">match</span> vivified.len() {\\n            <span class=\\"hljs-number\\">0</span> =&gt; <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'next_clause</span>,\\n            <span class=\\"hljs-number\\">1</span> =&gt; {\\n                asg.assign_at_rootlevel(vivified[<span class=\\"hljs-number\\">0</span>]).expect(<span class=\\"hljs-string\\">\\"impossible\\"</span>);\\n                <span class=\\"hljs-built_in\\">assert!</span>(asg.propagate(cdb) == ClauseId::<span class=\\"hljs-keyword\\">default</span>(), <span class=\\"hljs-string\\">\\"UNSAT\\"</span>);\\n            }\\n            _ =&gt; cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> vivified),\\n        }\\n        cdb.remove_clause(*ci);\\n    }\\n}</code></pre><ul>\\n<li>空節の取り扱い（Rule 1\'）、充足節の除去（Rule 2）はsolverに任せるのがいいだろうから、こう変更することにした。ただ、空節があるのに先に行っていいものだろうかという疑問はある。また、空節の場合のみ31行が成立するから8行めは無意味かも。</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-deletion\\">-                 Some(false) =&gt; copied.push(!*l),            // Rule 1</span>\\n<span class=\\"hljs-addition\\">+                 Some(false) =&gt; continue,                    // Rule 1\'</span></code></pre>","dir":"article/.json/2020","base":"2020-07-05-vivification2.json","ext":".json","sourceBase":"2020-07-05-vivification2.md","sourceExt":".md"}')}}]);