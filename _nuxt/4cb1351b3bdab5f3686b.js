(window.webpackJsonp=window.webpackJsonp||[]).push([[58],{530:function(n){n.exports=JSON.parse('{"title":"UNSAT LOG, 2020, Jan.","subtitle":"Vol.1, No.1.","date":"2020-01-15T00:00:00.000Z","tags":["SAT","splr","unsatlog"],"bodyContent":"# 正月も再検討\\n\\n年末から1月中旬までのSATソルバー開発記録unsatlogです。ひたすら再検討。同じところをグルグル回っているようなもので、今回も特に進展なしでした。\\n\\n## 極性に関する論文読んだ\\n\\nインパクトのあるタイトルなので読んでみたが、残念なことに系統的ソルバーではなく統計的ソルバーの話。ランダムウォーク的な精錬過程において極性の分散がすごくいい尺度になるという話。論文には全く系統的ソルバーへの言及がないのはうまくいかなかったからだろうか。すごくわかる気がする。以前phaseを数ビットに拡張する話があったのでEMA→偏差に替えるのはいいかもしれない。\\n\\nと思ってSplrで実装実験したが、意外に結果が出ないもんだ。偏差が大きいものを優先するのはいいと思うのだが結果が出ない。偏差総和でearly restartをかけるのもありそうだが手をつけてない。\\n\\nさらにこの考えから派生して変数ごとの矛盾の頻度(frequency of conflict; FOC)から現在の「問題」の難しさを判定してリスタートをかける方法に変化していった。が、こちらも結果が出なかった。やはり過去の履歴から将来の予測をするのは大変に難しい（マルコフ的な未来予測が可能ならNP完全ではないか）。さて、ではなぜLBDによるリスタートはうまくいくのだろう。問題の難しさではなく得られた知識そのものの評価だからだろうか。知識の有効性のマルコフ性？疑問だ。\\n\\n## リスタート間隔再検討\\n\\nどうしてdeep searchが必要なのかずっと疑問だったが、これはリスタートパラメータの動的チューニングをしているせいかもしれない。固定パラメータだとリスタートもブロックも起きない長いスパンが観測される。Splrは皮相的にパラメータの値を変えて無理矢理リスタートを起こしているのでそのような「リスタート停滞期間」を潰していた。そもそも探索のよさの評価を動的に変えていいものだろうか？筋が悪かったかも。評価を変えるのではなく感受性のスケールを変えるだけがいいのかもしれない。また、時間軸方向の利得最大化がLuby列ならこれはdeep searchの代わりになるかもと思ったがよく検討していない。\\n\\nでかなりよさそうなものでベンチマークしてみたがやっぱり圧倒的な差が付いてしまう。なんでこのdeep search はこんなにいいのだ？また半年ほど悩む事になりそうだ。\\n\\n## CHB再検討\\n\\n今回の目玉。リリースノートではSplr-0.2.1は修正CHBを使っていることになっているけど、改めて論文と見比べてみると随分違う。これをCHBと言っていいものだろうか。リリースノートを修正しなければいけないかも。という事で論文を見ながら再実装してみた。\\n\\n- Liang, J. H., Ganesh, V., Poupart, P. & Czarnecki, K.: Learning Rate Based Branching Heuristic for SAT Solvers, 2016.\\n- Liang, J. H., Ganesh, V., Poupart, P., & Czarnecki, K.: Exponential Recency Weighted Average Branching Heuristic for SAT Solvers, 2016\\n\\n何度も実装ミスを繰り返しながら論文に忠実にCHB、その延長のLRBを実装して、deep searchなしでマイクロベンチマークでは若干の性能劣化で済むようになったが、UNSAT問題が全然解けない。そしてベンチマークではどうやっても論文のようないい結果が出なかった。deep searchを抜いたのが悪かったのかCHB の実装が悪いのか？\\n\\nまた、LRBはCHBにReason Side Rate(RSR)とlocality extensionのアイデアを追加したもの。全部組み合わせた場合が一番いいことになっているのだけど、それらに関する実験結果が（またもや）それを支持しない。locality extensionの計算コストはバカにならないんじゃないか？これは遅延評価でいいんじゃないか、splr-0.2.1がやっているような。。。\\n\\nということでほぼ一ヶ月検討した結果、0.2.1の実装はやはりCHBの一種であり（何といってもEMA的なdecayを掛けているし）、それなりに同じ効果を既に得られているという結論を出さざるを得ない。locality extensionは自然に実装されている。RSRの判断はまだついてない。\\n\\n## 単位伝播時の監視リテラルへの集約\\n\\nこの手のヒューリスティックの検討に疲れたので軽いアイデアとしてpropagate中の未矛盾変数探索において最初に見つかったリテラルではなく、活性度が一番高いリテラル変数を選ぶ手法を思いついたのだが（活性度が高い変数は早く試されるので矛盾距離は短くなるはず）、これもうまくいかない。なぜ？探索コストの増大では説明できないことが起きている。このアイデアギブアップすべきかもう少し検討すべきか？\\n\\n## まとめ\\n\\nということで引き続き結論を出すことが求められているのは：\\n\\n- RSRの妥当性\\n- リスタートパラメータ固定によるdeep search削除の可能性\\n\\nやりたいことは\\n\\n- 実装レベルの改善：var heapはもっと軽量なものにできないだろうか。\\n- 時間があれば監視リテラルへの集約の効果の検討\\n\\nといったところだろうか。なんか全然進まない。","bodyHtml":"<h1>正月も再検討</h1>\\n<p>年末から1月中旬までのSATソルバー開発記録unsatlogです。ひたすら再検討。同じところをグルグル回っているようなもので、今回も特に進展なしでした。</p>\\n<h2>極性に関する論文読んだ</h2>\\n<p>インパクトのあるタイトルなので読んでみたが、残念なことに系統的ソルバーではなく統計的ソルバーの話。ランダムウォーク的な精錬過程において極性の分散がすごくいい尺度になるという話。論文には全く系統的ソルバーへの言及がないのはうまくいかなかったからだろうか。すごくわかる気がする。以前phaseを数ビットに拡張する話があったのでEMA→偏差に替えるのはいいかもしれない。</p>\\n<p>と思ってSplrで実装実験したが、意外に結果が出ないもんだ。偏差が大きいものを優先するのはいいと思うのだが結果が出ない。偏差総和でearly restartをかけるのもありそうだが手をつけてない。</p>\\n<p>さらにこの考えから派生して変数ごとの矛盾の頻度(frequency of conflict; FOC)から現在の「問題」の難しさを判定してリスタートをかける方法に変化していった。が、こちらも結果が出なかった。やはり過去の履歴から将来の予測をするのは大変に難しい（マルコフ的な未来予測が可能ならNP完全ではないか）。さて、ではなぜLBDによるリスタートはうまくいくのだろう。問題の難しさではなく得られた知識そのものの評価だからだろうか。知識の有効性のマルコフ性？疑問だ。</p>\\n<h2>リスタート間隔再検討</h2>\\n<p>どうしてdeep searchが必要なのかずっと疑問だったが、これはリスタートパラメータの動的チューニングをしているせいかもしれない。固定パラメータだとリスタートもブロックも起きない長いスパンが観測される。Splrは皮相的にパラメータの値を変えて無理矢理リスタートを起こしているのでそのような「リスタート停滞期間」を潰していた。そもそも探索のよさの評価を動的に変えていいものだろうか？筋が悪かったかも。評価を変えるのではなく感受性のスケールを変えるだけがいいのかもしれない。また、時間軸方向の利得最大化がLuby列ならこれはdeep searchの代わりになるかもと思ったがよく検討していない。</p>\\n<p>でかなりよさそうなものでベンチマークしてみたがやっぱり圧倒的な差が付いてしまう。なんでこのdeep search はこんなにいいのだ？また半年ほど悩む事になりそうだ。</p>\\n<h2>CHB再検討</h2>\\n<p>今回の目玉。リリースノートではSplr-0.2.1は修正CHBを使っていることになっているけど、改めて論文と見比べてみると随分違う。これをCHBと言っていいものだろうか。リリースノートを修正しなければいけないかも。という事で論文を見ながら再実装してみた。</p>\\n<ul>\\n<li>Liang, J. H., Ganesh, V., Poupart, P. &amp; Czarnecki, K.: Learning Rate Based Branching Heuristic for SAT Solvers, 2016.</li>\\n<li>Liang, J. H., Ganesh, V., Poupart, P., &amp; Czarnecki, K.: Exponential Recency Weighted Average Branching Heuristic for SAT Solvers, 2016</li>\\n</ul>\\n<p>何度も実装ミスを繰り返しながら論文に忠実にCHB、その延長のLRBを実装して、deep searchなしでマイクロベンチマークでは若干の性能劣化で済むようになったが、UNSAT問題が全然解けない。そしてベンチマークではどうやっても論文のようないい結果が出なかった。deep searchを抜いたのが悪かったのかCHB の実装が悪いのか？</p>\\n<p>また、LRBはCHBにReason Side Rate(RSR)とlocality extensionのアイデアを追加したもの。全部組み合わせた場合が一番いいことになっているのだけど、それらに関する実験結果が（またもや）それを支持しない。locality extensionの計算コストはバカにならないんじゃないか？これは遅延評価でいいんじゃないか、splr-0.2.1がやっているような。。。</p>\\n<p>ということでほぼ一ヶ月検討した結果、0.2.1の実装はやはりCHBの一種であり（何といってもEMA的なdecayを掛けているし）、それなりに同じ効果を既に得られているという結論を出さざるを得ない。locality extensionは自然に実装されている。RSRの判断はまだついてない。</p>\\n<h2>単位伝播時の監視リテラルへの集約</h2>\\n<p>この手のヒューリスティックの検討に疲れたので軽いアイデアとしてpropagate中の未矛盾変数探索において最初に見つかったリテラルではなく、活性度が一番高いリテラル変数を選ぶ手法を思いついたのだが（活性度が高い変数は早く試されるので矛盾距離は短くなるはず）、これもうまくいかない。なぜ？探索コストの増大では説明できないことが起きている。このアイデアギブアップすべきかもう少し検討すべきか？</p>\\n<h2>まとめ</h2>\\n<p>ということで引き続き結論を出すことが求められているのは：</p>\\n<ul>\\n<li>RSRの妥当性</li>\\n<li>リスタートパラメータ固定によるdeep search削除の可能性</li>\\n</ul>\\n<p>やりたいことは</p>\\n<ul>\\n<li>実装レベルの改善：var heapはもっと軽量なものにできないだろうか。</li>\\n<li>時間があれば監視リテラルへの集約の効果の検討</li>\\n</ul>\\n<p>といったところだろうか。なんか全然進まない。</p>\\n","dir":"article/.json/2020","base":"2020-01-15-SplrDL.json","ext":".json","sourceBase":"2020-01-15-SplrDL.md","sourceExt":".md"}')}}]);