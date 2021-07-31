__NUXT_JSONP__("/2021/2021-08-01-UNSATlog", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"UNSAT LOG, 2021, Aug.",subtitle:"Vol.2, No.8.",date:"2021-08-01T00:00:00.000Z",tags:["SAT","splr","unsatlog"],banner:"\u002Fimg\u002F2021\u002F08-01\u002Fbanner.jpg",banner_caption:"created with Blender",bodyContent:"# Finally Bugs Fixed in July\nようやくバグフィックス終わった。7月に[0.10.0リリース](https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Freleases\u002Ftag\u002FSplr-0.10.0)できました。\n\n# なんだったのか\nSplrの開発史上最大最長の難問になった今回の不整合バグがどうやって発生したのか振り返っておきたい。現れたバグは様々だった。\n\n- UNSAT certificateがおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F122\n- 単位節が伝播を起こさない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F119\n- 割り当てられても伝播されない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F117\n- 依存グラフにより高いレベルのリテラルが出現する — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F116\n- 除去リテラルを戻すとおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F115\n- 依存グラフでbinary clauseでの方向が逆 — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F114\n\nとまあ呆れるくらい様々。\nもうSATソルバーとしてはほぼ壊滅状態だった。\n\nで、これらの原因は一つではなかった。\n0.10.0のリリースまでに潰したのは以下の通り。\n\n- chronoBTの最上レベルリテラル数が1の場合はchronoBTかそうでないかに関わらず同じ処理をしなければならなかったのだが、そうなっていなかった。論文の何気ない記述に引っ張られてしまった。\n- chronoBT混在環境においてcancel_untilの処理が不適切だった。割り当て順序の逆転が起きていて、正しい依存グラフが作れなくなってしまっていた。\n- 単位伝播は問題ないのだが、Eliminatorやvivifierが生成する節がClauseDBに適切に登録されてなかったため、伝播に失敗する単位節が存在していた。またcertificateに適切に生成された節が追加されてなかった。\n- 除去変数を戻すモデル拡張器があやしいようなそうでないようなわかりにくいコードだった（sliceやiteratorを使ったもっとRust的（モダン）で意味が取りやすいコードに修正した）。\n\nどれを取っても致命的なのだが、よくもまあもっと早い段階で気づけなかったものだろうか。\nおおよそ1年近くSplrはバグ持ち、それもSATソルバーを名乗れないレベルのバグ持ちだったと言うことがわかり、赤面してしまう。\n\n# After 0.10.0\n\nというわけで無事にSplr 0.10.0をリリースしてから、正しさを壊さないようにしながら、ちょっとづつパフォーマンスチューニング中です。\n\nまずはLuby stabilizationが全然よくないので改善中。\n気づいていたけども0.10.0にはどうやっても入れる時間的な余裕はなかったので後回しにしていた。\nその後、どうもモードの変更を節削減と同期を取るのが相当に効くらしいということがわかったので、そちらを採用。\naes.cnfは0.10.0だと10000秒程度掛かるのが普通なんだけど、この部分を変えてみると2000秒台になっているし、sat-benchの結果もSplrのベストにかなり近くなった。\n小さな変更なのだがリリースする価値がありそうだ。\n初めて使ったalgorithm2eで書くとこうなる。\nReduction, Elimination, Vivification、そしてモードスイッチ、と綺麗な流れじゃないか。\n\n![](\u002Fimg\u002F2021\u002F08-01\u002FLubyStabilization.png)\n\nドキュメントを更新して数日中に0.10.1としてリリースの予定です。\n\nあとは\n- Root-level asserted literalsの除去の最適化\n- 重複節の除去：どうもこれは重要のような気がするので早いところ統計データをとってみるつもり。in-processorを頻繁に起動するSplrでは無闇に重複節を発生させている可能性が捨てきれない。clause reductionの後にclause vivifierを起動するように変更したことである程度は削減できているような気もするがさて？　litsをhash値にマップすればそれほど計算量は高くならないのではないだろうか。\n\nという感じでまあぼちぼちと。\nそれよりは論文読んでproceeding読んで、benchmark suitを今年のものに入れ替えて、とこれだけやれば8月は終わりです。",bodyHtml:"\u003Ch1\u003EFinally Bugs Fixed in July\u003C\u002Fh1\u003E\n\u003Cp\u003Eようやくバグフィックス終わった。7月に\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Freleases\u002Ftag\u002FSplr-0.10.0\"\u003E0.10.0リリース\u003C\u002Fa\u003Eできました。\u003C\u002Fp\u003E\n\u003Ch1\u003Eなんだったのか\u003C\u002Fh1\u003E\n\u003Cp\u003ESplrの開発史上最大最長の難問になった今回の不整合バグがどうやって発生したのか振り返っておきたい。現れたバグは様々だった。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003EUNSAT certificateがおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F122\u003C\u002Fli\u003E\n\u003Cli\u003E単位節が伝播を起こさない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F119\u003C\u002Fli\u003E\n\u003Cli\u003E割り当てられても伝播されない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F117\u003C\u002Fli\u003E\n\u003Cli\u003E依存グラフにより高いレベルのリテラルが出現する — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F116\u003C\u002Fli\u003E\n\u003Cli\u003E除去リテラルを戻すとおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F115\u003C\u002Fli\u003E\n\u003Cli\u003E依存グラフでbinary clauseでの方向が逆 — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F114\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eとまあ呆れるくらい様々。\nもうSATソルバーとしてはほぼ壊滅状態だった。\u003C\u002Fp\u003E\n\u003Cp\u003Eで、これらの原因は一つではなかった。\n0.10.0のリリースまでに潰したのは以下の通り。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003EchronoBTの最上レベルリテラル数が1の場合はchronoBTかそうでないかに関わらず同じ処理をしなければならなかったのだが、そうなっていなかった。論文の何気ない記述に引っ張られてしまった。\u003C\u002Fli\u003E\n\u003Cli\u003EchronoBT混在環境においてcancel_untilの処理が不適切だった。割り当て順序の逆転が起きていて、正しい依存グラフが作れなくなってしまっていた。\u003C\u002Fli\u003E\n\u003Cli\u003E単位伝播は問題ないのだが、Eliminatorやvivifierが生成する節がClauseDBに適切に登録されてなかったため、伝播に失敗する単位節が存在していた。またcertificateに適切に生成された節が追加されてなかった。\u003C\u002Fli\u003E\n\u003Cli\u003E除去変数を戻すモデル拡張器があやしいようなそうでないようなわかりにくいコードだった（sliceやiteratorを使ったもっとRust的（モダン）で意味が取りやすいコードに修正した）。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eどれを取っても致命的なのだが、よくもまあもっと早い段階で気づけなかったものだろうか。\nおおよそ1年近くSplrはバグ持ち、それもSATソルバーを名乗れないレベルのバグ持ちだったと言うことがわかり、赤面してしまう。\u003C\u002Fp\u003E\n\u003Ch1\u003EAfter 0.10.0\u003C\u002Fh1\u003E\n\u003Cp\u003Eというわけで無事にSplr 0.10.0をリリースしてから、正しさを壊さないようにしながら、ちょっとづつパフォーマンスチューニング中です。\u003C\u002Fp\u003E\n\u003Cp\u003EまずはLuby stabilizationが全然よくないので改善中。\n気づいていたけども0.10.0にはどうやっても入れる時間的な余裕はなかったので後回しにしていた。\nその後、どうもモードの変更を節削減と同期を取るのが相当に効くらしいということがわかったので、そちらを採用。\naes.cnfは0.10.0だと10000秒程度掛かるのが普通なんだけど、この部分を変えてみると2000秒台になっているし、sat-benchの結果もSplrのベストにかなり近くなった。\n小さな変更なのだがリリースする価値がありそうだ。\n初めて使ったalgorithm2eで書くとこうなる。\nReduction, Elimination, Vivification、そしてモードスイッチ、と綺麗な流れじゃないか。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2021\u002F08-01\u002FLubyStabilization.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eドキュメントを更新して数日中に0.10.1としてリリースの予定です。\u003C\u002Fp\u003E\n\u003Cp\u003Eあとは\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003ERoot-level asserted literalsの除去の最適化\u003C\u002Fli\u003E\n\u003Cli\u003E重複節の除去：どうもこれは重要のような気がするので早いところ統計データをとってみるつもり。in-processorを頻繁に起動するSplrでは無闇に重複節を発生させている可能性が捨てきれない。clause reductionの後にclause vivifierを起動するように変更したことである程度は削減できているような気もするがさて？　litsをhash値にマップすればそれほど計算量は高くならないのではないだろうか。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eという感じでまあぼちぼちと。\nそれよりは論文読んでproceeding読んで、benchmark suitを今年のものに入れ替えて、とこれだけやれば8月は終わりです。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2021",base:"2021-08-01-UNSATlog.json",ext:".json",sourceBase:"2021-08-01-UNSATlog.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"UNSAT LOG, 2021, Aug."},subtitle:{writable:true,enumerable:true,value:"Vol.2, No.8."},date:{writable:true,enumerable:true,value:"2021-08-01T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT","splr","unsatlog"]},banner:{writable:true,enumerable:true,value:"\u002Fimg\u002F2021\u002F08-01\u002Fbanner.jpg"},banner_caption:{writable:true,enumerable:true,value:"created with Blender"},bodyContent:{writable:true,enumerable:true,value:"# Finally Bugs Fixed in July\nようやくバグフィックス終わった。7月に[0.10.0リリース](https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Freleases\u002Ftag\u002FSplr-0.10.0)できました。\n\n# なんだったのか\nSplrの開発史上最大最長の難問になった今回の不整合バグがどうやって発生したのか振り返っておきたい。現れたバグは様々だった。\n\n- UNSAT certificateがおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F122\n- 単位節が伝播を起こさない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F119\n- 割り当てられても伝播されない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F117\n- 依存グラフにより高いレベルのリテラルが出現する — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F116\n- 除去リテラルを戻すとおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F115\n- 依存グラフでbinary clauseでの方向が逆 — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F114\n\nとまあ呆れるくらい様々。\nもうSATソルバーとしてはほぼ壊滅状態だった。\n\nで、これらの原因は一つではなかった。\n0.10.0のリリースまでに潰したのは以下の通り。\n\n- chronoBTの最上レベルリテラル数が1の場合はchronoBTかそうでないかに関わらず同じ処理をしなければならなかったのだが、そうなっていなかった。論文の何気ない記述に引っ張られてしまった。\n- chronoBT混在環境においてcancel_untilの処理が不適切だった。割り当て順序の逆転が起きていて、正しい依存グラフが作れなくなってしまっていた。\n- 単位伝播は問題ないのだが、Eliminatorやvivifierが生成する節がClauseDBに適切に登録されてなかったため、伝播に失敗する単位節が存在していた。またcertificateに適切に生成された節が追加されてなかった。\n- 除去変数を戻すモデル拡張器があやしいようなそうでないようなわかりにくいコードだった（sliceやiteratorを使ったもっとRust的（モダン）で意味が取りやすいコードに修正した）。\n\nどれを取っても致命的なのだが、よくもまあもっと早い段階で気づけなかったものだろうか。\nおおよそ1年近くSplrはバグ持ち、それもSATソルバーを名乗れないレベルのバグ持ちだったと言うことがわかり、赤面してしまう。\n\n# After 0.10.0\n\nというわけで無事にSplr 0.10.0をリリースしてから、正しさを壊さないようにしながら、ちょっとづつパフォーマンスチューニング中です。\n\nまずはLuby stabilizationが全然よくないので改善中。\n気づいていたけども0.10.0にはどうやっても入れる時間的な余裕はなかったので後回しにしていた。\nその後、どうもモードの変更を節削減と同期を取るのが相当に効くらしいということがわかったので、そちらを採用。\naes.cnfは0.10.0だと10000秒程度掛かるのが普通なんだけど、この部分を変えてみると2000秒台になっているし、sat-benchの結果もSplrのベストにかなり近くなった。\n小さな変更なのだがリリースする価値がありそうだ。\n初めて使ったalgorithm2eで書くとこうなる。\nReduction, Elimination, Vivification、そしてモードスイッチ、と綺麗な流れじゃないか。\n\n![](\u002Fimg\u002F2021\u002F08-01\u002FLubyStabilization.png)\n\nドキュメントを更新して数日中に0.10.1としてリリースの予定です。\n\nあとは\n- Root-level asserted literalsの除去の最適化\n- 重複節の除去：どうもこれは重要のような気がするので早いところ統計データをとってみるつもり。in-processorを頻繁に起動するSplrでは無闇に重複節を発生させている可能性が捨てきれない。clause reductionの後にclause vivifierを起動するように変更したことである程度は削減できているような気もするがさて？　litsをhash値にマップすればそれほど計算量は高くならないのではないだろうか。\n\nという感じでまあぼちぼちと。\nそれよりは論文読んでproceeding読んで、benchmark suitを今年のものに入れ替えて、とこれだけやれば8月は終わりです。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Ch1\u003EFinally Bugs Fixed in July\u003C\u002Fh1\u003E\n\u003Cp\u003Eようやくバグフィックス終わった。7月に\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Freleases\u002Ftag\u002FSplr-0.10.0\"\u003E0.10.0リリース\u003C\u002Fa\u003Eできました。\u003C\u002Fp\u003E\n\u003Ch1\u003Eなんだったのか\u003C\u002Fh1\u003E\n\u003Cp\u003ESplrの開発史上最大最長の難問になった今回の不整合バグがどうやって発生したのか振り返っておきたい。現れたバグは様々だった。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003EUNSAT certificateがおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F122\u003C\u002Fli\u003E\n\u003Cli\u003E単位節が伝播を起こさない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F119\u003C\u002Fli\u003E\n\u003Cli\u003E割り当てられても伝播されない — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F117\u003C\u002Fli\u003E\n\u003Cli\u003E依存グラフにより高いレベルのリテラルが出現する — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F116\u003C\u002Fli\u003E\n\u003Cli\u003E除去リテラルを戻すとおかしい — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F115\u003C\u002Fli\u003E\n\u003Cli\u003E依存グラフでbinary clauseでの方向が逆 — https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fissues\u002F114\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eとまあ呆れるくらい様々。\nもうSATソルバーとしてはほぼ壊滅状態だった。\u003C\u002Fp\u003E\n\u003Cp\u003Eで、これらの原因は一つではなかった。\n0.10.0のリリースまでに潰したのは以下の通り。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003EchronoBTの最上レベルリテラル数が1の場合はchronoBTかそうでないかに関わらず同じ処理をしなければならなかったのだが、そうなっていなかった。論文の何気ない記述に引っ張られてしまった。\u003C\u002Fli\u003E\n\u003Cli\u003EchronoBT混在環境においてcancel_untilの処理が不適切だった。割り当て順序の逆転が起きていて、正しい依存グラフが作れなくなってしまっていた。\u003C\u002Fli\u003E\n\u003Cli\u003E単位伝播は問題ないのだが、Eliminatorやvivifierが生成する節がClauseDBに適切に登録されてなかったため、伝播に失敗する単位節が存在していた。またcertificateに適切に生成された節が追加されてなかった。\u003C\u002Fli\u003E\n\u003Cli\u003E除去変数を戻すモデル拡張器があやしいようなそうでないようなわかりにくいコードだった（sliceやiteratorを使ったもっとRust的（モダン）で意味が取りやすいコードに修正した）。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eどれを取っても致命的なのだが、よくもまあもっと早い段階で気づけなかったものだろうか。\nおおよそ1年近くSplrはバグ持ち、それもSATソルバーを名乗れないレベルのバグ持ちだったと言うことがわかり、赤面してしまう。\u003C\u002Fp\u003E\n\u003Ch1\u003EAfter 0.10.0\u003C\u002Fh1\u003E\n\u003Cp\u003Eというわけで無事にSplr 0.10.0をリリースしてから、正しさを壊さないようにしながら、ちょっとづつパフォーマンスチューニング中です。\u003C\u002Fp\u003E\n\u003Cp\u003EまずはLuby stabilizationが全然よくないので改善中。\n気づいていたけども0.10.0にはどうやっても入れる時間的な余裕はなかったので後回しにしていた。\nその後、どうもモードの変更を節削減と同期を取るのが相当に効くらしいということがわかったので、そちらを採用。\naes.cnfは0.10.0だと10000秒程度掛かるのが普通なんだけど、この部分を変えてみると2000秒台になっているし、sat-benchの結果もSplrのベストにかなり近くなった。\n小さな変更なのだがリリースする価値がありそうだ。\n初めて使ったalgorithm2eで書くとこうなる。\nReduction, Elimination, Vivification、そしてモードスイッチ、と綺麗な流れじゃないか。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2021\u002F08-01\u002FLubyStabilization.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eドキュメントを更新して数日中に0.10.1としてリリースの予定です。\u003C\u002Fp\u003E\n\u003Cp\u003Eあとは\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003ERoot-level asserted literalsの除去の最適化\u003C\u002Fli\u003E\n\u003Cli\u003E重複節の除去：どうもこれは重要のような気がするので早いところ統計データをとってみるつもり。in-processorを頻繁に起動するSplrでは無闇に重複節を発生させている可能性が捨てきれない。clause reductionの後にclause vivifierを起動するように変更したことである程度は削減できているような気もするがさて？　litsをhash値にマップすればそれほど計算量は高くならないのではないだろうか。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eという感じでまあぼちぼちと。\nそれよりは論文読んでproceeding読んで、benchmark suitを今年のものに入れ替えて、とこれだけやれば8月は終わりです。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2021"},base:{writable:true,enumerable:true,value:"2021-08-01-UNSATlog.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2021-08-01-UNSATlog.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});