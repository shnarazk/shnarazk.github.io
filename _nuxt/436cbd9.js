(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{583:function(n){n.exports=JSON.parse('{"title":"Rust製の「SATソルバーで25x25のナンプレが解けるだろうか」","subtitle":"頑張れSplr","date":"2020-11-24T00:00:00.000Z","tags":["splr","sudoku"],"bodyContent":"何の調べ物をしていたのか忘れましたが、偶然こんなものを見つけました。\\nhttp://labs.timedia.co.jp/2017/07/sat25x2520.html\\n\\n```text\\n+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n| .  .  .  .  .| .  9  . 19  .| .  . 10 11  .| .  .  .  .  .| .  .  .  .  .|\\n| .  4  . 22  .| .  .  .  .  .| .  .  .  .  .| .  . 12  .  .|20 15  1  .  .|\\n|16  1 20 15  .| .  .  .  .  .| .  .  .  .  .|14  .  4  . 22|12 25  .  .  .|\\n| .  .  .  .  .| .  7  2 11  .|23  . 19  8  .| .  .  . 13  .| .  .  .  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n|13  .  8  .  2| .  .  .  .  .| .  .  7 23  6| .  9  . 19 11| .  .  .  .  .|\\n| .  .  .  . 23| .  .  .  . 16| .  .  .  .  .| .  .  .  .  .| 1  .  .  .  .|\\n| 7  .  .  . 10| 3  .  .  .  .| .  .  9 19  .| . 13  . 23  .| .  .  .  5  .|\\n| .  .  .  .  .|15  .  .  . 22| .  .  .  .  .| .  .  .  .  .|25 20  .  .  .|\\n| .  .  .  .  .|12  . 14  1 25| .  .  .  .  .| .  .  3  .  .|16  4 15  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| . 19  9  .  .| .  . 13  7  .| .  .  .  5  .| .  .  . 23 10|\\n| . 22  . 25 17| .  .  .  .  .| .  .  .  .  .|12  . 20  .  .| .  .  .  .  .|\\n| . 20 12 16  .| .  .  .  .  .| .  .  .  . 14|15 22  1  . 25| .  .  .  .  .|\\n| . 15  .  .  .| . 11  .  .  .| .  .  .  .  .| .  . 16  .  .| .  .  .  9  .|\\n| .  .  .  1  .| . 10  . 23  .| .  .  .  . 18| .  .  .  .  .| .  .  .  .  8|\\n+--------------+--------------+--------------+--------------+--------------+\\n|10  .  .  .  8| . 13  .  5  .| .  .  .  .  .| . 19  . 11 23| .  .  .  6  .|\\n| .  .  . 17  7| .  .  .  .  .| .  .  .  .  1| .  .  .  .  .| 4 22  .  .  .|\\n| .  .  .  . 11| . 23  .  .  .| .  .  .  . 20| .  .  .  2  .|14  .  .  .  .|\\n|19  . 23  .  5| .  8  .  9  .| . 21  .  .  .| . 10  .  7  .| .  .  .  .  .|\\n| .  3  .  .  .| .  .  .  .  .|25  4  .  . 12| .  .  .  .  .|15  1 16  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| .  .  .  . 15| . 12  .  . 25| 1  . 22  .  .| 3  .  .  .  .|\\n|23  .  .  . 19| .  2  .  .  .| .  .  .  .  .| .  .  . 10  .| .  .  .  7 11|\\n| .  .  . 18  .| .  .  .  .  .| . 20  .  .  .| .  .  .  .  .| .  .  .  .  .|\\n| .  .  .  .  .| .  .  .  .  4|14 15  .  . 22| .  .  .  .  .| .  .  . 10  .|\\n|11  .  .  .  9| .  .  .  .  .| .  .  .  .  .| .  .  .  .  .| .  .  . 19  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n```\\n\\nこの問題をSATで解く（正確には、他の人に解いてもらう）という話です。\\n\\n> さて、制約充足問題というと、すぐに思いつくのがSATであろう。ということで調べると、SATでパズルを解く研究をしている神戸大学情報基盤センターが直ぐに見つかる。\\n\\n「SATでパズルを解く研究をしている」という表現はどうなのかと思わないでもないけどもそれは置いといて、田村先生によって[20秒で解かれてしまった](http://labs.timedia.co.jp/2017/07/sat25x2520-1.html)そうだ。\\n\\nさて、Splrだとどうだろうか。面白そうなのでやってみました。\\n\\n# sudokuの符号化(part 1)\\n\\nsudokuのルールは以下の4つ。\\n\\n1. セルには一つの数を割り当てる（単一制約）\\n1. 行には全ての数をそれぞれ一回のみ割り当てる（行制約）\\n1. 列には全ての数をそれぞれ一回のみ割り当てる（列制約）\\n1. ブロックには全ての数をそれぞれ一回のみ割り当てる（ブロック制約）\\n\\n既に何度か符号化しているものの、以前作ったものがサイズ25に対応できてなかったことがわかったのでもう一度[What\'s Miracle Sudoku?](2020/2020-05-26-MiracleSudoku/)で導入した、第１象限限定の幾何構造体`Pos`、その上の状態保持構造体`Cell`をそのまま利用して作り直し。例えばこんな感じで簡単に書ける。\\n\\n```rust\\nfor i in 1..9 {\\n  for j in 1..9 {\\n     let p = Pos::at(i, j);\\n     for jj in j + 1..9; \\n         let q = Pos::at(i, jj);\\n         for d in 1..9 {\\n             rules.add(p.state(d, true).requires(q.state(d, false)));\\n         }\\n     }\\n  }\\n}\\n```\\n\\nそして上の問題の設定は、件のブログではverbatimで与えられていたのでコピペして`&str`として取り込み、スライスをうまく作ってparseするのが現実的（解くのが数秒で問題入力が1時間ではちょっとね）。\\n\\n```rust\\nconst dim: usize = 25;\\n\\nconst S25: &str = \\"\\n+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n...\\n\\";\\n\\nfn parse() -> Vec<(Pos, usize)> {\\n  let block_len = (dim as f64).sqrt() as usize;\\n  let mut i = 0;\\n  for (ii, l) in S25.lines().skip(1).enumerate() {\\n     if ii % (block_len + 1) == 0 {\\n         continue;\\n     }\\n     i += 1;\\n     ...\\n  } \\n```\\n\\nでやってみたところ、全然だめ。いろいろ補助的なルールを追加しても5000秒でもだめ。\\n\\n### 2020-10-13\\n\\nCaDiCaLが8000秒掛かっても解けないじゃん！！こんなん解けねーよ！\\n\\n### 2020-11-02\\n\\n先月は10040あたりでピタリと停滞していたのが10150あたりまで伸びるようになってきた。\\n\\n### 2020-11-06\\n\\n10040とか10150とか言っていたのはasserted varsの個数だけど、eliminated varsのことを考えてないので正確ではない。\\n大体残り5080くらいということ。\\n\\n### 2020-11-07\\n\\nCaDiCaLで実行すると数時間掛かった。残りが減れば加速するかと思っていたけど、CaDiCaLですら残り4000台は淡々としか減っていかない。\\n残り3000の前半くらいからやっと終わりが見えてくる。\\nうーむ、4000台への突入ではなく3000台を通り過ごさなければならないのか。これは長い。\\n\\n### 2020-11-18\\n\\n[新しい実装](/2020/2020-11-07-LubyStabilization)で5000秒で残り5081とか10000秒で4991くらい。\\nこれはブレークスルーであるが、一方でコアがなかなか小さくならない（1100程度）ので時間を掛けても解けるかどうか自信がない。\\n\\n```\\n$ splr -t 10000 sudoku25.cnf\\nsudoku25.cnf                                   15625,970146 |time: 10000.10\\n #conflict:  108320000, #decision:    151987030, #propagate:     7602488160 \\n  Assignment|#rem:     4991, #ass:    10205, #elm:      429, prg%:  68.0576 \\n      Clause|Remv:    27129, LBD2:      291, Binc:  1020680, Perm:  1057443 \\n     Restart|#BLK:    44811, #RST:   383671, span:     8192, shft:    16382 \\n         EMA|tLBD:   1.6215, tASG:   0.9990, core:     1196, /dpc:     1.40 \\n    Conflict|eLBD:    32.07, cnfl:    44.64, bjmp:    43.51, /ppc:    70.19 \\n        misc|elim:       42, cviv:       16, #vbv:        0, /cpr:   282.31 \\n    Strategy|mode: HighSuccessiveConflict (long decision chains)\\n      Result|file: ./.ans_sudoku25.cnf\\ns UNKNOWN (TimeOut): sudoku25.cnf\\n```\\n\\n### 2020-11-21\\n\\n三連休は数独三昧になりそうだ。\\n\\n- 202011-21T11:23 (Online TeXを見ながら) 5000秒で4800台とか。\\n- 202011-22T22:00 2000秒台で4800台突入。\\n\\n### 2020-11-24\\n\\nあー、あるルールを追加してなかったなあと思って[生成プログラムを変更](https://github.com/shnarazk/miracle_sudoku/commit/1e41b14aecd58d02cb1a2087d3c239f661b67e5e)したらCaDiCaLが一瞬で解くようになった。\\nもしかしてと思ってやってみたら、\\n\\n```\\n$ splr sudoku25.cnf\\nsudoku25.cnf                                   15625,972021 |time:    15.03\\n #conflict:        324, #decision:         2920, #propagate:         101930 \\n  Assignment|#rem:     2507, #ass:    13118, #elm:        0, prg%:  83.9552 \\n      Clause|Remv:      229, LBD2:       35, Binc:   922556, Perm:   924329 \\n     Restart|#BLK:        8, #RST:        0, span:        1, shft:        0 \\n         EMA|tLBD:  38.8489, tASG:  52.9797, core:        0, /dpc:     9.01 \\n    Conflict|eLBD:     4.22, cnfl:     1.17, bjmp:     0.76, /ppc:   314.60 \\n        misc|elim:        2, cviv:        0, #vbv:        0, /cpr:     8.31 \\n    Strategy|mode: Initial search phase before a main strategy\\n      Result|file: ./.ans_sudoku25.cnf\\ns SATISFIABLE: sudoku25.cnf\\n$ dmcr sudoku25.cnf \\nA valid assignment set for sudoku25.cnf is found in .ans_sudoku25.cnf\\n```\\n\\nぎょえーーーーー、なんだったんだこの一ヶ月の電気代！！！！！！\\n\\nとりあえず証拠の品を部分公開。\\n\\n```text\\n+--------------+--------------+--------------+--------------+--------------+\\n| 8 12 11 10 18|14 25  4 16 24|20 17  1  9 21|19  5 15  6  2|22 23  7  3 13|\\n| 2  .  .  .  .| .  9  . 19  .| .  . 10 11  .| .  .  .  .  .| .  .  .  . 21|\\n| 9  4  . 22  .| .  .  .  .  .| .  .  .  .  .| .  . 12  .  .|20 15  1  .  2|\\n|16  1 20 15  .| .  .  .  .  .| .  .  .  .  .|14  .  4  . 22|12 25  .  . 19|\\n|14  .  .  .  .| .  7  2 11  .|23  . 19  8  .| .  .  . 13  .| .  .  .  .  4|\\n+--------------+--------------+--------------+--------------+--------------+\\n|13  .  8  .  2| .  .  .  .  .| .  .  7 23  6| .  9  . 19 11| .  .  .  . 12|\\n|22  .  .  . 23| .  .  .  . 16| .  .  .  .  .| .  .  .  .  .| 1  .  .  .  7|\\n| 7  .  .  . 10| 3  .  .  .  .| .  .  9 19  .| . 13  . 23  .| .  .  .  5 18|\\n|17  .  .  .  .|15  .  .  . 22| .  .  .  .  .| .  .  .  .  .|25 20  .  .  9|\\n| 6  .  .  .  .|12  . 14  1 25| .  .  .  .  .| .  .  3  .  .|16  4 15  . 23|\\n+--------------+--------------+--------------+--------------+--------------+\\n| 3  .  .  .  .| . 19  9  .  .| .  . 13  7  .| .  .  .  5  .| .  .  . 23 10|\\n| 5 22  . 25 17| .  .  .  .  .| .  .  .  .  .|12  . 20  .  .| .  .  .  . 16|\\n|18 20 12 16  .| .  .  .  .  .| .  .  .  . 14|15 22  1  . 25| .  .  .  .  3|\\n|24 15  .  .  .| . 11  .  .  .| .  .  .  .  .| .  . 16  .  .| .  .  .  9  1|\\n|21  .  .  1  .| . 10  . 23  .| .  .  .  . 18| .  .  .  .  .| .  .  .  .  8|\\n+--------------+--------------+--------------+--------------+--------------+\\n|10  .  .  .  8| . 13  .  5  .| .  .  .  .  .| . 19  . 11 23| .  .  .  6 20|\\n|12  .  . 17  7| .  .  .  .  .| .  .  .  .  1| .  .  .  .  .| 4 22  .  .  5|\\n|15  .  .  . 11| . 23  .  .  .| .  .  .  . 20| .  .  .  2  .|14  .  .  . 24|\\n|19  . 23  .  5| .  8  .  9  .| . 21  .  .  .| . 10  .  7  .| .  .  .  . 25|\\n|20  3  .  .  .| .  .  .  .  .|25  4  .  . 12| .  .  .  .  .|15  1 16  . 17|\\n+--------------+--------------+--------------+--------------+--------------+\\n| 4  .  .  .  .| .  .  .  . 15| . 12  .  . 25| 1  . 22  .  .| 3  .  .  . 14|\\n|23  .  .  . 19| .  2  .  .  .| .  .  .  .  .| .  .  . 10  .| .  .  .  7 11|\\n|25  .  . 18  .| .  .  .  .  .| . 20  .  .  .| .  .  .  .  .| .  .  .  . 22|\\n| 1  .  .  .  .| .  .  .  .  4|14 15  .  . 22| .  .  .  .  .| .  .  . 10  6|\\n|11  6 14  3  9| 5 22 17 20  8|13  7 16  1 10| 2  4 23 12 18|24 21 25 19 15|\\n+--------------+--------------+--------------+--------------+--------------+\\n```\\n\\n# sudokuの符号化(part 2)\\n\\nsudokuのルールは以下の4つ（これは再掲）：\\n\\n1. セルには{多くとも,少なくとも}一つの数を割り当てる（最多・最少単一制約）\\n1. 行には全ての数をそれぞれ一回のみ割り当てる（行制約）\\n1. 列には全ての数をそれぞれ一回のみ割り当てる（列制約）\\n1. ブロックには全ての数をそれぞれ一回のみ割り当てる（ブロック制約）\\n\\nここで、2から4は以下のように解釈すべきである：\\n\\n1. 行、列、ブロックなどのグループはあるセルに一つの数が割り当てられたら、他のセルにはその数は割り当てられない（[拡大最多単一制約](https://github.com/shnarazk/miracle_sudoku/commit/2f73c7205b7658658b154e1dfe2a54a48e054538)）\\n1. 行、列、ブロックなどのグループは全ての数をそれぞれ少なくとも1回割り当てる（[拡大最少単一制約](https://github.com/shnarazk/miracle_sudoku/commit/1e41b14aecd58d02cb1a2087d3c239f661b67e5e)）\\n\\nこの2番目が最初のプログラムにはなかった（negative assertionsからpositive assertionへの導出がなかったので、そりゃ探索空間が小さくならないわ）。\\n行制約の単純な解釈だと抜け落ちてしまう。\\nそれでもN=9, 16くらいだと問題にならないので、ブログなどでは出てこなくても当然かもしれない。\\n\\nこれが色々なソルバーの説明で出てくるXOR gateの話に繋がるのだろうか。","bodyHtml":"<p>何の調べ物をしていたのか忘れましたが、偶然こんなものを見つけました。\\nhttp://labs.timedia.co.jp/2017/07/sat25x2520.html</p>\\n<pre><code class=\\"hljs\\">+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n| .  .  .  .  .| .  9  . 19  .| .  . 10 11  .| .  .  .  .  .| .  .  .  .  .|\\n| .  4  . 22  .| .  .  .  .  .| .  .  .  .  .| .  . 12  .  .|20 15  1  .  .|\\n|16  1 20 15  .| .  .  .  .  .| .  .  .  .  .|14  .  4  . 22|12 25  .  .  .|\\n| .  .  .  .  .| .  7  2 11  .|23  . 19  8  .| .  .  . 13  .| .  .  .  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n|13  .  8  .  2| .  .  .  .  .| .  .  7 23  6| .  9  . 19 11| .  .  .  .  .|\\n| .  .  .  . 23| .  .  .  . 16| .  .  .  .  .| .  .  .  .  .| 1  .  .  .  .|\\n| 7  .  .  . 10| 3  .  .  .  .| .  .  9 19  .| . 13  . 23  .| .  .  .  5  .|\\n| .  .  .  .  .|15  .  .  . 22| .  .  .  .  .| .  .  .  .  .|25 20  .  .  .|\\n| .  .  .  .  .|12  . 14  1 25| .  .  .  .  .| .  .  3  .  .|16  4 15  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| . 19  9  .  .| .  . 13  7  .| .  .  .  5  .| .  .  . 23 10|\\n| . 22  . 25 17| .  .  .  .  .| .  .  .  .  .|12  . 20  .  .| .  .  .  .  .|\\n| . 20 12 16  .| .  .  .  .  .| .  .  .  . 14|15 22  1  . 25| .  .  .  .  .|\\n| . 15  .  .  .| . 11  .  .  .| .  .  .  .  .| .  . 16  .  .| .  .  .  9  .|\\n| .  .  .  1  .| . 10  . 23  .| .  .  .  . 18| .  .  .  .  .| .  .  .  .  8|\\n+--------------+--------------+--------------+--------------+--------------+\\n|10  .  .  .  8| . 13  .  5  .| .  .  .  .  .| . 19  . 11 23| .  .  .  6  .|\\n| .  .  . 17  7| .  .  .  .  .| .  .  .  .  1| .  .  .  .  .| 4 22  .  .  .|\\n| .  .  .  . 11| . 23  .  .  .| .  .  .  . 20| .  .  .  2  .|14  .  .  .  .|\\n|19  . 23  .  5| .  8  .  9  .| . 21  .  .  .| . 10  .  7  .| .  .  .  .  .|\\n| .  3  .  .  .| .  .  .  .  .|25  4  .  . 12| .  .  .  .  .|15  1 16  .  .|\\n+--------------+--------------+--------------+--------------+--------------+\\n| .  .  .  .  .| .  .  .  . 15| . 12  .  . 25| 1  . 22  .  .| 3  .  .  .  .|\\n|23  .  .  . 19| .  2  .  .  .| .  .  .  .  .| .  .  . 10  .| .  .  .  7 11|\\n| .  .  . 18  .| .  .  .  .  .| . 20  .  .  .| .  .  .  .  .| .  .  .  .  .|\\n| .  .  .  .  .| .  .  .  .  4|14 15  .  . 22| .  .  .  .  .| .  .  . 10  .|\\n|11  .  .  .  9| .  .  .  .  .| .  .  .  .  .| .  .  .  .  .| .  .  . 19  .|\\n+--------------+--------------+--------------+--------------+--------------+</code></pre><p>この問題をSATで解く（正確には、他の人に解いてもらう）という話です。</p>\\n<blockquote>\\n<p>さて、制約充足問題というと、すぐに思いつくのがSATであろう。ということで調べると、SATでパズルを解く研究をしている神戸大学情報基盤センターが直ぐに見つかる。</p>\\n</blockquote>\\n<p>「SATでパズルを解く研究をしている」という表現はどうなのかと思わないでもないけどもそれは置いといて、田村先生によって<a href=\\"http://labs.timedia.co.jp/2017/07/sat25x2520-1.html\\">20秒で解かれてしまった</a>そうだ。</p>\\n<p>さて、Splrだとどうだろうか。面白そうなのでやってみました。</p>\\n<h1>sudokuの符号化(part 1)</h1>\\n<p>sudokuのルールは以下の4つ。</p>\\n<ol>\\n<li>セルには一つの数を割り当てる（単一制約）</li>\\n<li>行には全ての数をそれぞれ一回のみ割り当てる（行制約）</li>\\n<li>列には全ての数をそれぞれ一回のみ割り当てる（列制約）</li>\\n<li>ブロックには全ての数をそれぞれ一回のみ割り当てる（ブロック制約）</li>\\n</ol>\\n<p>既に何度か符号化しているものの、以前作ったものがサイズ25に対応できてなかったことがわかったのでもう一度<a href=\\"2020/2020-05-26-MiracleSudoku/\\">What\'s Miracle Sudoku?</a>で導入した、第１象限限定の幾何構造体<code>Pos</code>、その上の状態保持構造体<code>Cell</code>をそのまま利用して作り直し。例えばこんな感じで簡単に書ける。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">for</span> i <span class=\\"hljs-keyword\\">in</span> <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span> {\\n  <span class=\\"hljs-keyword\\">for</span> j <span class=\\"hljs-keyword\\">in</span> <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span> {\\n     <span class=\\"hljs-keyword\\">let</span> p = Pos::at(i, j);\\n     <span class=\\"hljs-keyword\\">for</span> jj <span class=\\"hljs-keyword\\">in</span> j + <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span>; \\n         <span class=\\"hljs-keyword\\">let</span> q = Pos::at(i, jj);\\n         <span class=\\"hljs-keyword\\">for</span> d <span class=\\"hljs-keyword\\">in</span> <span class=\\"hljs-number\\">1</span>..<span class=\\"hljs-number\\">9</span> {\\n             rules.add(p.state(d, <span class=\\"hljs-literal\\">true</span>).requires(q.state(d, <span class=\\"hljs-literal\\">false</span>)));\\n         }\\n     }\\n  }\\n}</code></pre><p>そして上の問題の設定は、件のブログではverbatimで与えられていたのでコピペして<code>&amp;str</code>として取り込み、スライスをうまく作ってparseするのが現実的（解くのが数秒で問題入力が1時間ではちょっとね）。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">const</span> dim: <span class=\\"hljs-built_in\\">usize</span> = <span class=\\"hljs-number\\">25</span>;\\n\\n<span class=\\"hljs-keyword\\">const</span> S25: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"\\n+--------------+--------------+--------------+--------------+--------------+\\n| . 12  .  .  .| .  .  .  .  .| .  .  .  9  .| .  . 15  .  .|22  .  .  .  .|\\n...\\n\\"</span>;\\n\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">parse</span></span>() -&gt; <span class=\\"hljs-built_in\\">Vec</span>&lt;(Pos, <span class=\\"hljs-built_in\\">usize</span>)&gt; {\\n  <span class=\\"hljs-keyword\\">let</span> block_len = (dim <span class=\\"hljs-keyword\\">as</span> <span class=\\"hljs-built_in\\">f64</span>).sqrt() <span class=\\"hljs-keyword\\">as</span> <span class=\\"hljs-built_in\\">usize</span>;\\n  <span class=\\"hljs-keyword\\">let</span> <span class=\\"hljs-keyword\\">mut</span> i = <span class=\\"hljs-number\\">0</span>;\\n  <span class=\\"hljs-keyword\\">for</span> (ii, l) <span class=\\"hljs-keyword\\">in</span> S25.lines().skip(<span class=\\"hljs-number\\">1</span>).enumerate() {\\n     <span class=\\"hljs-keyword\\">if</span> ii % (block_len + <span class=\\"hljs-number\\">1</span>) == <span class=\\"hljs-number\\">0</span> {\\n         <span class=\\"hljs-keyword\\">continue</span>;\\n     }\\n     i += <span class=\\"hljs-number\\">1</span>;\\n     ...\\n  }</code></pre><p>でやってみたところ、全然だめ。いろいろ補助的なルールを追加しても5000秒でもだめ。</p>\\n<h3>2020-10-13</h3>\\n<p>CaDiCaLが8000秒掛かっても解けないじゃん！！こんなん解けねーよ！</p>\\n<h3>2020-11-02</h3>\\n<p>先月は10040あたりでピタリと停滞していたのが10150あたりまで伸びるようになってきた。</p>\\n<h3>2020-11-06</h3>\\n<p>10040とか10150とか言っていたのはasserted varsの個数だけど、eliminated varsのことを考えてないので正確ではない。\\n大体残り5080くらいということ。</p>\\n<h3>2020-11-07</h3>\\n<p>CaDiCaLで実行すると数時間掛かった。残りが減れば加速するかと思っていたけど、CaDiCaLですら残り4000台は淡々としか減っていかない。\\n残り3000の前半くらいからやっと終わりが見えてくる。\\nうーむ、4000台への突入ではなく3000台を通り過ごさなければならないのか。これは長い。</p>\\n<h3>2020-11-18</h3>\\n<p><a href=\\"/2020/2020-11-07-LubyStabilization\\">新しい実装</a>で5000秒で残り5081とか10000秒で4991くらい。\\nこれはブレークスルーであるが、一方でコアがなかなか小さくならない（1100程度）ので時間を掛けても解けるかどうか自信がない。</p>\\n<pre><code>$ splr -t 10000 sudoku25.cnf\\nsudoku25.cnf                                   15625,970146 |time: 10000.10\\n #conflict:  108320000, #decision:    151987030, #propagate:     7602488160 \\n  Assignment|#rem:     4991, #ass:    10205, #elm:      429, prg%:  68.0576 \\n      Clause|Remv:    27129, LBD2:      291, Binc:  1020680, Perm:  1057443 \\n     Restart|#BLK:    44811, #RST:   383671, span:     8192, shft:    16382 \\n         EMA|tLBD:   1.6215, tASG:   0.9990, core:     1196, /dpc:     1.40 \\n    Conflict|eLBD:    32.07, cnfl:    44.64, bjmp:    43.51, /ppc:    70.19 \\n        misc|elim:       42, cviv:       16, #vbv:        0, /cpr:   282.31 \\n    Strategy|mode: HighSuccessiveConflict (long decision chains)\\n      Result|file: ./.ans_sudoku25.cnf\\ns UNKNOWN (TimeOut): sudoku25.cnf\\n</code></pre>\\n<h3>2020-11-21</h3>\\n<p>三連休は数独三昧になりそうだ。</p>\\n<ul>\\n<li>202011-21T11:23 (Online TeXを見ながら) 5000秒で4800台とか。</li>\\n<li>202011-22T22:00 2000秒台で4800台突入。</li>\\n</ul>\\n<h3>2020-11-24</h3>\\n<p>あー、あるルールを追加してなかったなあと思って<a href=\\"https://github.com/shnarazk/miracle_sudoku/commit/1e41b14aecd58d02cb1a2087d3c239f661b67e5e\\">生成プログラムを変更</a>したらCaDiCaLが一瞬で解くようになった。\\nもしかしてと思ってやってみたら、</p>\\n<pre><code>$ splr sudoku25.cnf\\nsudoku25.cnf                                   15625,972021 |time:    15.03\\n #conflict:        324, #decision:         2920, #propagate:         101930 \\n  Assignment|#rem:     2507, #ass:    13118, #elm:        0, prg%:  83.9552 \\n      Clause|Remv:      229, LBD2:       35, Binc:   922556, Perm:   924329 \\n     Restart|#BLK:        8, #RST:        0, span:        1, shft:        0 \\n         EMA|tLBD:  38.8489, tASG:  52.9797, core:        0, /dpc:     9.01 \\n    Conflict|eLBD:     4.22, cnfl:     1.17, bjmp:     0.76, /ppc:   314.60 \\n        misc|elim:        2, cviv:        0, #vbv:        0, /cpr:     8.31 \\n    Strategy|mode: Initial search phase before a main strategy\\n      Result|file: ./.ans_sudoku25.cnf\\ns SATISFIABLE: sudoku25.cnf\\n$ dmcr sudoku25.cnf \\nA valid assignment set for sudoku25.cnf is found in .ans_sudoku25.cnf\\n</code></pre>\\n<p>ぎょえーーーーー、なんだったんだこの一ヶ月の電気代！！！！！！</p>\\n<p>とりあえず証拠の品を部分公開。</p>\\n<pre><code class=\\"hljs\\">+--------------+--------------+--------------+--------------+--------------+\\n| 8 12 11 10 18|14 25  4 16 24|20 17  1  9 21|19  5 15  6  2|22 23  7  3 13|\\n| 2  .  .  .  .| .  9  . 19  .| .  . 10 11  .| .  .  .  .  .| .  .  .  . 21|\\n| 9  4  . 22  .| .  .  .  .  .| .  .  .  .  .| .  . 12  .  .|20 15  1  .  2|\\n|16  1 20 15  .| .  .  .  .  .| .  .  .  .  .|14  .  4  . 22|12 25  .  . 19|\\n|14  .  .  .  .| .  7  2 11  .|23  . 19  8  .| .  .  . 13  .| .  .  .  .  4|\\n+--------------+--------------+--------------+--------------+--------------+\\n|13  .  8  .  2| .  .  .  .  .| .  .  7 23  6| .  9  . 19 11| .  .  .  . 12|\\n|22  .  .  . 23| .  .  .  . 16| .  .  .  .  .| .  .  .  .  .| 1  .  .  .  7|\\n| 7  .  .  . 10| 3  .  .  .  .| .  .  9 19  .| . 13  . 23  .| .  .  .  5 18|\\n|17  .  .  .  .|15  .  .  . 22| .  .  .  .  .| .  .  .  .  .|25 20  .  .  9|\\n| 6  .  .  .  .|12  . 14  1 25| .  .  .  .  .| .  .  3  .  .|16  4 15  . 23|\\n+--------------+--------------+--------------+--------------+--------------+\\n| 3  .  .  .  .| . 19  9  .  .| .  . 13  7  .| .  .  .  5  .| .  .  . 23 10|\\n| 5 22  . 25 17| .  .  .  .  .| .  .  .  .  .|12  . 20  .  .| .  .  .  . 16|\\n|18 20 12 16  .| .  .  .  .  .| .  .  .  . 14|15 22  1  . 25| .  .  .  .  3|\\n|24 15  .  .  .| . 11  .  .  .| .  .  .  .  .| .  . 16  .  .| .  .  .  9  1|\\n|21  .  .  1  .| . 10  . 23  .| .  .  .  . 18| .  .  .  .  .| .  .  .  .  8|\\n+--------------+--------------+--------------+--------------+--------------+\\n|10  .  .  .  8| . 13  .  5  .| .  .  .  .  .| . 19  . 11 23| .  .  .  6 20|\\n|12  .  . 17  7| .  .  .  .  .| .  .  .  .  1| .  .  .  .  .| 4 22  .  .  5|\\n|15  .  .  . 11| . 23  .  .  .| .  .  .  . 20| .  .  .  2  .|14  .  .  . 24|\\n|19  . 23  .  5| .  8  .  9  .| . 21  .  .  .| . 10  .  7  .| .  .  .  . 25|\\n|20  3  .  .  .| .  .  .  .  .|25  4  .  . 12| .  .  .  .  .|15  1 16  . 17|\\n+--------------+--------------+--------------+--------------+--------------+\\n| 4  .  .  .  .| .  .  .  . 15| . 12  .  . 25| 1  . 22  .  .| 3  .  .  . 14|\\n|23  .  .  . 19| .  2  .  .  .| .  .  .  .  .| .  .  . 10  .| .  .  .  7 11|\\n|25  .  . 18  .| .  .  .  .  .| . 20  .  .  .| .  .  .  .  .| .  .  .  . 22|\\n| 1  .  .  .  .| .  .  .  .  4|14 15  .  . 22| .  .  .  .  .| .  .  . 10  6|\\n|11  6 14  3  9| 5 22 17 20  8|13  7 16  1 10| 2  4 23 12 18|24 21 25 19 15|\\n+--------------+--------------+--------------+--------------+--------------+</code></pre><h1>sudokuの符号化(part 2)</h1>\\n<p>sudokuのルールは以下の4つ（これは再掲）：</p>\\n<ol>\\n<li>セルには{多くとも,少なくとも}一つの数を割り当てる（最多・最少単一制約）</li>\\n<li>行には全ての数をそれぞれ一回のみ割り当てる（行制約）</li>\\n<li>列には全ての数をそれぞれ一回のみ割り当てる（列制約）</li>\\n<li>ブロックには全ての数をそれぞれ一回のみ割り当てる（ブロック制約）</li>\\n</ol>\\n<p>ここで、2から4は以下のように解釈すべきである：</p>\\n<ol>\\n<li>行、列、ブロックなどのグループはあるセルに一つの数が割り当てられたら、他のセルにはその数は割り当てられない（<a href=\\"https://github.com/shnarazk/miracle_sudoku/commit/2f73c7205b7658658b154e1dfe2a54a48e054538\\">拡大最多単一制約</a>）</li>\\n<li>行、列、ブロックなどのグループは全ての数をそれぞれ少なくとも1回割り当てる（<a href=\\"https://github.com/shnarazk/miracle_sudoku/commit/1e41b14aecd58d02cb1a2087d3c239f661b67e5e\\">拡大最少単一制約</a>）</li>\\n</ol>\\n<p>この2番目が最初のプログラムにはなかった（negative assertionsからpositive assertionへの導出がなかったので、そりゃ探索空間が小さくならないわ）。\\n行制約の単純な解釈だと抜け落ちてしまう。\\nそれでもN=9, 16くらいだと問題にならないので、ブログなどでは出てこなくても当然かもしれない。</p>\\n<p>これが色々なソルバーの説明で出てくるXOR gateの話に繋がるのだろうか。</p>\\n","dir":"article/.json/2020","base":"2020-08-19-sudoku25.json","ext":".json","sourceBase":"2020-08-19-sudoku25.md","sourceExt":".md"}')}}]);