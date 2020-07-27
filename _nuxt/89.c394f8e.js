(window.webpackJsonp=window.webpackJsonp||[]).push([[89],{562:function(n){n.exports=JSON.parse('{"title":"まとめて借用","subtitle":"in Rust","date":"2020-07-27T00:00:00.000Z","tags":["Rust"],"bodyContent":"オブジェクトからフィールドを借用したい。\\n借用したいオブジェクトの型がいくつもあり、型ごとに借用したい個数が違うので、できるだけgenericなtrait化が望ましい。\\nよくわかってないとこの程度のことでもつまづいてしまうのでメモしておく。\\n\\n### Box\\n\\n困った時は一旦スタックに持っていく、そのために `Box` を使う、という定石を使ってみるとこうなる。\\n\\n```rust\\npub trait Export<\'a, T> {\\n    fn exports(&\'a self) -> Box<T>;\\n}\\n\\nimpl<\'a> Export<\'a, (&\'a Ema2, &\'a Ema2, &\'a Ema2, &\'a Ema2)> for Restarter {\\n    fn exports(&\'a self) -> Box<(&\'a Ema2, &\'a Ema2, &\'a Ema2, &\'a Ema2)> {\\n        Box::from((&self.asg.ema, &self.lbd.ema, &self.mld.ema, &self.mva.ema))\\n    }\\n}\\n```\\n\\n問題なくコンパイルできる。\\n\\n### タプル\\n\\nタプルに置き換えても問題ない。\\n\\n```rust\\npub trait Export<\'a, T> {\\n    fn exports(&\'a self) -> T;\\n}\\n\\nimpl<\'a> Export<\'a, (&\'a Ema2, &\'a Ema2, &\'a Ema2, &\'a Ema2)> for Restarter {\\n    fn exports(&\'a self) -> (&\'a Ema2, &\'a Ema2, &\'a Ema2, &\'a Ema2) {\\n\\t    (&self.asg.ema, &self.lbd.ema, &self.mld.ema, &self.mva.ema)\\n    }\\n}\\n```\\n\\n### CoW\\n\\nさらに一般化して定数データもコピーなしで返すためにCoWでくるんでも全然問題ない。\\n\\n```rust\\nuse std::borrow::Cow;\\n\\ntrait Export<\'a> {\\n    fn export(&\'a self) -> (Cow<\'a, &Ema2>, Cow<\'a, &Ema2>);\\n}\\n\\nimpl<\'a> Export<\'a> for Restarter {\\n    fn export(&\'a self) -> (Cow<\'a, &Ema2>, Cow<\'a, &Ema2>) {\\n        (Cow::Owned(&self.asg.ema), Cow::Owned(&self.lbd.ema))\\n    }\\n}\\n```\\n\\nただし、これは2要素タプルに特定してしまっている。\\n\\n一般化した問題に戻して、\\n\\n```rust\\ntrait Export<\'a, T> {\\n    fn export(&\'a self) -> T;\\n}\\n```\\n\\nとするなら、\\n\\n```rust\\nimpl<\'a> Export<\'a, (Cow<\'a, &\'a Ema2>, Cow<\'a, &\'a Ema2>)> for Restarter {\\n    fn export(&\'a self) -> (Cow<\'a, &\'a Ema2>, Cow<\'a, &\'a Ema2>) {\\n        (Cow::Owned(&self.asg.ema), Cow::Owned(&self.lbd.ema))\\n    }\\n}\\n```\\n\\nとすればいい。どれも全く同じことだった。\\nなお、これを\\n\\n```rust\\nimpl<\'a> Export<\'a, (Cow<\'a, &Ema2>, Cow<\'a, &Ema2>)> for Restarter\\n```\\n\\nなどとして、ライフタイム制約が不十分なものに（うっかり）してしまうと、\\n\\n```\\nerror[E0308]: method not compatible with trait\\n   --\x3e src/solver/restart.rs:833:5\\n    |\\n833 |     fn export(&\'a self) -> (Cow<\'a, &\'a Ema2>, Cow<\'a, &\'a Ema2>) {\\n    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ lifetime mismatch\\n    |\\n    = note: expected fn pointer `fn(&\'a solver::restart::Restarter) -> (std::borrow::Cow<\'_, &types::Ema2>, std::borrow::Cow<\'_, _>)`\\n               found fn pointer `fn(&\'a solver::restart::Restarter) -> (std::borrow::Cow<\'_, &\'a types::Ema2>, std::borrow::Cow<\'_, _>)`\\n```\\n\\nだとか、\\n\\n```\\nerror[E0308]: method not compatible with trait\\n   --\x3e src/solver/restart.rs:833:5\\n    |\\n833 |     fn export(&\'a self) -> (Cow<\'a, &Ema2>, Cow<\'a, &Ema2>) {\\n    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ lifetime mismatch\\n    |\\n    = note: expected fn pointer `fn(&\'a solver::restart::Restarter) -> (std::borrow::Cow<\'_, &types::Ema2>, std::borrow::Cow<\'_, &types::Ema2>)`\\n               found fn pointer `fn(&\'a solver::restart::Restarter) -> (std::borrow::Cow<\'_, &\'a types::Ema2>, std::borrow::Cow<\'_, &\'a types::Ema2>)`\\nnote: the lifetime `\'_` as defined on the impl at 832:33...\\n```\\n\\nと言われてしまうが、まあそりゃ当たり前のことである。\\n\\n以下は単なる文法間違いがもたらしたエラー。\\n\\n```\\nerror: lifetime in trait object type must be followed by `+`\\n  --\x3e src/types.rs:32:38\\n   |\\n32 |     fn exports(&\'a self) -> (CoW(\'a, Ema), CoW(\'a, Ema));\\n   |                                  ^^\\n```\\n\\nちゃんとライフタイム制約まで目を配りましょうというだけのことでした。","bodyHtml":"<p>オブジェクトからフィールドを借用したい。\\n借用したいオブジェクトの型がいくつもあり、型ごとに借用したい個数が違うので、できるだけgenericなtrait化が望ましい。\\nよくわかってないとこの程度のことでもつまづいてしまうのでメモしておく。</p>\\n<h3>Box</h3>\\n<p>困った時は一旦スタックに持っていく、そのために <code>Box</code> を使う、という定石を使ってみるとこうなる。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">pub</span> <span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">trait</span> <span class=\\"hljs-title\\">Export</span></span>&lt;<span class=\\"hljs-symbol\\">\'a</span>, T&gt; {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">exports</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; <span class=\\"hljs-built_in\\">Box</span>&lt;T&gt;;\\n}\\n\\n<span class=\\"hljs-keyword\\">impl</span>&lt;<span class=\\"hljs-symbol\\">\'a</span>&gt; Export&lt;<span class=\\"hljs-symbol\\">\'a</span>, (&amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2)&gt; <span class=\\"hljs-keyword\\">for</span> Restarter {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">exports</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; <span class=\\"hljs-built_in\\">Box</span>&lt;(&amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2)&gt; {\\n        <span class=\\"hljs-built_in\\">Box</span>::from((&amp;<span class=\\"hljs-keyword\\">self</span>.asg.ema, &amp;<span class=\\"hljs-keyword\\">self</span>.lbd.ema, &amp;<span class=\\"hljs-keyword\\">self</span>.mld.ema, &amp;<span class=\\"hljs-keyword\\">self</span>.mva.ema))\\n    }\\n}</code></pre><p>問題なくコンパイルできる。</p>\\n<h3>タプル</h3>\\n<p>タプルに置き換えても問題ない。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">pub</span> <span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">trait</span> <span class=\\"hljs-title\\">Export</span></span>&lt;<span class=\\"hljs-symbol\\">\'a</span>, T&gt; {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">exports</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; T;\\n}\\n\\n<span class=\\"hljs-keyword\\">impl</span>&lt;<span class=\\"hljs-symbol\\">\'a</span>&gt; Export&lt;<span class=\\"hljs-symbol\\">\'a</span>, (&amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2)&gt; <span class=\\"hljs-keyword\\">for</span> Restarter {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">exports</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; (&amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2) {\\n\\t    (&amp;<span class=\\"hljs-keyword\\">self</span>.asg.ema, &amp;<span class=\\"hljs-keyword\\">self</span>.lbd.ema, &amp;<span class=\\"hljs-keyword\\">self</span>.mld.ema, &amp;<span class=\\"hljs-keyword\\">self</span>.mva.ema)\\n    }\\n}</code></pre><h3>CoW</h3>\\n<p>さらに一般化して定数データもコピーなしで返すためにCoWでくるんでも全然問題ない。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">use</span> std::borrow::Cow;\\n\\n<span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">trait</span> <span class=\\"hljs-title\\">Export</span></span>&lt;<span class=\\"hljs-symbol\\">\'a</span>&gt; {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">export</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; (Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;Ema2&gt;, Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;Ema2&gt;);\\n}\\n\\n<span class=\\"hljs-keyword\\">impl</span>&lt;<span class=\\"hljs-symbol\\">\'a</span>&gt; Export&lt;<span class=\\"hljs-symbol\\">\'a</span>&gt; <span class=\\"hljs-keyword\\">for</span> Restarter {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">export</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; (Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;Ema2&gt;, Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;Ema2&gt;) {\\n        (Cow::Owned(&amp;<span class=\\"hljs-keyword\\">self</span>.asg.ema), Cow::Owned(&amp;<span class=\\"hljs-keyword\\">self</span>.lbd.ema))\\n    }\\n}</code></pre><p>ただし、これは2要素タプルに特定してしまっている。</p>\\n<p>一般化した問題に戻して、</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">trait</span> <span class=\\"hljs-title\\">Export</span></span>&lt;<span class=\\"hljs-symbol\\">\'a</span>, T&gt; {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">export</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; T;\\n}</code></pre><p>とするなら、</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">impl</span>&lt;<span class=\\"hljs-symbol\\">\'a</span>&gt; Export&lt;<span class=\\"hljs-symbol\\">\'a</span>, (Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2&gt;, Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2&gt;)&gt; <span class=\\"hljs-keyword\\">for</span> Restarter {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">export</span></span>(&amp;<span class=\\"hljs-symbol\\">\'a</span> <span class=\\"hljs-keyword\\">self</span>) -&gt; (Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2&gt;, Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;<span class=\\"hljs-symbol\\">\'a</span> Ema2&gt;) {\\n        (Cow::Owned(&amp;<span class=\\"hljs-keyword\\">self</span>.asg.ema), Cow::Owned(&amp;<span class=\\"hljs-keyword\\">self</span>.lbd.ema))\\n    }\\n}</code></pre><p>とすればいい。どれも全く同じことだった。\\nなお、これを</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">impl</span>&lt;<span class=\\"hljs-symbol\\">\'a</span>&gt; Export&lt;<span class=\\"hljs-symbol\\">\'a</span>, (Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;Ema2&gt;, Cow&lt;<span class=\\"hljs-symbol\\">\'a</span>, &amp;Ema2&gt;)&gt; <span class=\\"hljs-keyword\\">for</span> Restarter</code></pre><p>などとして、ライフタイム制約が不十分なものに（うっかり）してしまうと、</p>\\n<pre><code>error[E0308]: method not compatible with trait\\n   --&gt; src/solver/restart.rs:833:5\\n    |\\n833 |     fn export(&amp;\'a self) -&gt; (Cow&lt;\'a, &amp;\'a Ema2&gt;, Cow&lt;\'a, &amp;\'a Ema2&gt;) {\\n    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ lifetime mismatch\\n    |\\n    = note: expected fn pointer `fn(&amp;\'a solver::restart::Restarter) -&gt; (std::borrow::Cow&lt;\'_, &amp;types::Ema2&gt;, std::borrow::Cow&lt;\'_, _&gt;)`\\n               found fn pointer `fn(&amp;\'a solver::restart::Restarter) -&gt; (std::borrow::Cow&lt;\'_, &amp;\'a types::Ema2&gt;, std::borrow::Cow&lt;\'_, _&gt;)`\\n</code></pre>\\n<p>だとか、</p>\\n<pre><code>error[E0308]: method not compatible with trait\\n   --&gt; src/solver/restart.rs:833:5\\n    |\\n833 |     fn export(&amp;\'a self) -&gt; (Cow&lt;\'a, &amp;Ema2&gt;, Cow&lt;\'a, &amp;Ema2&gt;) {\\n    |     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ lifetime mismatch\\n    |\\n    = note: expected fn pointer `fn(&amp;\'a solver::restart::Restarter) -&gt; (std::borrow::Cow&lt;\'_, &amp;types::Ema2&gt;, std::borrow::Cow&lt;\'_, &amp;types::Ema2&gt;)`\\n               found fn pointer `fn(&amp;\'a solver::restart::Restarter) -&gt; (std::borrow::Cow&lt;\'_, &amp;\'a types::Ema2&gt;, std::borrow::Cow&lt;\'_, &amp;\'a types::Ema2&gt;)`\\nnote: the lifetime `\'_` as defined on the impl at 832:33...\\n</code></pre>\\n<p>と言われてしまうが、まあそりゃ当たり前のことである。</p>\\n<p>以下は単なる文法間違いがもたらしたエラー。</p>\\n<pre><code>error: lifetime in trait object type must be followed by `+`\\n  --&gt; src/types.rs:32:38\\n   |\\n32 |     fn exports(&amp;\'a self) -&gt; (CoW(\'a, Ema), CoW(\'a, Ema));\\n   |                                  ^^\\n</code></pre>\\n<p>ちゃんとライフタイム制約まで目を配りましょうというだけのことでした。</p>\\n","dir":"article/.json/2020","base":"2020-07-25-lifetime-of-trait-object-type.json","ext":".json","sourceBase":"2020-07-25-lifetime-of-trait-object-type.md","sourceExt":".md"}')}}]);