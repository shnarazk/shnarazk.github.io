(window.webpackJsonp=window.webpackJsonp||[]).push([[108],{595:function(n){n.exports=JSON.parse('{"title":"UNSAT LOG, 2020, Dec.","subtitle":"Vol.1, No.12.","date":"2021-01-02T00:00:00.000Z","tags":["SAT","splr","unsatlog"],"banner":"/img/2021/01-02/banner.jpg","bodyContent":"# UNSATlog\\n\\n## 2020年振り返り\\n\\n結局0.5.1はリリースできませんでした。12月にやったことは\\n\\n- リフェーズ(re-phasing to best phase)に関するチューニング\\n- Sudoku 64への応用\\n- Advent of Code 2020への応用\\n\\nというあたり。\\n個人的には、初めてVec以外のデータ構造(HashMap)を導入したことが大きいです。\\nやはりリリース直前のベンチマークに時間を取られてしまったものの、ドキュメントの更新は終わっているので、ベンチマークさえいい結果、いやよくなくてもいいのでそこそこの結果が出ればリリースするつもりなので、最速で2021年元旦に出せるはず。\\n\\n## Best Phase Rewarding\\n\\nRephasingの実現手法として変数のrewardに反映させてみた。活性度に反映させるのではなく独立した項目にして線型結合（単に和をとるだけ）してみたら考えてみる価値がある結果になった。\\n混ぜない方がいい。やはり合議制のマルチエージェントの並行動作が行き着くところかもしれない。\\n全然ベンチマークでのベストを更新できてないので、これが本当によい手法と言えるかどうかは微妙なんだけど、それまでのもっとも解に近い点を足掛かりにして探索を進めるのはあるかもしれないし、まあ納得できる。\\n意外なのは極端な設定に振った方が結果が出ていること。\\nStabilizationでいえばstabilizationしっぱなしが一番いいという感じ。\\nなので現在のコードはマルチエージェント合議制に対しては否定的なんだがエビデンスを得るためには、色々試してみないといけない。\\nLuby数列を使ったStabilizationとのコード的な組み合わせ爆発もあるし、なかなかこれでいいという踏ん切りがつけられない。\\nということで一ヶ月では終わる話題ではなかったのでした。\\n\\n## Sudoku 64\\n\\nSudoku 64は[ここ](http://www.sudoku-download.net/sudoku_64x64.php)で見つけたもの。\\nSudoku 25が1秒以下で解けたこと、一意な解答保証のため結構初期状態で埋まったものだったことから、これもすぐ解けるのかと思ったら[20秒も掛かってしまった](https://shnarazk.github.io/2020/2020-12-18-sudoku64/)。\\nBCP 始める前に解けているのでこれは pre-processor が重いのだろう。外してみると8秒でした。\\n\\n```\\n$ splr --ELI 0  sudoku64.cnf\\nsudoku64.cnf                                262144,41048269 |time:     8.31\\n #conflict:          0, #decision:            0, #propagate:         262144 \\n  Assignment|#rem:   259891, #ass:     2253, #elm:        0, prg%:   0.8595 \\n      Clause|Remv:        0, LBD2:        0, Binc: 41029632, Perm: 41037005 \\n     Restart|#BLK:        0, #RST:        0, Lspn:        1, Lcyc:        0 \\n         EMA|tLBD:      NaN, tASG:      NaN, core:   262144, /dpc:      NaN \\n    Conflict|eLBD:     0.00, cnfl:     0.00, bjmp:     0.00, /ppc:      inf \\n        misc|elim:        0, cviv:        0, #vbv:        0, /cpr:      NaN \\n    Strategy|mode: Initial search phase before a main strategy\\n      Result|file: ./.ans_sudoku64.cnf\\ns SATISFIABLE: sudoku64.cnf\\n```\\n\\n## Advent of Code 2020\\n\\n[Advent of Code](https://adventofcode.com/)に初参加。面白かった。\\nSATで解けそうな問題が2つほどあってSplrを使ってみましたが、一勝一敗。\\n20日目のタイル組み合わせ問題では作ったCNFが10GBを超えてしまって、Splrにロードはできたものうんともすんとも言わなくなってしまいました。\\n結局その問題は単純にforループで回したら解けました。残念。\\n\\n## 今後の展望\\n\\nまずは0.6.0をリファクタリングバージョンとしてリリースしてしばらく勉強します。\\nそれから年2回のリリースが現実的なので5月位に0.6.0のパラメータチューニングあるいは過去のものとの再融合バージョンが出せたらいいなあ。\\nあ、夏休みの宿題もしなければ。","bodyHtml":"<h1>UNSATlog</h1>\\n<h2>2020年振り返り</h2>\\n<p>結局0.5.1はリリースできませんでした。12月にやったことは</p>\\n<ul>\\n<li>リフェーズ(re-phasing to best phase)に関するチューニング</li>\\n<li>Sudoku 64への応用</li>\\n<li>Advent of Code 2020への応用</li>\\n</ul>\\n<p>というあたり。\\n個人的には、初めてVec以外のデータ構造(HashMap)を導入したことが大きいです。\\nやはりリリース直前のベンチマークに時間を取られてしまったものの、ドキュメントの更新は終わっているので、ベンチマークさえいい結果、いやよくなくてもいいのでそこそこの結果が出ればリリースするつもりなので、最速で2021年元旦に出せるはず。</p>\\n<h2>Best Phase Rewarding</h2>\\n<p>Rephasingの実現手法として変数のrewardに反映させてみた。活性度に反映させるのではなく独立した項目にして線型結合（単に和をとるだけ）してみたら考えてみる価値がある結果になった。\\n混ぜない方がいい。やはり合議制のマルチエージェントの並行動作が行き着くところかもしれない。\\n全然ベンチマークでのベストを更新できてないので、これが本当によい手法と言えるかどうかは微妙なんだけど、それまでのもっとも解に近い点を足掛かりにして探索を進めるのはあるかもしれないし、まあ納得できる。\\n意外なのは極端な設定に振った方が結果が出ていること。\\nStabilizationでいえばstabilizationしっぱなしが一番いいという感じ。\\nなので現在のコードはマルチエージェント合議制に対しては否定的なんだがエビデンスを得るためには、色々試してみないといけない。\\nLuby数列を使ったStabilizationとのコード的な組み合わせ爆発もあるし、なかなかこれでいいという踏ん切りがつけられない。\\nということで一ヶ月では終わる話題ではなかったのでした。</p>\\n<h2>Sudoku 64</h2>\\n<p>Sudoku 64は<a href=\\"http://www.sudoku-download.net/sudoku_64x64.php\\">ここ</a>で見つけたもの。\\nSudoku 25が1秒以下で解けたこと、一意な解答保証のため結構初期状態で埋まったものだったことから、これもすぐ解けるのかと思ったら<a href=\\"https://shnarazk.github.io/2020/2020-12-18-sudoku64/\\">20秒も掛かってしまった</a>。\\nBCP 始める前に解けているのでこれは pre-processor が重いのだろう。外してみると8秒でした。</p>\\n<pre><code>$ splr --ELI 0  sudoku64.cnf\\nsudoku64.cnf                                262144,41048269 |time:     8.31\\n #conflict:          0, #decision:            0, #propagate:         262144 \\n  Assignment|#rem:   259891, #ass:     2253, #elm:        0, prg%:   0.8595 \\n      Clause|Remv:        0, LBD2:        0, Binc: 41029632, Perm: 41037005 \\n     Restart|#BLK:        0, #RST:        0, Lspn:        1, Lcyc:        0 \\n         EMA|tLBD:      NaN, tASG:      NaN, core:   262144, /dpc:      NaN \\n    Conflict|eLBD:     0.00, cnfl:     0.00, bjmp:     0.00, /ppc:      inf \\n        misc|elim:        0, cviv:        0, #vbv:        0, /cpr:      NaN \\n    Strategy|mode: Initial search phase before a main strategy\\n      Result|file: ./.ans_sudoku64.cnf\\ns SATISFIABLE: sudoku64.cnf\\n</code></pre>\\n<h2>Advent of Code 2020</h2>\\n<p><a href=\\"https://adventofcode.com/\\">Advent of Code</a>に初参加。面白かった。\\nSATで解けそうな問題が2つほどあってSplrを使ってみましたが、一勝一敗。\\n20日目のタイル組み合わせ問題では作ったCNFが10GBを超えてしまって、Splrにロードはできたものうんともすんとも言わなくなってしまいました。\\n結局その問題は単純にforループで回したら解けました。残念。</p>\\n<h2>今後の展望</h2>\\n<p>まずは0.6.0をリファクタリングバージョンとしてリリースしてしばらく勉強します。\\nそれから年2回のリリースが現実的なので5月位に0.6.0のパラメータチューニングあるいは過去のものとの再融合バージョンが出せたらいいなあ。\\nあ、夏休みの宿題もしなければ。</p>\\n","dir":"article/.json/2021","base":"2021-01-02-UNSATlog.json","ext":".json","sourceBase":"2021-01-02-UNSATlog.md","sourceExt":".md"}')}}]);