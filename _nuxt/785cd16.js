(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{587:function(n){n.exports=JSON.parse('{"title":"UNSAT LOG, 2020, Aug.","subtitle":"Vol.1, No.8.","date":"2020-09-12T00:00:00.000Z","tags":["SAT","splr","unsatlog"],"banner":"/img/2020/09-12/banner.jpg","bodyContent":"## 8月の目玉\\n\\n[Splr-0.5.0](https:://crates.io/crates/splr/)をリリースしました。表立ってはclause vilification の導入です。一方裏ではリスタートの尺度がオリジナルなものへ変更されました。これは今のところ充分な評価ができてないのでChangelogではundocumentedで済ませたという代物。宿題です。\\n\\n## Glucose-4.1との比較\\n\\n前回, Glucoseと比べて全然遅いという話をしましたが、0.5.0はタイムアウトを100秒に設定するとoutperformできるようになりました。結構早い段階でこの成果は出ていたのですが、タイムアウトを500秒に伸ばすと100秒での求解数が10近くも落ちてしまうため、本当にいいのかどうかなんとも言えない。これはSplrがタイムアウト時間を考慮して{pre, in}-processorのタイムスロットを決めているため、ある時間で解ける問題がそれより長いタイムアウト設定で解ける保証がないことから生じた問題なので、本質的には仕方ないとしか言いようがありません。一方でこれはprocessorに与える時間に関するヒューリスティックスに改善の余地があることを示しているようにも思え、ついついその試行錯誤に時間を掛けてしまったせいでリリースが一ヶ月は延びる羽目になってしまいました。適当なところで打ち切ってパラメータチューニングは0.5.1にしようと思ったのですが、これまたパラメータチューニングで済むかどうか、やってみないことにはなんとも。\\nで結局タイムアウト500秒域では多分Glucoseを上回ることはないでしょう。やっぱりなんか根本のところで王道を外しているようにしか見えない。\\n\\n## リスタートについて\\n\\n[Clause vivification](/2020/2020-08-19-splr-with-vivification/)とリフレーズの探求が0.5.0の主たる変更点ですが、後者を色々と試していて、特に一体Stableはどういう時に必要とされるのかを考えていて、結局オリジナルな尺度をリスタートモジュールに導入することになってしまいました。\\n\\n* 学習節のLBDが大きくてもそれがリテラル断定(assertionの訳です）への道のりの途中ならそれを許容してもいいだろう。つまり非常に頻繁に活性度の更新が起きているリテラルが存在する間は（それは今大きな問題になっている重要なリテラルなのでその解決を優先するため）リスタートを抑制してもいいんじゃなかろうか。\\n* 学習節のLBDの良さはその相対地で決まるのではなく、矛盾解析に使われるかどうかで決まるのではなかろうか。直近の傾向が矛盾解析中に出てきた最大LSBのEMAより大きければそれはリスタートに値するのでは。\\n\\nなんだかどちらもよさそうに思えて、実際実験結果もこれを棄却できてなさそうなので試しに入れてみました。\\n\\n## 9月の抱負\\n\\n生活が忙しくなって、さらに体力減少中なのでペースは落ちるだろうけど、processorのもうちょっとよい実行契機を見つけたい。これだけやって0.5.1を出したいものです。そしてSC2020に更新しなければ。","bodyHtml":"<h2>8月の目玉</h2>\\n<p><a href=\\"https:://crates.io/crates/splr/\\">Splr-0.5.0</a>をリリースしました。表立ってはclause vilification の導入です。一方裏ではリスタートの尺度がオリジナルなものへ変更されました。これは今のところ充分な評価ができてないのでChangelogではundocumentedで済ませたという代物。宿題です。</p>\\n<h2>Glucose-4.1との比較</h2>\\n<p>前回, Glucoseと比べて全然遅いという話をしましたが、0.5.0はタイムアウトを100秒に設定するとoutperformできるようになりました。結構早い段階でこの成果は出ていたのですが、タイムアウトを500秒に伸ばすと100秒での求解数が10近くも落ちてしまうため、本当にいいのかどうかなんとも言えない。これはSplrがタイムアウト時間を考慮して{pre, in}-processorのタイムスロットを決めているため、ある時間で解ける問題がそれより長いタイムアウト設定で解ける保証がないことから生じた問題なので、本質的には仕方ないとしか言いようがありません。一方でこれはprocessorに与える時間に関するヒューリスティックスに改善の余地があることを示しているようにも思え、ついついその試行錯誤に時間を掛けてしまったせいでリリースが一ヶ月は延びる羽目になってしまいました。適当なところで打ち切ってパラメータチューニングは0.5.1にしようと思ったのですが、これまたパラメータチューニングで済むかどうか、やってみないことにはなんとも。\\nで結局タイムアウト500秒域では多分Glucoseを上回ることはないでしょう。やっぱりなんか根本のところで王道を外しているようにしか見えない。</p>\\n<h2>リスタートについて</h2>\\n<p><a href=\\"/2020/2020-08-19-splr-with-vivification/\\">Clause vivification</a>とリフレーズの探求が0.5.0の主たる変更点ですが、後者を色々と試していて、特に一体Stableはどういう時に必要とされるのかを考えていて、結局オリジナルな尺度をリスタートモジュールに導入することになってしまいました。</p>\\n<ul>\\n<li>学習節のLBDが大きくてもそれがリテラル断定(assertionの訳です）への道のりの途中ならそれを許容してもいいだろう。つまり非常に頻繁に活性度の更新が起きているリテラルが存在する間は（それは今大きな問題になっている重要なリテラルなのでその解決を優先するため）リスタートを抑制してもいいんじゃなかろうか。</li>\\n<li>学習節のLBDの良さはその相対地で決まるのではなく、矛盾解析に使われるかどうかで決まるのではなかろうか。直近の傾向が矛盾解析中に出てきた最大LSBのEMAより大きければそれはリスタートに値するのでは。</li>\\n</ul>\\n<p>なんだかどちらもよさそうに思えて、実際実験結果もこれを棄却できてなさそうなので試しに入れてみました。</p>\\n<h2>9月の抱負</h2>\\n<p>生活が忙しくなって、さらに体力減少中なのでペースは落ちるだろうけど、processorのもうちょっとよい実行契機を見つけたい。これだけやって0.5.1を出したいものです。そしてSC2020に更新しなければ。</p>\\n","dir":"article/.json/2020","base":"2020-09-12-UNSATlog.json","ext":".json","sourceBase":"2020-09-12-UNSATlog.md","sourceExt":".md"}')}}]);