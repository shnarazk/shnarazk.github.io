__NUXT_JSONP__("/2020/2020-02-11-UNSATlog", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"UNSAT LOG, 2020, Feb.",subtitle:"Vol.1, No.2.",date:"2020-02-11T00:00:00.000Z",tags:["SAT","splr","unsatlog"],bodyContent:"## はじめに\n\n今期のビッグイベントはなんと言ってもSplr-0.3.0のリリース。めでたい。\n\n## Splr-0.3.0リリース\n\n三ヶ月の開発期間を経て2月10日にようやくSplr-0.3.0をリリースすることができました。その更新内容から大事な部分を拾ってみると、\n\n1. 変数選択機構を最新のLearnt Rate based Branching with Reson Side Rewardingに基づくものに変更したこと。なお更新の単位は矛盾ではなく割当てから未割り当てまでで考えることにした。これは単なるアイデア。\n1. タイムアウト用のスレッドを導入してEliminatorを残り時間を考えて自発的に中断するようにしたこと。こうしないと**大きな問題では何時間でも変数除去をやっていた**ようだ。\n1. 変数活性度の減衰率が意外に重要だということがわかったのでやや小さめにしたこと。これは小さくする、すなわち学習による更新が稀にしか起きなくすることで、結局リスタート時に大きな変化を生じさせなくする効果があり、それはつまり**deep searchモードでリスタート発生を抑えようとしたのと同じような効果がある**らしいことがわかったから。このパラメータだけで求解数が大きく違う。またdeep searchの理解が少し進んだので、deep saerchの重みを減らした（期間の減少、定期的な通常モードへの復帰、クールダウン期間の減少など）。\n1. あとは標準的なtraitを様々導入したこと。サブモジュール間のインターフェイスが変わったので0.2.2ではなく0.3.0にナンバリング。\n\nこれで6000行のプログラムの2000行ほどが更新されることになったし、質的にも結構大きな修正だった。多分この文章以外にはどこにも書かないだろうけど、上記強調部分は眼から鱗の出来事だった。\n\n## ChronoBTの試み\n\n前回から0.2.2の目玉として考えてきたChronoBTの実装は論文をちゃんと読んでみると、バックトラック時の再割り当ての手間を省くのは主目的ではなく、バックトラックコストが少ない学習節の作成から得られるむしろ副作用のようなものであることがわかった。ということでこれまでの安直な実装を目指していたブランチは全て見当外れ。0.3.0のリリース後に論文見ながら一からやり直すことになった。これが0.3.1の主目標になるでしょう。\n\n## ベンチマーク変更\n\nベンチマークをSAT Competition 2018ものからSAT RACE 2019に変更しました。過去のデータが使えなくなるのは大きいので延び延びになっていたけどようやく重い腰をあげた。下図が去年の公式データの結果のカクタスプロット（2つほどなんか変なデータがあったので除去が必要だった）。やはり500秒くらいで既にある程度の傾向は見て取れる。現実的な到達目標にしようと思う。これなら並列実行すれば今の環境でも1日掛からないくらいで1回のベンチマークを終わらせることができるし。\n\n![](\u002Fimg\u002F2020\u002F02-11\u002Fcactus.png)\n\nさて、ここに（並列実行の影響補正用の適当なスケーリングありで）Splr-0.3.0でやってみた結果を追加してみると、絶望するほどじゃないじゃん。少なくとも下位グループの中位には位置づけできそうな感じだ。\n\nあとはChronoBTを導入することで、どこまで伸ばすことができるか。期待しよう。\n\nさらにJupyter labを導入しました。まあ慣れてしまえばいいことでRもPythonも同じようなもんだな。Pythonでプログラミングするつもりはないけど、まあ21世紀のPostScriptのようなもんだろう、図形表示言語という意味で。Rustカーネルも入れてみたけど、使いところがないなあ。\n\n## 結び\n\nさあChronoBTの実装だ！下位グループから脱却できるかなあ。",bodyHtml:"\u003Ch2\u003Eはじめに\u003C\u002Fh2\u003E\n\u003Cp\u003E今期のビッグイベントはなんと言ってもSplr-0.3.0のリリース。めでたい。\u003C\u002Fp\u003E\n\u003Ch2\u003ESplr-0.3.0リリース\u003C\u002Fh2\u003E\n\u003Cp\u003E三ヶ月の開発期間を経て2月10日にようやくSplr-0.3.0をリリースすることができました。その更新内容から大事な部分を拾ってみると、\u003C\u002Fp\u003E\n\u003Col\u003E\n\u003Cli\u003E変数選択機構を最新のLearnt Rate based Branching with Reson Side Rewardingに基づくものに変更したこと。なお更新の単位は矛盾ではなく割当てから未割り当てまでで考えることにした。これは単なるアイデア。\u003C\u002Fli\u003E\n\u003Cli\u003Eタイムアウト用のスレッドを導入してEliminatorを残り時間を考えて自発的に中断するようにしたこと。こうしないと\u003Cstrong\u003E大きな問題では何時間でも変数除去をやっていた\u003C\u002Fstrong\u003Eようだ。\u003C\u002Fli\u003E\n\u003Cli\u003E変数活性度の減衰率が意外に重要だということがわかったのでやや小さめにしたこと。これは小さくする、すなわち学習による更新が稀にしか起きなくすることで、結局リスタート時に大きな変化を生じさせなくする効果があり、それはつまり\u003Cstrong\u003Edeep searchモードでリスタート発生を抑えようとしたのと同じような効果がある\u003C\u002Fstrong\u003Eらしいことがわかったから。このパラメータだけで求解数が大きく違う。またdeep searchの理解が少し進んだので、deep saerchの重みを減らした（期間の減少、定期的な通常モードへの復帰、クールダウン期間の減少など）。\u003C\u002Fli\u003E\n\u003Cli\u003Eあとは標準的なtraitを様々導入したこと。サブモジュール間のインターフェイスが変わったので0.2.2ではなく0.3.0にナンバリング。\u003C\u002Fli\u003E\n\u003C\u002Fol\u003E\n\u003Cp\u003Eこれで6000行のプログラムの2000行ほどが更新されることになったし、質的にも結構大きな修正だった。多分この文章以外にはどこにも書かないだろうけど、上記強調部分は眼から鱗の出来事だった。\u003C\u002Fp\u003E\n\u003Ch2\u003EChronoBTの試み\u003C\u002Fh2\u003E\n\u003Cp\u003E前回から0.2.2の目玉として考えてきたChronoBTの実装は論文をちゃんと読んでみると、バックトラック時の再割り当ての手間を省くのは主目的ではなく、バックトラックコストが少ない学習節の作成から得られるむしろ副作用のようなものであることがわかった。ということでこれまでの安直な実装を目指していたブランチは全て見当外れ。0.3.0のリリース後に論文見ながら一からやり直すことになった。これが0.3.1の主目標になるでしょう。\u003C\u002Fp\u003E\n\u003Ch2\u003Eベンチマーク変更\u003C\u002Fh2\u003E\n\u003Cp\u003EベンチマークをSAT Competition 2018ものからSAT RACE 2019に変更しました。過去のデータが使えなくなるのは大きいので延び延びになっていたけどようやく重い腰をあげた。下図が去年の公式データの結果のカクタスプロット（2つほどなんか変なデータがあったので除去が必要だった）。やはり500秒くらいで既にある程度の傾向は見て取れる。現実的な到達目標にしようと思う。これなら並列実行すれば今の環境でも1日掛からないくらいで1回のベンチマークを終わらせることができるし。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2020\u002F02-11\u002Fcactus.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eさて、ここに（並列実行の影響補正用の適当なスケーリングありで）Splr-0.3.0でやってみた結果を追加してみると、絶望するほどじゃないじゃん。少なくとも下位グループの中位には位置づけできそうな感じだ。\u003C\u002Fp\u003E\n\u003Cp\u003EあとはChronoBTを導入することで、どこまで伸ばすことができるか。期待しよう。\u003C\u002Fp\u003E\n\u003Cp\u003EさらにJupyter labを導入しました。まあ慣れてしまえばいいことでRもPythonも同じようなもんだな。Pythonでプログラミングするつもりはないけど、まあ21世紀のPostScriptのようなもんだろう、図形表示言語という意味で。Rustカーネルも入れてみたけど、使いところがないなあ。\u003C\u002Fp\u003E\n\u003Ch2\u003E結び\u003C\u002Fh2\u003E\n\u003Cp\u003EさあChronoBTの実装だ！下位グループから脱却できるかなあ。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2020",base:"2020-02-11-UNSATlog.json",ext:".json",sourceBase:"2020-02-11-UNSATlog.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"UNSAT LOG, 2020, Feb."},subtitle:{writable:true,enumerable:true,value:"Vol.1, No.2."},date:{writable:true,enumerable:true,value:"2020-02-11T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT","splr","unsatlog"]},bodyContent:{writable:true,enumerable:true,value:"## はじめに\n\n今期のビッグイベントはなんと言ってもSplr-0.3.0のリリース。めでたい。\n\n## Splr-0.3.0リリース\n\n三ヶ月の開発期間を経て2月10日にようやくSplr-0.3.0をリリースすることができました。その更新内容から大事な部分を拾ってみると、\n\n1. 変数選択機構を最新のLearnt Rate based Branching with Reson Side Rewardingに基づくものに変更したこと。なお更新の単位は矛盾ではなく割当てから未割り当てまでで考えることにした。これは単なるアイデア。\n1. タイムアウト用のスレッドを導入してEliminatorを残り時間を考えて自発的に中断するようにしたこと。こうしないと**大きな問題では何時間でも変数除去をやっていた**ようだ。\n1. 変数活性度の減衰率が意外に重要だということがわかったのでやや小さめにしたこと。これは小さくする、すなわち学習による更新が稀にしか起きなくすることで、結局リスタート時に大きな変化を生じさせなくする効果があり、それはつまり**deep searchモードでリスタート発生を抑えようとしたのと同じような効果がある**らしいことがわかったから。このパラメータだけで求解数が大きく違う。またdeep searchの理解が少し進んだので、deep saerchの重みを減らした（期間の減少、定期的な通常モードへの復帰、クールダウン期間の減少など）。\n1. あとは標準的なtraitを様々導入したこと。サブモジュール間のインターフェイスが変わったので0.2.2ではなく0.3.0にナンバリング。\n\nこれで6000行のプログラムの2000行ほどが更新されることになったし、質的にも結構大きな修正だった。多分この文章以外にはどこにも書かないだろうけど、上記強調部分は眼から鱗の出来事だった。\n\n## ChronoBTの試み\n\n前回から0.2.2の目玉として考えてきたChronoBTの実装は論文をちゃんと読んでみると、バックトラック時の再割り当ての手間を省くのは主目的ではなく、バックトラックコストが少ない学習節の作成から得られるむしろ副作用のようなものであることがわかった。ということでこれまでの安直な実装を目指していたブランチは全て見当外れ。0.3.0のリリース後に論文見ながら一からやり直すことになった。これが0.3.1の主目標になるでしょう。\n\n## ベンチマーク変更\n\nベンチマークをSAT Competition 2018ものからSAT RACE 2019に変更しました。過去のデータが使えなくなるのは大きいので延び延びになっていたけどようやく重い腰をあげた。下図が去年の公式データの結果のカクタスプロット（2つほどなんか変なデータがあったので除去が必要だった）。やはり500秒くらいで既にある程度の傾向は見て取れる。現実的な到達目標にしようと思う。これなら並列実行すれば今の環境でも1日掛からないくらいで1回のベンチマークを終わらせることができるし。\n\n![](\u002Fimg\u002F2020\u002F02-11\u002Fcactus.png)\n\nさて、ここに（並列実行の影響補正用の適当なスケーリングありで）Splr-0.3.0でやってみた結果を追加してみると、絶望するほどじゃないじゃん。少なくとも下位グループの中位には位置づけできそうな感じだ。\n\nあとはChronoBTを導入することで、どこまで伸ばすことができるか。期待しよう。\n\nさらにJupyter labを導入しました。まあ慣れてしまえばいいことでRもPythonも同じようなもんだな。Pythonでプログラミングするつもりはないけど、まあ21世紀のPostScriptのようなもんだろう、図形表示言語という意味で。Rustカーネルも入れてみたけど、使いところがないなあ。\n\n## 結び\n\nさあChronoBTの実装だ！下位グループから脱却できるかなあ。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Ch2\u003Eはじめに\u003C\u002Fh2\u003E\n\u003Cp\u003E今期のビッグイベントはなんと言ってもSplr-0.3.0のリリース。めでたい。\u003C\u002Fp\u003E\n\u003Ch2\u003ESplr-0.3.0リリース\u003C\u002Fh2\u003E\n\u003Cp\u003E三ヶ月の開発期間を経て2月10日にようやくSplr-0.3.0をリリースすることができました。その更新内容から大事な部分を拾ってみると、\u003C\u002Fp\u003E\n\u003Col\u003E\n\u003Cli\u003E変数選択機構を最新のLearnt Rate based Branching with Reson Side Rewardingに基づくものに変更したこと。なお更新の単位は矛盾ではなく割当てから未割り当てまでで考えることにした。これは単なるアイデア。\u003C\u002Fli\u003E\n\u003Cli\u003Eタイムアウト用のスレッドを導入してEliminatorを残り時間を考えて自発的に中断するようにしたこと。こうしないと\u003Cstrong\u003E大きな問題では何時間でも変数除去をやっていた\u003C\u002Fstrong\u003Eようだ。\u003C\u002Fli\u003E\n\u003Cli\u003E変数活性度の減衰率が意外に重要だということがわかったのでやや小さめにしたこと。これは小さくする、すなわち学習による更新が稀にしか起きなくすることで、結局リスタート時に大きな変化を生じさせなくする効果があり、それはつまり\u003Cstrong\u003Edeep searchモードでリスタート発生を抑えようとしたのと同じような効果がある\u003C\u002Fstrong\u003Eらしいことがわかったから。このパラメータだけで求解数が大きく違う。またdeep searchの理解が少し進んだので、deep saerchの重みを減らした（期間の減少、定期的な通常モードへの復帰、クールダウン期間の減少など）。\u003C\u002Fli\u003E\n\u003Cli\u003Eあとは標準的なtraitを様々導入したこと。サブモジュール間のインターフェイスが変わったので0.2.2ではなく0.3.0にナンバリング。\u003C\u002Fli\u003E\n\u003C\u002Fol\u003E\n\u003Cp\u003Eこれで6000行のプログラムの2000行ほどが更新されることになったし、質的にも結構大きな修正だった。多分この文章以外にはどこにも書かないだろうけど、上記強調部分は眼から鱗の出来事だった。\u003C\u002Fp\u003E\n\u003Ch2\u003EChronoBTの試み\u003C\u002Fh2\u003E\n\u003Cp\u003E前回から0.2.2の目玉として考えてきたChronoBTの実装は論文をちゃんと読んでみると、バックトラック時の再割り当ての手間を省くのは主目的ではなく、バックトラックコストが少ない学習節の作成から得られるむしろ副作用のようなものであることがわかった。ということでこれまでの安直な実装を目指していたブランチは全て見当外れ。0.3.0のリリース後に論文見ながら一からやり直すことになった。これが0.3.1の主目標になるでしょう。\u003C\u002Fp\u003E\n\u003Ch2\u003Eベンチマーク変更\u003C\u002Fh2\u003E\n\u003Cp\u003EベンチマークをSAT Competition 2018ものからSAT RACE 2019に変更しました。過去のデータが使えなくなるのは大きいので延び延びになっていたけどようやく重い腰をあげた。下図が去年の公式データの結果のカクタスプロット（2つほどなんか変なデータがあったので除去が必要だった）。やはり500秒くらいで既にある程度の傾向は見て取れる。現実的な到達目標にしようと思う。これなら並列実行すれば今の環境でも1日掛からないくらいで1回のベンチマークを終わらせることができるし。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2020\u002F02-11\u002Fcactus.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eさて、ここに（並列実行の影響補正用の適当なスケーリングありで）Splr-0.3.0でやってみた結果を追加してみると、絶望するほどじゃないじゃん。少なくとも下位グループの中位には位置づけできそうな感じだ。\u003C\u002Fp\u003E\n\u003Cp\u003EあとはChronoBTを導入することで、どこまで伸ばすことができるか。期待しよう。\u003C\u002Fp\u003E\n\u003Cp\u003EさらにJupyter labを導入しました。まあ慣れてしまえばいいことでRもPythonも同じようなもんだな。Pythonでプログラミングするつもりはないけど、まあ21世紀のPostScriptのようなもんだろう、図形表示言語という意味で。Rustカーネルも入れてみたけど、使いところがないなあ。\u003C\u002Fp\u003E\n\u003Ch2\u003E結び\u003C\u002Fh2\u003E\n\u003Cp\u003EさあChronoBTの実装だ！下位グループから脱却できるかなあ。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2020"},base:{writable:true,enumerable:true,value:"2020-02-11-UNSATlog.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2020-02-11-UNSATlog.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});