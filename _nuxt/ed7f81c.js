(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{584:function(n){n.exports=JSON.parse('{"title":"Rust製の「SATソルバーで25x25のナンプレが解けるだろうか」","subtitle":"頑張れSplr","date":"2020-08-19T00:00:00.000Z","tags":["splr","sudoku"],"bodyContent":"何の調べ物をしていたのか忘れましたが、偶然こんなものを見つけました。\\nhttp://labs.timedia.co.jp/2017/07/sat25x2520.html\\n\\n```text\\n+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n| .  .  .  .  .| .  9  . 19  .| .  . 10 11  .| .  .  .  .  .| .  .  .  .  .|\\n| .  4  . 22  .| .  .  .  .  .| .  .  .  .  .| .  . 12  .  .|20 15  1  .  .|\\n|16  1 20 15  .| .  .  .  .  .| .  .  .  .  .|14  .  4  . 22|12 25  .  .  .|\\n| .  .  .  .  .| .  7  2 11  .|23  . 19  8  .| .  .  . 13  .| .  .  .  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n|13  .  8  .  2| .  .  .  .  .| .  .  7 23  6| .  9  . 19 11| .  .  .  .  .|\\n| .  .  .  . 23| .  .  .  . 16| .  .  .  .  .| .  .  .  .  .| 1  .  .  .  .|\\n| 7  .  .  . 10| 3  .  .  .  .| .  .  9 19  .| . 13  . 23  .| .  .  .  5  .|\\n| .  .  .  .  .|15  .  .  . 22| .  .  .  .  .| .  .  .  .  .|25 20  .  .  .|\\n| .  .  .  .  .|12  . 14  1 25| .  .  .  .  .| .  .  3  .  .|16  4 15  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| . 19  9  .  .| .  . 13  7  .| .  .  .  5  .| .  .  . 23 10|\\n| . 22  . 25 17| .  .  .  .  .| .  .  .  .  .|12  . 20  .  .| .  .  .  .  .|\\n| . 20 12 16  .| .  .  .  .  .| .  .  .  . 14|15 22  1  . 25| .  .  .  .  .|\\n| . 15  .  .  .| . 11  .  .  .| .  .  .  .  .| .  . 16  .  .| .  .  .  9  .|\\n| .  .  .  1  .| . 10  . 23  .| .  .  .  . 18| .  .  .  .  .| .  .  .  .  8|\\n+--------------+--------------+--------------+--------------+--------------+\\n|10  .  .  .  8| . 13  .  5  .| .  .  .  .  .| . 19  . 11 23| .  .  .  6  .|\\n| .  .  . 17  7| .  .  .  .  .| .  .  .  .  1| .  .  .  .  .| 4 22  .  .  .|\\n| .  .  .  . 11| . 23  .  .  .| .  .  .  . 20| .  .  .  2  .|14  .  .  .  .|\\n|19  . 23  .  5| .  8  .  9  .| . 21  .  .  .| . 10  .  7  .| .  .  .  .  .|\\n| .  3  .  .  .| .  .  .  .  .|25  4  .  . 12| .  .  .  .  .|15  1 16  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| .  .  .  . 15| . 12  .  . 25| 1  . 22  .  .| 3  .  .  .  .|\\n|23  .  .  . 19| .  2  .  .  .| .  .  .  .  .| .  .  . 10  .| .  .  .  7 11|\\n| .  .  . 18  .| .  .  .  .  .| . 20  .  .  .| .  .  .  .  .| .  .  .  .  .|\\n| .  .  .  .  .| .  .  .  .  4|14 15  .  . 22| .  .  .  .  .| .  .  . 10  .|\\n|11  .  .  .  9| .  .  .  .  .| .  .  .  .  .| .  .  .  .  .| .  .  . 19  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n```\\n\\nこの問題をSATで解く（正確には、他の人に解いてもらう）という話です。\\n\\n> さて、制約充足問題というと、すぐに思いつくのがSATであろう。ということで調べると、SATでパズルを解く研究をしている神戸大学情報基盤センターが直ぐに見つかる。\\n\\n「SATでパズルを解く研究をしている」という表現はどうなのかと思わないでもないけどもそれは置いといて、田村先生によって[20秒で解かれてしまった](http://labs.timedia.co.jp/2017/07/sat25x2520-1.html)そうだ。\\n\\nさて、Splrだとどうだろうか。面白そうなのでやってみました。\\n\\n# sudokuの符号化\\n\\nsudokuのルールは以下の4つ。\\n\\n1. セルには一つの数を割り当てる（単一制約）\\n1. 行には全ての数をそれぞれ一回のみ割り当てる（行制約）\\n1. 列には全ての数をそれぞれ一回のみ割り当てる（列制約）\\n1. ブロックには全ての数をそれぞれ一回のみ割り当てる（ブロック制約）\\n\\n既に何度か符号化しているものの、以前作ったものがサイズ25に対応できてなかったことがわかったのでもう一度[What\'s Miracle Sudoku?](2020/2020-05-26-MiracleSudoku/)で導入した、第１象限限定の幾何構造体`Pos`、その上の状態保持構造体`Cell`をそのまま利用して作り直し。例えばこんな感じで簡単に書ける。\\n\\n```rust\\nfor i in 1..9 {\\n  for j in 1..9 {\\n     let p = Pos::at(i, j);\\n     for jj in j + 1..9; \\n         let q = Pos::at(i, jj);\\n         for d in 1..9 {\\n             rules.add(p.state(d, true).requires(q.state(d, false)));\\n         }\\n     }\\n  }\\n}\\n```\\n\\nそして上の問題の設定は、件のブログではverbatimで与えられていたのでコピペして`&str`として取り込み、スライスをうまく作ってparseするのが現実的（解くのが数秒で問題入力が1時間ではちょっとね）。\\n\\n```rust\\nconst dim: usize = 25;\\n\\nconst S25: &str = \\"\\n+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n...\\n\\";\\n\\nfn parse() -> Vec<(Pos, usize)> {\\n  let block_len = (dim as f64).sqrt() as usize;\\n  let mut i = 0;\\n  for (ii, l) in S25.lines().skip(1).enumerate() {\\n     if ii % (block_len + 1) == 0 {\\n         continue;\\n     }\\n     i += 1;\\n     ...\\n  } \\n```\\n\\nでやってみたところ、全然だめ。いろいろ補助的なルールを追加しても5000秒でもだめ。\\n\\n### 2020-10-13\\n\\nCaDiCaLが8000秒掛かっても解けないじゃん！！こんなん解けるか！","bodyHtml":"<p>何の調べ物をしていたのか忘れましたが、偶然こんなものを見つけました。\\nhttp://labs.timedia.co.jp/2017/07/sat25x2520.html</p>\\n<pre><code class=\\"hljs\\">+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n| .  .  .  .  .| .  9  . 19  .| .  . 10 11  .| .  .  .  .  .| .  .  .  .  .|\\n| .  4  . 22  .| .  .  .  .  .| .  .  .  .  .| .  . 12  .  .|20 15  1  .  .|\\n|16  1 20 15  .| .  .  .  .  .| .  .  .  .  .|14  .  4  . 22|12 25  .  .  .|\\n| .  .  .  .  .| .  7  2 11  .|23  . 19  8  .| .  .  . 13  .| .  .  .  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n|13  .  8  .  2| .  .  .  .  .| .  .  7 23  6| .  9  . 19 11| .  .  .  .  .|\\n| .  .  .  . 23| .  .  .  . 16| .  .  .  .  .| .  .  .  .  .| 1  .  .  .  .|\\n| 7  .  .  . 10| 3  .  .  .  .| .  .  9 19  .| . 13  . 23  .| .  .  .  5  .|\\n| .  .  .  .  .|15  .  .  . 22| .  .  .  .  .| .  .  .  .  .|25 20  .  .  .|\\n| .  .  .  .  .|12  . 14  1 25| .  .  .  .  .| .  .  3  .  .|16  4 15  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| . 19  9  .  .| .  . 13  7  .| .  .  .  5  .| .  .  . 23 10|\\n| . 22  . 25 17| .  .  .  .  .| .  .  .  .  .|12  . 20  .  .| .  .  .  .  .|\\n| . 20 12 16  .| .  .  .  .  .| .  .  .  . 14|15 22  1  . 25| .  .  .  .  .|\\n| . 15  .  .  .| . 11  .  .  .| .  .  .  .  .| .  . 16  .  .| .  .  .  9  .|\\n| .  .  .  1  .| . 10  . 23  .| .  .  .  . 18| .  .  .  .  .| .  .  .  .  8|\\n+--------------+--------------+--------------+--------------+--------------+\\n|10  .  .  .  8| . 13  .  5  .| .  .  .  .  .| . 19  . 11 23| .  .  .  6  .|\\n| .  .  . 17  7| .  .  .  .  .| .  .  .  .  1| .  .  .  .  .| 4 22  .  .  .|\\n| .  .  .  . 11| . 23  .  .  .| .  .  .  . 20| .  .  .  2  .|14  .  .  .  .|\\n|19  . 23  .  5| .  8  .  9  .| . 21  .  .  .| . 10  .  7  .| .  .  .  .  .|\\n| .  3  .  .  .| .  .  .  .  .|25  4  .  . 12| .  .  .  .  .|15  1 16  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| .  .  .  . 15| . 12  .  . 25| 1  . 22  .  .| 3  .  .  .  .|\\n|23  .  .  . 19| .  2  .  .  .| .  .  .  .  .| .  .  . 10  .| .  .  .  7 11|\\n| .  .  . 18  .| .  .  .  .  .| . 20  .  .  .| .  .  .  .  .| .  .  .  .  .|\\n| .  .  .  .  .| .  .  .  .  4|14 15  .  . 22| .  .  .  .  .| .  .  . 10  .|\\n|11  .  .  .  9| .  .  .  .  .| .  .  .  .  .| .  .  .  .  .| .  .  . 19  .|\\n+--------------+--------------+--------------+--------------+--------------+</code></pre><p>この問題をSATで解く（正確には、他の人に解いてもらう）という話です。</p>\\n<blockquote>\\n<p>さて、制約充足問題というと、すぐに思いつくのがSATであろう。ということで調べると、SATでパズルを解く研究をしている神戸大学情報基盤センターが直ぐに見つかる。</p>\\n</blockquote>\\n<p>「SATでパズルを解く研究をしている」という表現はどうなのかと思わないでもないけどもそれは置いといて、田村先生によって<a href=\\"http://labs.timedia.co.jp/2017/07/sat25x2520-1.html\\">20秒で解かれてしまった</a>そうだ。</p>\\n<p>さて、Splrだとどうだろうか。面白そうなのでやってみました。</p>\\n<h1>sudokuの符号化</h1>\\n<p>sudokuのルールは以下の4つ。</p>\\n<ol>\\n<li>セルには一つの数を割り当てる（単一制約）</li>\\n<li>行には全ての数をそれぞれ一回のみ割り当てる（行制約）</li>\\n<li>列には全ての数をそれぞれ一回のみ割り当てる（列制約）</li>\\n<li>ブロックには全ての数をそれぞれ一回のみ割り当てる（ブロック制約）</li>\\n</ol>\\n<p>既に何度か符号化しているものの、以前作ったものがサイズ25に対応できてなかったことがわかったのでもう一度<a href=\\"2020/2020-05-26-MiracleSudoku/\\">What\'s Miracle Sudoku?</a>で導入した、第１象限限定の幾何構造体<code>Pos</code>、その上の状態保持構造体<code>Cell</code>をそのまま利用して作り直し。例えばこんな感じで簡単に書ける。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">for</span> i <span class=\\"hljs-keyword\\">in</span> <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span> {\\n  <span class=\\"hljs-keyword\\">for</span> j <span class=\\"hljs-keyword\\">in</span> <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span> {\\n     <span class=\\"hljs-keyword\\">let</span> p = Pos::at(i, j);\\n     <span class=\\"hljs-keyword\\">for</span> jj <span class=\\"hljs-keyword\\">in</span> j + <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span>; \\n         <span class=\\"hljs-keyword\\">let</span> q = Pos::at(i, jj);\\n         <span class=\\"hljs-keyword\\">for</span> d <span class=\\"hljs-keyword\\">in</span> <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span> {\\n             rules.add(p.state(d, <span class=\\"hljs-literal\\">true</span>).requires(q.state(d, <span class=\\"hljs-literal\\">false</span>)));\\n         }\\n     }\\n  }\\n}</code></pre><p>そして上の問題の設定は、件のブログではverbatimで与えられていたのでコピペして<code>&amp;str</code>として取り込み、スライスをうまく作ってparseするのが現実的（解くのが数秒で問題入力が1時間ではちょっとね）。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">const</span> dim: <span class=\\"hljs-built_in\\">usize</span> = <span class=\\"hljs-number\\">25</span>;\\n\\n<span class=\\"hljs-keyword\\">const</span> S25: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"\\n+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n...\\n\\"</span>;\\n\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">parse</span></span>() -&gt; <span class=\\"hljs-built_in\\">Vec</span>&lt;(Pos, <span class=\\"hljs-built_in\\">usize</span>)&gt; {\\n  <span class=\\"hljs-keyword\\">let</span> block_len = (dim <span class=\\"hljs-keyword\\">as</span> <span class=\\"hljs-built_in\\">f64</span>).sqrt() <span class=\\"hljs-keyword\\">as</span> <span class=\\"hljs-built_in\\">usize</span>;\\n  <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> i = <span class=\\"hljs-number\\">0</span>;\\n  <span class=\\"hljs-keyword\\">for</span> (ii, l) <span class=\\"hljs-keyword\\">in</span> S25.lines().skip(<span class=\\"hljs-number\\">1</span>).enumerate() {\\n     <span class=\\"hljs-keyword\\">if</span> ii % (block_len + <span class=\\"hljs-number\\">1</span>) == <span class=\\"hljs-number\\">0</span> {\\n         <span class=\\"hljs-keyword\\">continue</span>;\\n     }\\n     i += <span class=\\"hljs-number\\">1</span>;\\n     ...\\n  }</code></pre><p>でやってみたところ、全然だめ。いろいろ補助的なルールを追加しても5000秒でもだめ。</p>\\n<h3>2020-10-13</h3>\\n<p>CaDiCaLが8000秒掛かっても解けないじゃん！！こんなん解けるか！</p>\\n","dir":"article/.json/2020","base":"2020-08-19-sudoku25.json","ext":".json","sourceBase":"2020-08-19-sudoku25.md","sourceExt":".md"}')}}]);