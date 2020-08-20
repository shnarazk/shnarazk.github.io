(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{573:function(n){n.exports=JSON.parse('{"title":"Implementing vivification on Splr","subtitle":"vivification part 3","date":"2020-08-21T00:00:00.000Z","tags":["SAT","vivification","splr"],"banner":"https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80","bodyContent":"**cover image: https://unsplash.com/photos/-IMlv9Jlb24**\\n\\nVersion 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。\\nSAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。\\nvivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。\\n\\n## 1. gratgenのこういうメッセージがどうやっても解消できない\\n\\n```text\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\n```\\n\\nうーん、そんなはずはないのだが。。。\\n\\n答え：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。\\n\\n## 2. なぜかAssignStack中に未割り当てリテラルが出現する\\n\\n答え：変数への仮割り当ての前提条件の検査が不十分だった。\\n\\n## 2020-08-21 記号の読み間違え判明\\n\\n```rust\\npub fn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) -> MaybeInconsistent {\\n    while let Some(ci) = clauses.pop() {\\n        let c: &mut Clause = &mut cdb[ci];\\n        let clits = c.lits.clone();\\n        let mut copied: Vec<Lit> = Vec::new();\\n        let mut flipped = true;\\n        \'this_clause: for l in clits.iter() {\\n            match asg.assigned(*l) {\\n                Some(false) => continue \'this_clause, // Rule 1\\n                Some(true) => {\\n                    copied.push(!*l);\\n                    let r = asg.reason_literals(cdb, *l);\\n                    let mut v = Vec::new();\\n                    for lit in &*r {\\n                        if *lit == *l { v.push(!*lit); } else { v.push(*lit); }\\n                    }\\n                    copied = asg.minimize(cdb, &copied, &v); // Rule 2\\n                    flipped = false;\\n                    break \'this_clause;\\n                }\\n                None => {\\n                    asg.cancel_until(asg.root_level);\\n                    let cid: Option<ClauseId> = match copied.len() {\\n                        0 => None,\\n                        1 => {\\n                            asg.assign_by_decision(copied[0]);\\n                            None\\n                        }\\n                        _ => Some(cdb.new_clause(asg, &mut copied.clone(), true, false)),\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    let cc = asg.propagate(cdb);\\n                    if !cc.is_none() {\\n                        let r = cdb[cc].lits.clone(); // Rule 3\\n                        copied = asg.minimize(cdb, &copied, &r);\\n                        flipped = false;\\n                    }\\n                    asg.cancel_until(asg.root_level);\\n                    if let Some(cj) = cid { cdb.detach(cj); }\\n                    if !cc.is_none() { break \'this_clause; }\\n                    copied.push(!*l); // Rule 4\\n                }\\n            }\\n        }\\n        if flipped { flip(&mut copied); }\\n        match copied.len() {\\n            0 if flipped => return Err(SolverError::Inconsistent),\\n            0 => cdb.detach(ci),\\n            1 => {\\n                let l0 = copied[0];\\n                cdb.certificate_add(&copied);\\n                if asg.assigned(l0) == None {\\n                    asg.assign_at_rootlevel(l0)?;\\n                    if !asg.propagate(cdb).is_none() {\\n                        return Err(SolverError::Inconsistent);\\n                    }\\n                }\\n                cdb.detach(ci);\\n            }\\n            n if n == clits.len() => (),\\n            n => {\\n                cdb.new_clause(asg, &mut copied);\\n                cdb.detach(ci);\\n            }\\n        }\\n        clauses.retain(|ci| !cdb[ci].is(Flag::DEAD));\\n    }\\n    Ok(())\\n}\\n```","bodyHtml":"<p><strong>cover image: https://unsplash.com/photos/-IMlv9Jlb24</strong></p>\\n<p>Version 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。\\nSAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。\\nvivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。</p>\\n<h2>1. gratgenのこういうメッセージがどうやっても解消できない</h2>\\n<pre><code class=\\"hljs\\">c Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)</code></pre><p>うーん、そんなはずはないのだが。。。</p>\\n<p>答え：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。</p>\\n<h2>2. なぜかAssignStack中に未割り当てリテラルが出現する</h2>\\n<p>答え：変数への仮割り当ての前提条件の検査が不十分だった。</p>\\n<h2>2020-08-21 記号の読み間違え判明</h2>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">pub</span> <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">vivify</span></span>(asg: &amp;<span class=\\"hljs-keyword\\">mut</span> AssignStack, cdb: &amp;<span class=\\"hljs-keyword\\">mut</span> ClauseDB) -&gt; MaybeInconsistent {\\n    <span class=\\"hljs-keyword\\">while</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(ci) = clauses.pop() {\\n        <span class=\\"hljs-keyword\\">let</span> c: &amp;<span class=\\"hljs-keyword\\">mut</span> Clause = &amp;<span class=\\"hljs-keyword\\">mut</span> cdb[ci];\\n        <span class=\\"hljs-keyword\\">let</span> clits = c.lits.clone();\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> copied: <span class=\\"hljs-built_in\\">Vec</span>&lt;Lit&gt; = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n        <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> flipped = <span class=\\"hljs-literal\\">true</span>;\\n        <span class=\\"hljs-symbol\\">\'this_clause</span>: <span class=\\"hljs-keyword\\">for</span> l <span class=\\"hljs-keyword\\">in</span> clits.iter() {\\n            <span class=\\"hljs-keyword\\">match</span> asg.assigned(*l) {\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">false</span>) =&gt; <span class=\\"hljs-keyword\\">continue</span> <span class=\\"hljs-symbol\\">\'this_clause</span>, <span class=\\"hljs-comment\\">// Rule 1</span>\\n                <span class=\\"hljs-literal\\">Some</span>(<span class=\\"hljs-literal\\">true</span>) =&gt; {\\n                    copied.push(!*l);\\n                    <span class=\\"hljs-keyword\\">let</span> r = asg.reason_literals(cdb, *l);\\n                    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> v = <span class=\\"hljs-built_in\\">Vec</span>::new();\\n                    <span class=\\"hljs-keyword\\">for</span> lit <span class=\\"hljs-keyword\\">in</span> &amp;*r {\\n                        <span class=\\"hljs-keyword\\">if</span> *lit == *l { v.push(!*lit); } <span class=\\"hljs-keyword\\">else</span> { v.push(*lit); }\\n                    }\\n                    copied = asg.minimize(cdb, &amp;copied, &amp;v); <span class=\\"hljs-comment\\">// Rule 2</span>\\n                    flipped = <span class=\\"hljs-literal\\">false</span>;\\n                    <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'this_clause</span>;\\n                }\\n                <span class=\\"hljs-literal\\">None</span> =&gt; {\\n                    asg.cancel_until(asg.root_level);\\n                    <span class=\\"hljs-keyword\\">let</span> cid: <span class=\\"hljs-built_in\\">Option</span>&lt;ClauseId&gt; = <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n                        <span class=\\"hljs-number\\">0</span> =&gt; <span class=\\"hljs-literal\\">None</span>,\\n                        <span class=\\"hljs-number\\">1</span> =&gt; {\\n                            asg.assign_by_decision(copied[<span class=\\"hljs-number\\">0</span>]);\\n                            <span class=\\"hljs-literal\\">None</span>\\n                        }\\n                        _ =&gt; <span class=\\"hljs-literal\\">Some</span>(cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied.clone(), <span class=\\"hljs-literal\\">true</span>, <span class=\\"hljs-literal\\">false</span>)),\\n                    };\\n                    asg.assign_by_decision(!*l);\\n                    <span class=\\"hljs-keyword\\">let</span> cc = asg.propagate(cdb);\\n                    <span class=\\"hljs-keyword\\">if</span> !cc.is_none() {\\n                        <span class=\\"hljs-keyword\\">let</span> r = cdb[cc].lits.clone(); <span class=\\"hljs-comment\\">// Rule 3</span>\\n                        copied = asg.minimize(cdb, &amp;copied, &amp;r);\\n                        flipped = <span class=\\"hljs-literal\\">false</span>;\\n                    }\\n                    asg.cancel_until(asg.root_level);\\n                    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(cj) = cid { cdb.detach(cj); }\\n                    <span class=\\"hljs-keyword\\">if</span> !cc.is_none() { <span class=\\"hljs-keyword\\">break</span> <span class=\\"hljs-symbol\\">\'this_clause</span>; }\\n                    copied.push(!*l); <span class=\\"hljs-comment\\">// Rule 4</span>\\n                }\\n            }\\n        }\\n        <span class=\\"hljs-keyword\\">if</span> flipped { flip(&amp;<span class=\\"hljs-keyword\\">mut</span> copied); }\\n        <span class=\\"hljs-keyword\\">match</span> copied.len() {\\n            <span class=\\"hljs-number\\">0</span> <span class=\\"hljs-keyword\\">if</span> flipped =&gt; <span class=\\"hljs-keyword\\">return</span> <span class=\\"hljs-literal\\">Err</span>(SolverError::Inconsistent),\\n            <span class=\\"hljs-number\\">0</span> =&gt; cdb.detach(ci),\\n            <span class=\\"hljs-number\\">1</span> =&gt; {\\n                <span class=\\"hljs-keyword\\">let</span> l0 = copied[<span class=\\"hljs-number\\">0</span>];\\n                cdb.certificate_add(&amp;copied);\\n                <span class=\\"hljs-keyword\\">if</span> asg.assigned(l0) == <span class=\\"hljs-literal\\">None</span> {\\n                    asg.assign_at_rootlevel(l0)?;\\n                    <span class=\\"hljs-keyword\\">if</span> !asg.propagate(cdb).is_none() {\\n                        <span class=\\"hljs-keyword\\">return</span> <span class=\\"hljs-literal\\">Err</span>(SolverError::Inconsistent);\\n                    }\\n                }\\n                cdb.detach(ci);\\n            }\\n            n <span class=\\"hljs-keyword\\">if</span> n == clits.len() =&gt; (),\\n            n =&gt; {\\n                cdb.new_clause(asg, &amp;<span class=\\"hljs-keyword\\">mut</span> copied);\\n                cdb.detach(ci);\\n            }\\n        }\\n        clauses.retain(|ci| !cdb[ci].is(Flag::DEAD));\\n    }\\n    <span class=\\"hljs-literal\\">Ok</span>(())\\n}</code></pre>","dir":"article/.json/2020","base":"2020-08-19-splr-with-vivification.json","ext":".json","sourceBase":"2020-08-19-splr-with-vivification.md","sourceExt":".md"}')}}]);