(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{573:function(n){n.exports=JSON.parse('{"title":"Implementing clause vivification on Splr","subtitle":"vivification part 3","date":"2020-08-23T00:00:00.000Z","tags":["SAT","vivification","splr"],"banner":"https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80","bodyContent":"**cover image: https://unsplash.com/photos/-IMlv9Jlb24**\\n\\nVersion 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。\\nSAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。\\nvivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。\\n\\n## 1. gratgenのこういうメッセージがどうやっても解消できない\\n\\n```text\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\n```\\n\\nうーん、そんなはずはないのだが。。。\\n\\n理由：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。\\n\\n## 2. なぜかAssignStack中に未割り当てリテラルが出現する\\n\\n理由：変数への仮割り当ての前提条件の検査が不十分だった。\\n\\n## 3. 2020-08-21 記号の読み間違え判明\\n\\n[Clause Vivification updated 2020](/2020/2020-07-05-vivification2/)に記載の通り。\\n\\n## 4. vivify中に決定による割り当てを行っただけでcertificateが不当なものになってしまう\\n\\n理由：Eliminatorがバグってた！\\n\\n## 5. Eliminatorを直しても以下省略\\n\\n理由：`cdb.detach(); cdb.garbage_collect();` が非常に怪しい。\\n\\n## 6. `propagate`しなくてもおかしくなる\\n\\n理由：節の追加削除しか原因はない。\\n\\n## 7. Rule. 3の解釈が怪しい\\n\\n> **Rule_3**: If $\\\\text{UP}(\\\\phi \\\\cup \\\\{\\\\neg l_1, \\\\ldots, \\\\neg l_i \\\\}) = \\\\Box$, then $\\\\phi \\\\cup \\\\{\\\\neg l_1, \\\\ldots, \\\\neg l_i \\\\}$ is unsatisfiable and clause $l_1 \\\\vee \\\\cdots \\\\vee l_i$ is a logical consequence of $\\\\phi$ and could replace $C$. However, as before, let $R$ be the set of literals of the falsified clause, $conflAnalysis(\\\\phi, \\\\neg C\' \\\\cup \\\\{\\\\neg l_i \\\\}, R)$, which is a sub-clause of $l_1 \\\\vee \\\\cdots \\\\vee l_i$ .\\n\\nそもそも`conflict_analysis`の引数の解釈は大丈夫だろうか。なぜ3引数なのか。ということで論文より引用し直し。\\n\\n![](/img/2020/08-19/Algorithm4_conflAnalysis.jpg)\\n\\n![](/img/2020/07-05/vivi-algo3.jpg)\\n\\n大丈夫なようだ。矛盾しているリテラルを拾うためにリテラルベースではなく、変数ベースでアクセスしている。\\n特に問題はない。例えば節長が1の学習節をcertificateに含めても問題は発生しない。\\n\\n## 8. しかし生成された節を certificate に含めると証明にならない\\n\\n理由：**Algorithm 4**は間違い。もし最上位レベルでの含意によって割り当てられるリテラルだけからなる節によって矛盾が発生したとする。この場合**Algorithm 4**では決定変数が学習節に含まれない。なので**Algorithm 4**は以下であるべき。\\n\\n```diff\\n  fn analyze(asg: &AssignStack, cdb: &ClauseDB, lits: &[Lit], reason: &[Lit], ...) -> Vec<Lit> {\\n       let mut res: Vec<Lit> = Vec::new();\\n       for l in reason { seen[l.vi()] = key; }\\n       for l in asg.stack_iter().rev() {\\n           if seen[l.vi()] != key { continue; }\\n           if lits.contains(l) {\\n               res.push(!*l);\\n-              continue;\\n           } else if lits.contains(&!*l) {\\n               res.push(*l);\\n-              continue;\\n           }\\n           for r in asg.reason_literals(cdb, *l).iter() { seen[r.vi()] = key; }\\n       }\\n       res\\n  }\\n```\\n\\n**2020-08-23: これでバグが取れた！**\\n\\n# 最終版\\n\\n```rust\\npub fn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) -> MaybeInconsistent {\\n    while let Some(ci) = clauses.pop() {\\n        let c: &mut Clause = &mut cdb[ci];\\n        let clits = c.lits.clone();\\n        let mut copied: Vec<Lit> = Vec::new();\\n        let mut flipped = true;\\n        \'this_clause: for l in clits.iter() {\\n            match asg.assigned(*l) {\\n                Some(false) => continue \'this_clause, // Rule 1\\n                Some(true) => {\\n                    // This path is optimized for the case the decision level is zero.\\n                    copied.clear();\\n                    flipped = false;\\n                    break \'this_clause;\\n                }\\n                None => {\\n                    let cid: Option<ClauseId> = match copied.len() {\\n                        0 => None,\\n                        1 => {\\n                            asg.assign_by_decision(copied[0]);\\n                            None\\n                        }\\n                        _ => Some(cdb.new_clause(asg, &mut copied.clone(), true, false)),\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    let cc = asg.propagate(cdb);\\n                    if !cc.is_none() {\\n                        copied.push(!*l);\\n                        let r = cdb[cc].lits.clone(); // Rule 3\\n                        copied = asg.analyze(cdb, &copied, &r, &mut seen);\\n                        if !copied.is_empty() { flipped = false; }\\n                    }\\n                    asg.cancel_until(asg.root_level);\\n                    if let Some(cj) = cid { cdb.detach(cj); }\\n                    if !cc.is_none() { break \'this_clause; }\\n                    copied.push(!*l); // Rule 4\\n                }\\n            }\\n        }\\n        if flipped { flip(&mut copied); }\\n        match copied.len() {\\n            0 if flipped => return Err(SolverError::Inconsistent),\\n            0 => cdb.detach(ci),\\n            1 => {\\n                let l0 = copied[0];\\n                cdb.certificate_add(&copied);\\n                if asg.assigned(l0) == None {\\n                    asg.assign_at_rootlevel(l0)?;\\n                    if !asg.propagate(cdb).is_none() {\\n                        return Err(SolverError::Inconsistent);\\n                    }\\n                }\\n                cdb.detach(ci);\\n            }\\n            n if n == clits.len() => (),\\n            n => {\\n                cdb.new_clause(asg, &mut copied);\\n                cdb.detach(ci);\\n            }\\n        }\\n        clauses.retain(|ci| !cdb[ci].is(Flag::DEAD));\\n    }\\n    Ok(())\\n}\\n```","bodyHtml":"<p><strong>cover image: https://unsplash.com/photos/-IMlv9Jlb24</strong></p>\\n<p>Version 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。\\nSAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。\\nvivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。</p>\\n<h2>1. gratgenのこういうメッセージがどうやっても解消できない</h2>\\n<pre><code class=\\"hljs\\">c Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)</code></pre><p>うーん、そんなはずはないのだが。。。</p>\\n<p>理由：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。</p>\\n<h2>2. なぜかAssignStack中に未割り当てリテラルが出現する</h2>\\n<p>理由：変数への仮割り当ての前提条件の検査が不十分だった。</p>\\n<h2>3. 2020-08-21 記号の読み間違え判明</h2>\\n<p><a href=\\"/2020/2020-07-05-vivification2/\\">Clause Vivification updated 2020</a>に記載の通り。</p>\\n<h2>4. vivify中に決定による割り当てを行っただけでcertificateが不当なものになってしまう</h2>\\n<p>理由：Eliminatorがバグってた！</p>\\n<h2>5. Eliminatorを直しても以下省略</h2>\\n<p>理由：<code>cdb.detach(); cdb.garbage_collect();</code> が非常に怪しい。</p>\\n<h2>6. <code>propagate</code>しなくてもおかしくなる</h2>\\n<p>理由：節の追加削除しか原因はない。</p>\\n<h2>7. Rule. 3の解釈が怪しい</h2>\\n<blockquote>\\n<p><strong>Rule_3</strong>: If $\\\\text{UP}(\\\\phi \\\\cup {\\\\neg l_1, \\\\ldots, \\\\neg l_i }) = \\\\Box$, then $\\\\phi \\\\cup {\\\\neg l_1, \\\\ldots, \\\\neg l_i }$ is unsatisfiable and clause $l_1 \\\\vee \\\\cdots \\\\vee l_i$ is a logical consequence of $\\\\phi$ and could replace $C$. However, as before, let $R$ be the set of literals of the falsified clause, $conflAnalysis(\\\\phi, \\\\neg C\' \\\\cup {\\\\neg l_i }, R)$, which is a sub-clause of $l_1 \\\\vee \\\\cdots \\\\vee l_i$ .</p>\\n</blockquote>\\n<p>そもそも<code>conflict_analysis</code>の引数の解釈は大丈夫だろうか。なぜ3引数なのか。ということで論文より引用し直し。</p>\\n<p><img src=\\"/img/2020/08-19/Algorithm4_conflAnalysis.jpg\\" alt=\\"\\"></p>\\n<p><img src=\\"/img/2020/07-05/vivi-algo3.jpg\\" alt=\\"\\"></p>\\n<p>大丈夫なようだ。矛盾しているリテラルを拾うためにリテラルベースではなく、変数ベースでアクセスしている。\\n特に問題はない。例えば節長が1の学習節をcertificateに含めても問題は発生しない。</p>\\n<h2>8. しかし生成された節を certificate に含めると証明にならない</h2>\\n<p>理由：<strong>Algorithm 4</strong>は間違い。もし最上位レベルでの含意によって割り当てられるリテラルだけからなる節によって矛盾が発生したとする。この場合<strong>Algorithm 4</strong>では決定変数が学習節に含まれない。なので<strong>Algorithm 4</strong>は以下であるべき。</p>\\n<pre><code class=\\"hljs\\">fn analyze(asg: &amp;AssignStack, cdb: &amp;ClauseDB, lits: &amp;[Lit], reason: &amp;[Lit], ...) -&gt; Vec&lt;Lit&gt; {\\n       let mut res: Vec&lt;Lit&gt; = Vec::new();\\n       for l in reason { seen[l.vi()] = key; }\\n       for l in asg.stack_iter().rev() {\\n           if seen[l.vi()] != key { continue; }\\n           if lits.contains(l) {\\n               res.push(!*l);\\n<span class=\\"hljs-deletion\\">-              continue;</span>\\n           } else if lits.contains(&amp;!*l) {\\n               res.push(*l);\\n<span class=\\"hljs-deletion\\">-              continue;</span>\\n           }\\n           for r in asg.reason_literals(cdb, *l).iter() { seen[r.vi()] = key; }\\n       }\\n       res\\n  }</code></pre><p><strong>2020-08-23: これでバグが取れた！</strong></p>\\n<h1>最終版</h1>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">pub</span> <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">vivify</span></span>(asg: &amp;<span class=\\"hljs-keyword\\">mut</span> AssignStack, cdb: &amp;<span class=\\"hljs-keyword\\">mut</span> ClauseDB) -&gt; MaybeInconsistent {\\n    <span class=\\"hljs-keyword\\">while</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ci) = clauses.pop() {\\n        <span class=\\"hljs-keyword\\">let</span> c: &amp;<span class=\\"hljs-keyword\\">mut</span> Clause = &amp;<span class=\\"hljs-keyword\\">mut</span> cdb[ci];\\n        <span class=\\"hljs-keyword\\">let</span> clits = c.lits.clone();\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> copied: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> flipped = <span class=\\"hljs-literal\\">true</span>;\\n        <span class=\\"hljs-symbol\\">\'this_clause</span>: <span class=\\"hljs-keyword\\">for</span> l <span class=\\"hljs-keyword\\">in</span> clits.iter() {\\n            <span class=\\"hljs-keyword\\">match</span> asg.assigned(*l) {\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">false</span>) =&gt; <span class=\\"hljs-keyword\\">continue</span> <span class=\\"hljs-symbol\\">\'this_clause</span>, <span class=\\"hljs-comment\\">// Rule 1</span>\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">true</span>) =&gt; {\\n                    <span class=\\"hljs-comment\\">// This path is optimized for the case the decision level is zero.</span>\\n                    copied.clear();\\n                    flipped = <span class=\\"hljs-literal\\">false</span>;\\n                    <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'this_clause</span>;\\n                }\\n                <span class=\\"hljs-literal\\">None</span> =&gt; {\\n                    <span class=\\"hljs-keyword\\">let</span> cid: <span class=\\"hljs-built_in\\">Option</span>&lt;ClauseId&gt; = <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n                        <span class=\\"hljs-number\\">0</span> =&gt; <span class=\\"hljs-literal\\">None</span>,\\n                        <span class=\\"hljs-number\\">1</span> =&gt; {\\n                            asg.assign_by_decision(copied[<span class=\\"hljs-number\\">0</span>]);\\n                            <span class=\\"hljs-literal\\">None</span>\\n                        }\\n                        _ =&gt; <span class=\\"hljs-literal\\">Some</span>(cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied.clone(), <span class=\\"hljs-literal\\">true</span>, <span class=\\"hljs-literal\\">false</span>)),\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    <span class=\\"hljs-keyword\\">let</span> cc = asg.propagate(cdb);\\n                    <span class=\\"hljs-keyword\\">if</span> !cc.is_none() {\\n                        copied.push(!*l);\\n                        <span class=\\"hljs-keyword\\">let</span> r = cdb[cc].lits.clone(); <span class=\\"hljs-comment\\">// Rule 3</span>\\n                        copied = asg.analyze(cdb, &amp;copied, &amp;r, &amp;<span class=\\"hljs-keyword\\">mut</span> seen);\\n                        <span class=\\"hljs-keyword\\">if</span> !copied.is_empty() { flipped = <span class=\\"hljs-literal\\">false</span>; }\\n                    }\\n                    asg.cancel_until(asg.root_level);\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(cj) = cid { cdb.detach(cj); }\\n                    <span class=\\"hljs-keyword\\">if</span> !cc.is_none() { <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'this_clause</span>; }\\n                    copied.push(!*l); <span class=\\"hljs-comment\\">// Rule 4</span>\\n                }\\n            }\\n        }\\n        <span class=\\"hljs-keyword\\">if</span> flipped { flip(&amp;<span class=\\"hljs-keyword\\">mut</span> copied); }\\n        <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n            <span class=\\"hljs-number\\">0</span> <span class=\\"hljs-keyword\\">if</span> flipped =&gt; <span class=\\"hljs-keyword\\">return</span> <span class=\\"hljs-literal\\">Err</span>(SolverError::Inconsistent),\\n            <span class=\\"hljs-number\\">0</span> =&gt; cdb.detach(ci),\\n            <span class=\\"hljs-number\\">1</span> =&gt; {\\n                <span class=\\"hljs-keyword\\">let</span> l0 = copied[<span class=\\"hljs-number\\">0</span>];\\n                cdb.certificate_add(&amp;copied);\\n                <span class=\\"hljs-keyword\\">if</span> asg.assigned(l0) == <span class=\\"hljs-literal\\">None</span> {\\n                    asg.assign_at_rootlevel(l0)?;\\n                    <span class=\\"hljs-keyword\\">if</span> !asg.propagate(cdb).is_none() {\\n                        <span class=\\"hljs-keyword\\">return</span> <span class=\\"hljs-literal\\">Err</span>(SolverError::Inconsistent);\\n                    }\\n                }\\n                cdb.detach(ci);\\n            }\\n            n <span class=\\"hljs-keyword\\">if</span> n == clits.len() =&gt; (),\\n            n =&gt; {\\n                cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied);\\n                cdb.detach(ci);\\n            }\\n        }\\n        clauses.retain(|ci| !cdb[ci].is(Flag::DEAD));\\n    }\\n    <span class=\\"hljs-literal\\">Ok</span>(())\\n}</code></pre>","dir":"article/.json/2020","base":"2020-08-19-splr-with-vivification.json","ext":".json","sourceBase":"2020-08-19-splr-with-vivification.md","sourceExt":".md"}')}}]);