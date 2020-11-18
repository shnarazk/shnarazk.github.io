(window.webpackJsonp=window.webpackJsonp||[]).push([[38],{523:function(n){n.exports=JSON.parse('{"title":"Running Glucose in benchmark mode","subtitle":"Glucoseのベンチマークがしたい","date":"2019-03-04T00:00:00.000Z","tags":["glucose","SAT"],"bodyContent":"Using my [patched](https://gitlab.com/satisfiability01/glucose/tree/v.4.1) glucose, we can get more useful result.\\n\\n```\\nglucose -cpu-lim=TIMEOUT -verb=0 a.cnf result.file\\n```\\n\\n- `-cpu-lim=TIMEOUT` ; you can\'t insert whitespaces.\\n- no progress report if `verb`== 0.\\n\\nNow the result file contains the stats information.\\n\\n```\\nc restarts              : 2 (2201 conflicts in avg)\\nc blocked restarts      : 0 (multiple: 0) \\nc last block at restart : 0\\nc nb ReduceDB           : 1\\nc nb removed Clauses    : 994\\nc nb learnts DL2        : 22\\nc nb learnts size 2     : 0\\nc nb learnts size 1     : 0\\nc conflicts             : 4403           (83932 /sec)\\nc decisions             : 5285           (0.00 % random) (100745 /sec)\\nc propagations          : 184690         (3520654 /sec)\\nc nb reduced Clauses    : 0\\nc CPU time              : 0.052459 s\\n-1 2 -3 -4 5 -6 -7 ...\\n```\\n\\nNice!\\n\\n### remaining parts\\n\\nLet\'s run on the benchmark suit.\\n\\n```\\nparallel -j1 \\"glucose -cpu-lim=5000 -verb=0 {} .ans_{/}\\" ::: SAT-COMPETITION/*.cnf\\n```\\n\\nThen gather the results into a csv.\\n\\n```rust\\nfn main() { ...\\n    for e in fs::read_dir(...)? {\\n        let f = e?;\\n        if f.file_name().to_string_lossy().starts_with(\\".ans_\\") {\\n            if let Some(t) = read_time(...) {\\n                hash.insert(f, t);\\n                break;\\n            }\\n         }\\n    }\\n    ...\\n}\\n\\nfn read_time(input: ... ) -> Option<f64> {\\n    let re = Regex::new(r\\"c CPU time +: ([.0-9]+)\\").expect(\\"wrong regex\\");\\n    let mut buf = String::new();\\n    while let Ok(k) = input.read_line(&mut buf) {\\n        if k == 0 {\\n            break;\\n        }\\n        if let Some(c) = re.captures(&buf) {\\n            if let Ok(v) = c[1].parse::<f64>() {\\n                return Some(v)\\n            }\\n        }\\n        buf.clear();\\n    }\\n    None\\n}\\n```","bodyHtml":"<p>Using my <a href=\\"https://gitlab.com/satisfiability01/glucose/tree/v.4.1\\">patched</a> glucose, we can get more useful result.</p>\\n<pre><code>glucose -cpu-lim=TIMEOUT -verb=0 a.cnf result.file\\n</code></pre>\\n<ul>\\n<li><code>-cpu-lim=TIMEOUT</code> ; you can\'t insert whitespaces.</li>\\n<li>no progress report if <code>verb</code>== 0.</li>\\n</ul>\\n<p>Now the result file contains the stats information.</p>\\n<pre><code>c restarts              : 2 (2201 conflicts in avg)\\nc blocked restarts      : 0 (multiple: 0) \\nc last block at restart : 0\\nc nb ReduceDB           : 1\\nc nb removed Clauses    : 994\\nc nb learnts DL2        : 22\\nc nb learnts size 2     : 0\\nc nb learnts size 1     : 0\\nc conflicts             : 4403           (83932 /sec)\\nc decisions             : 5285           (0.00 % random) (100745 /sec)\\nc propagations          : 184690         (3520654 /sec)\\nc nb reduced Clauses    : 0\\nc CPU time              : 0.052459 s\\n-1 2 -3 -4 5 -6 -7 ...\\n</code></pre>\\n<p>Nice!</p>\\n<h3>remaining parts</h3>\\n<p>Let\'s run on the benchmark suit.</p>\\n<pre><code>parallel -j1 &quot;glucose -cpu-lim=5000 -verb=0 {} .ans_{/}&quot; ::: SAT-COMPETITION/*.cnf\\n</code></pre>\\n<p>Then gather the results into a csv.</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">main</span></span>() { ...\\n    <span class=\\"hljs-keyword\\">for</span> e <span class=\\"hljs-keyword\\">in</span> fs::read_dir(...)? {\\n        <span class=\\"hljs-keyword\\">let</span> f = e?;\\n        <span class=\\"hljs-keyword\\">if</span> f.file_name().to_string_lossy().starts_with(<span class=\\"hljs-string\\">\\".ans_\\"</span>) {\\n            <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(t) = read_time(...) {\\n                hash.insert(f, t);\\n                <span class=\\"hljs-keyword\\">break</span>;\\n            }\\n         }\\n    }\\n    ...\\n}\\n\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">read_time</span></span>(input: ... ) -&gt; <span class=\\"hljs-built_in\\">Option</span>&lt;<span class=\\"hljs-built_in\\">f64</span>&gt; {\\n    <span class=\\"hljs-keyword\\">let</span> re = Regex::new(<span class=\\"hljs-string\\">r\\"c CPU time +: ([.0-9]+)\\"</span>).expect(<span class=\\"hljs-string\\">\\"wrong regex\\"</span>);\\n    <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> buf = <span class=\\"hljs-built_in\\">String</span>::new();\\n    <span class=\\"hljs-keyword\\">while</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Ok</span>(k) = input.read_line(&amp;<span class=\\"hljs-keyword\\">mut</span> buf) {\\n        <span class=\\"hljs-keyword\\">if</span> k == <span class=\\"hljs-number\\">0</span> {\\n            <span class=\\"hljs-keyword\\">break</span>;\\n        }\\n        <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Some</span>(c) = re.captures(&amp;buf) {\\n            <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-literal\\">Ok</span>(v) = c[<span class=\\"hljs-number\\">1</span>].parse::&lt;<span class=\\"hljs-built_in\\">f64</span>&gt;() {\\n                <span class=\\"hljs-keyword\\">return</span> <span class=\\"hljs-literal\\">Some</span>(v)\\n            }\\n        }\\n        buf.clear();\\n    }\\n    <span class=\\"hljs-literal\\">None</span>\\n}</code></pre>","dir":"article/.json/2019","base":"2019-03-04-benchmarking-glucose.json","ext":".json","sourceBase":"2019-03-04-benchmarking-glucose.md","sourceExt":".md"}')}}]);