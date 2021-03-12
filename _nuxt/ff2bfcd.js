(window.webpackJsonp=window.webpackJsonp||[]).push([[110],{603:function(n){n.exports=JSON.parse('{"title":"UNSAT LOG, 2021, Jan.","subtitle":"Vol.2, No.1.","date":"2021-02-02T00:00:00.000Z","tags":["SAT","splr","unsatlog"],"banner":"/img/2021/02-02/banner.jpg","bodyContent":"# UNSATlog\\n\\n\\n## 202101\\n\\nあけまして[Splr-0.6.0](https://github.com/shnarazk/splr/releases/tag/splr-0.6.0)出ました。\\nそれどころか[0.6.1](https://github.com/shnarazk/splr/releases/tag/splr-0.6.1)も[0.6.2](https://github.com/shnarazk/splr/releases/tag/Splr-0.6.2)も出ました。\\nいやあ長かった。\\nその割にはむしろ圧倒的に性能劣化してしまってますが十分にベンチマークを回すだけのリソースがないんだからしょうがない。\\nどうでもいい「やってみたらよくなった」的な高速化は捨てる方向に舵を取ったのは長期的にはいい判断だと思いたい。\\n\\n## What’s Splr-0.6.0?\\n\\nSplr-0.6.0の売りは、\\n- 依存crateの削減、\\n- タイムアウトを増加させれば求解数が単調に増加すること、\\n- 将来のためにphase, stabilize, stageという構造を土台にしたこと、\\n- ベンチマークの結果主導のよくわからない（理論的根拠のない）ヒューリスティックスを捨てたこと\\nくらいだろうか。\\nおっと、その結果2倍くらい性能が悪くなったことも特筆しなければ。\\n\\n![](https://user-images.githubusercontent.com/997855/104808677-24d97080-582b-11eb-85af-d01fd161bafd.png)\\n\\nただし0.6.0のリリース直後に立て続けに出たpoint releaseによってまあ少しは改善しました。\\n0.6.1ではLBDの更新を、0.6.2では節削減のタイミングをstabilization のサイクルに合わせるようにしました（最近使用フラグをクリアする影響を除けば、はるかにゆっくり節を削減するので解けなくなることは原則としてないはず）。\\n遅くはなったけどだんだんよく鳴る法華の太鼓ってね。\\n\\n## ようこそ夏休み\\n\\n夏休みが終わった！ようやく宿題できました。\\nやっぱりLBDはいい尺度だったんだ。ということで納得。\\n\\n![](https://shnarazk.github.io/img/2021/01-26/UUF250-LBD-ave.png)\\n\\nなんというかファイル名は2020-XX-XXでタイムスタンプは202101という収拾がつかないことになってしまった。\\n反省。\\nさてこれで去年のcompetition のproceedings 読んで、cactus plot書いて、論文読んだら新シーズンの始まり。\\nその前に圏論の入門を読んでしまわなければ。\\n巣ごもり生活に抵抗なし。\\n\\n## その他\\n\\n大きめのSudokuに[挑戦](https://shnarazk.github.io/2021/2021-01-17-sudoku144/)。\\n144x144は対応できたけど、400x400はCNFの生成でギブアップ。\\nちょっと無理。\\n\\n## 今後の予定\\n\\n[Splr-0.6.3](https://github.com/shnarazk/splr/pull/72)がすぐにでも出せそうなのでまずはそこに集中します。\\nベンチマークをすると時間を延ばしても全然求解数が増えないので、問題数を絞る代わりにタイムアウトを十分に長くした設定で何が起きているか調べている最中。\\n結果に結びつくかはまだまだ不明だけどUUF250の求解速度が感動的なくらい速くなっている。\\nちょっと期待できるものになるのではなかろうか。","bodyHtml":"<h1>UNSATlog</h1>\\n<h2>202101</h2>\\n<p>あけまして<a href=\\"https://github.com/shnarazk/splr/releases/tag/splr-0.6.0\\">Splr-0.6.0</a>出ました。\\nそれどころか<a href=\\"https://github.com/shnarazk/splr/releases/tag/splr-0.6.1\\">0.6.1</a>も<a href=\\"https://github.com/shnarazk/splr/releases/tag/Splr-0.6.2\\">0.6.2</a>も出ました。\\nいやあ長かった。\\nその割にはむしろ圧倒的に性能劣化してしまってますが十分にベンチマークを回すだけのリソースがないんだからしょうがない。\\nどうでもいい「やってみたらよくなった」的な高速化は捨てる方向に舵を取ったのは長期的にはいい判断だと思いたい。</p>\\n<h2>What’s Splr-0.6.0?</h2>\\n<p>Splr-0.6.0の売りは、</p>\\n<ul>\\n<li>依存crateの削減、</li>\\n<li>タイムアウトを増加させれば求解数が単調に増加すること、</li>\\n<li>将来のためにphase, stabilize, stageという構造を土台にしたこと、</li>\\n<li>ベンチマークの結果主導のよくわからない（理論的根拠のない）ヒューリスティックスを捨てたこと\\nくらいだろうか。\\nおっと、その結果2倍くらい性能が悪くなったことも特筆しなければ。</li>\\n</ul>\\n<p><img src=\\"https://user-images.githubusercontent.com/997855/104808677-24d97080-582b-11eb-85af-d01fd161bafd.png\\" alt=\\"\\"></p>\\n<p>ただし0.6.0のリリース直後に立て続けに出たpoint releaseによってまあ少しは改善しました。\\n0.6.1ではLBDの更新を、0.6.2では節削減のタイミングをstabilization のサイクルに合わせるようにしました（最近使用フラグをクリアする影響を除けば、はるかにゆっくり節を削減するので解けなくなることは原則としてないはず）。\\n遅くはなったけどだんだんよく鳴る法華の太鼓ってね。</p>\\n<h2>ようこそ夏休み</h2>\\n<p>夏休みが終わった！ようやく宿題できました。\\nやっぱりLBDはいい尺度だったんだ。ということで納得。</p>\\n<p><img src=\\"https://shnarazk.github.io/img/2021/01-26/UUF250-LBD-ave.png\\" alt=\\"\\"></p>\\n<p>なんというかファイル名は2020-XX-XXでタイムスタンプは202101という収拾がつかないことになってしまった。\\n反省。\\nさてこれで去年のcompetition のproceedings 読んで、cactus plot書いて、論文読んだら新シーズンの始まり。\\nその前に圏論の入門を読んでしまわなければ。\\n巣ごもり生活に抵抗なし。</p>\\n<h2>その他</h2>\\n<p>大きめのSudokuに<a href=\\"https://shnarazk.github.io/2021/2021-01-17-sudoku144/\\">挑戦</a>。\\n144x144は対応できたけど、400x400はCNFの生成でギブアップ。\\nちょっと無理。</p>\\n<h2>今後の予定</h2>\\n<p><a href=\\"https://github.com/shnarazk/splr/pull/72\\">Splr-0.6.3</a>がすぐにでも出せそうなのでまずはそこに集中します。\\nベンチマークをすると時間を延ばしても全然求解数が増えないので、問題数を絞る代わりにタイムアウトを十分に長くした設定で何が起きているか調べている最中。\\n結果に結びつくかはまだまだ不明だけどUUF250の求解速度が感動的なくらい速くなっている。\\nちょっと期待できるものになるのではなかろうか。</p>\\n","dir":"article/.json/2021","base":"2021-02-02-UNSATlog.json","ext":".json","sourceBase":"2021-02-02-UNSATlog.md","sourceExt":".md"}')}}]);