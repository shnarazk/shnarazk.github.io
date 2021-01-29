(window.webpackJsonp=window.webpackJsonp||[]).push([[88],{575:function(n){n.exports=JSON.parse('{"title":"Similarity of Clauses","subtitle":"夏休み実験室","date":"2021-01-26T00:00:00.000Z","tags":["SAT","splr"],"banner":"https://images.unsplash.com/photo-1483528237748-d9d8b5cae06d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80","bodyContent":"**cover image: https://unsplash.com/photos/UsSfqYdR64Q**\\n\\n動的なリスタートは本当に有効なのだろうか？\\n自分がやってきた種々の実験結果からはLubyリスタートとの差は（有意）にあるように思うが、\\n一方でせいぜい定数倍の差のようにも思える。\\nパラメータを増やせば増やすほど手が届かない部分が増えてしまうので、もうそろそろ色々カウンターを突っ込んだりするくらいならLubyでいいのではいう方向にかなり傾いている。\\nそもそもGlucose流のLBDのEMAを元にしたforce restartが有効であるためには学習節のよさは独立分布ではないことが前提なんだけど、これは本当なんだだろうか？\\nどこかで評価してあっただろうか？\\n手っ取り早くブランチ切って自分でやってみた。\\n\\n- 実験対象: UUF250 100問\\n- EMA補正を掛けた Slpr-0.6.2 で rst-lbd-len を色々変えて、学習節が追加されるたびに(LBDのEMA, 新学習節のLBD)を出力。\\n\\n```\\n# 2021 branchを使用\\n$ parallel \'splrl-lbd {}\' ::: uuf250*.cnf\\n$ cargo run --bin ??? < uuf*.csv > LBDn.csv　#　新学習節LBDの分布を平均値に置き換え\\n$ 適当にプロット\\n```\\n\\n長さを24（デフォルト）,5, 3と変えて、LBDのEMAに対する新規学習節のLBDをプロットしてみたのが以下の図。\\n\\n![](/img/2021/01-26/UUF250-LBD-ave.png)\\n\\n極めて強い相関が得られた。ちなみに横軸を矛盾発生の決定レベルでプロットすると以下のようになる。\\n\\n![](/img/2021/01-26/UUF250-cDL-ave.png)\\n\\n![](/img/2021/01-26/UUF250-cDL-heatmap.png)\\n\\n![](/img/2021/01-26/UUF250-rlt0-heatmap.png)\\n\\n![](/img/2021/01-26/UUF250-norestart-heatmap.png)\\n\\n\\nUNDER CONSTRUCTION ここから先は全部取り替え。\\n\\n\\nうーむ。つまり動的リスタートは合理的であると。\\n\\nなんちゃって。\\n\\n高いLBDが出るためにはそもそも決定レベルがそれ以上にないといけないわけで、EMAが高ければそういう決定レベルに位置することを意味しているのだから、平均だか分散だかが大きくなるのは当たり前の話。\\nむしろ長さが24以下の場合には傾き1を下回っており、長さ24でやや1より大きな値になるということが重要なのでは。\\nしかしそれも十分に長期間のサンプリングをするならば、この間、動的リスタートの当然の挙動としてリスタートを掛けないので矛盾解消による決定レベルの変動はあるものの（うーん、どちらかと言えば）決定レベルは増加の傾向にあるはずなので、後から生成される節のLBDが大きいのは当然である、と言えるのでは。\\nここまでは、大きな節が出てきてもそれは決定レベルが高いことの副作用であって、しょうがないのレベルという話。\\n\\nなので決定レベルが低いところへ遷移できればリスタートは意味がある。（つまりLBDは決定レベルと高い相関を持つ観測変数！？）\\nつまり「リスタートを掛けても結局同じような学習節しか出てこない」と言えるのであれば動的リスタートの合理性はかなり薄まる。言えないのであれば、マルコフ性はあると言わざるを得ない。\\n\\n1. そういうソルバーを作って比較してみよう。\\n1. リスタート回数を極端に増やしたものは、そうでないものと有意な差が出るのか？\\n\\nで、追加実験だ：\\n\\n\\n--------------------------------------------------------\\n\\n# イントロとベルリンの壁\\n\\n論文書くのは仕事じゃない。しかし一年に一度くらいは開発ではなくて、文章をまとめる一ヶ月があってもいいかもね。そもそも今年もCompetitionに出しそびれたし。それに夏といえば、宿題やるのが日本の文化。\\n9月1日提出に間に合うようになんかしよう。爆音で音楽聴きながらlatex的なことをしよう。\\n\\n# 2020-07-24\\n\\n* 旧題: Restart as A Multi-Armed Bandid Problem\\n* 新題: Lives of Clauses\\n\\n# 2020-07-27\\n\\n0.4.2がいい結果を出しそうなので、それをリリースしてから、なぜ0.4.2がいいのかを説明できるようなものにしよう。\\n\\"Lives of Clauses\\"はいいタイトル。\\n\\n# 2020-08-12\\n\\nSplr-0.4.2のリリースがずるずると延びてしまっていまだにとりかかれてない。。。。\\nうーん、自分で言い出したくせに8月31日の1日でやっつけることになるのか。\\nコロナのせいにできるような言い訳を考えておこう。。。\\n\\n# 2020-08-24\\n\\nあと数日でSplr-0.4.2 改め Splr-0.5.0 がリリースできる。\\nそして、もう数日しか夏休みは残ってないんですけどどうしましょう。\\n\\n# 2020-09-01\\n\\n今年の夏休みは9月下旬にはじまるという話を聞いたので、まだ手をつけない。\\n\\n# 2021-01-13\\n\\nそろそろ手が付けられそうになってきたので、テーマ案を考える。\\n\\n- 案1: 学習節の一生\\n- 案2: 意外に影響が大きいvivicationの効果測定\\n\\nずっと案1のつもりだったけど、今日急に案2もいいかもと思い出した。\\nどちらにしろ今週中には始めよう。\\n夏休みの宿題を1月に始めるという意味で非常事態を宣言するのだ。\\n\\n# 2021-01-14\\n\\n[Splr-0.6.0](https://github.com/shnarazk/splr/commit/55c6161a17b18752d8c33f9a5de9ae8e25cc88fc) リリースした。夏休み開始。 \\n\\n# 2021-01-18\\n\\n0.6.0はリリースしたけどどうせなら0.6.2をリリースしてから開始しよう。明日の予定。テーマはマルコフ性。","bodyHtml":"<p><strong>cover image: https://unsplash.com/photos/UsSfqYdR64Q</strong></p>\\n<p>動的なリスタートは本当に有効なのだろうか？\\n自分がやってきた種々の実験結果からはLubyリスタートとの差は（有意）にあるように思うが、\\n一方でせいぜい定数倍の差のようにも思える。\\nパラメータを増やせば増やすほど手が届かない部分が増えてしまうので、もうそろそろ色々カウンターを突っ込んだりするくらいならLubyでいいのではいう方向にかなり傾いている。\\nそもそもGlucose流のLBDのEMAを元にしたforce restartが有効であるためには学習節のよさは独立分布ではないことが前提なんだけど、これは本当なんだだろうか？\\nどこかで評価してあっただろうか？\\n手っ取り早くブランチ切って自分でやってみた。</p>\\n<ul>\\n<li>実験対象: UUF250 100問</li>\\n<li>EMA補正を掛けた Slpr-0.6.2 で rst-lbd-len を色々変えて、学習節が追加されるたびに(LBDのEMA, 新学習節のLBD)を出力。</li>\\n</ul>\\n<pre><code># 2021 branchを使用\\n$ parallel \'splrl-lbd {}\' ::: uuf250*.cnf\\n$ cargo run --bin ??? &lt; uuf*.csv &gt; LBDn.csv　#　新学習節LBDの分布を平均値に置き換え\\n$ 適当にプロット\\n</code></pre>\\n<p>長さを24（デフォルト）,5, 3と変えて、LBDのEMAに対する新規学習節のLBDをプロットしてみたのが以下の図。</p>\\n<p><img src=\\"/img/2021/01-26/UUF250-LBD-ave.png\\" alt=\\"\\"></p>\\n<p>極めて強い相関が得られた。ちなみに横軸を矛盾発生の決定レベルでプロットすると以下のようになる。</p>\\n<p><img src=\\"/img/2021/01-26/UUF250-cDL-ave.png\\" alt=\\"\\"></p>\\n<p><img src=\\"/img/2021/01-26/UUF250-cDL-heatmap.png\\" alt=\\"\\"></p>\\n<p><img src=\\"/img/2021/01-26/UUF250-rlt0-heatmap.png\\" alt=\\"\\"></p>\\n<p><img src=\\"/img/2021/01-26/UUF250-norestart-heatmap.png\\" alt=\\"\\"></p>\\n<p>UNDER CONSTRUCTION ここから先は全部取り替え。</p>\\n<p>うーむ。つまり動的リスタートは合理的であると。</p>\\n<p>なんちゃって。</p>\\n<p>高いLBDが出るためにはそもそも決定レベルがそれ以上にないといけないわけで、EMAが高ければそういう決定レベルに位置することを意味しているのだから、平均だか分散だかが大きくなるのは当たり前の話。\\nむしろ長さが24以下の場合には傾き1を下回っており、長さ24でやや1より大きな値になるということが重要なのでは。\\nしかしそれも十分に長期間のサンプリングをするならば、この間、動的リスタートの当然の挙動としてリスタートを掛けないので矛盾解消による決定レベルの変動はあるものの（うーん、どちらかと言えば）決定レベルは増加の傾向にあるはずなので、後から生成される節のLBDが大きいのは当然である、と言えるのでは。\\nここまでは、大きな節が出てきてもそれは決定レベルが高いことの副作用であって、しょうがないのレベルという話。</p>\\n<p>なので決定レベルが低いところへ遷移できればリスタートは意味がある。（つまりLBDは決定レベルと高い相関を持つ観測変数！？）\\nつまり「リスタートを掛けても結局同じような学習節しか出てこない」と言えるのであれば動的リスタートの合理性はかなり薄まる。言えないのであれば、マルコフ性はあると言わざるを得ない。</p>\\n<ol>\\n<li>そういうソルバーを作って比較してみよう。</li>\\n<li>リスタート回数を極端に増やしたものは、そうでないものと有意な差が出るのか？</li>\\n</ol>\\n<p>で、追加実験だ：</p>\\n<hr>\\n<h1>イントロとベルリンの壁</h1>\\n<p>論文書くのは仕事じゃない。しかし一年に一度くらいは開発ではなくて、文章をまとめる一ヶ月があってもいいかもね。そもそも今年もCompetitionに出しそびれたし。それに夏といえば、宿題やるのが日本の文化。\\n9月1日提出に間に合うようになんかしよう。爆音で音楽聴きながらlatex的なことをしよう。</p>\\n<h1>2020-07-24</h1>\\n<ul>\\n<li>旧題: Restart as A Multi-Armed Bandid Problem</li>\\n<li>新題: Lives of Clauses</li>\\n</ul>\\n<h1>2020-07-27</h1>\\n<p>0.4.2がいい結果を出しそうなので、それをリリースしてから、なぜ0.4.2がいいのかを説明できるようなものにしよう。\\n&quot;Lives of Clauses&quot;はいいタイトル。</p>\\n<h1>2020-08-12</h1>\\n<p>Splr-0.4.2のリリースがずるずると延びてしまっていまだにとりかかれてない。。。。\\nうーん、自分で言い出したくせに8月31日の1日でやっつけることになるのか。\\nコロナのせいにできるような言い訳を考えておこう。。。</p>\\n<h1>2020-08-24</h1>\\n<p>あと数日でSplr-0.4.2 改め Splr-0.5.0 がリリースできる。\\nそして、もう数日しか夏休みは残ってないんですけどどうしましょう。</p>\\n<h1>2020-09-01</h1>\\n<p>今年の夏休みは9月下旬にはじまるという話を聞いたので、まだ手をつけない。</p>\\n<h1>2021-01-13</h1>\\n<p>そろそろ手が付けられそうになってきたので、テーマ案を考える。</p>\\n<ul>\\n<li>案1: 学習節の一生</li>\\n<li>案2: 意外に影響が大きいvivicationの効果測定</li>\\n</ul>\\n<p>ずっと案1のつもりだったけど、今日急に案2もいいかもと思い出した。\\nどちらにしろ今週中には始めよう。\\n夏休みの宿題を1月に始めるという意味で非常事態を宣言するのだ。</p>\\n<h1>2021-01-14</h1>\\n<p><a href=\\"https://github.com/shnarazk/splr/commit/55c6161a17b18752d8c33f9a5de9ae8e25cc88fc\\">Splr-0.6.0</a> リリースした。夏休み開始。</p>\\n<h1>2021-01-18</h1>\\n<p>0.6.0はリリースしたけどどうせなら0.6.2をリリースしてから開始しよう。明日の予定。テーマはマルコフ性。</p>\\n","dir":"article/.json/2020","base":"2020-07-18-summer-homework.json","ext":".json","sourceBase":"2020-07-18-summer-homework.md","sourceExt":".md"}')}}]);