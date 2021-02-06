__NUXT_JSONP__("/2020/2020-10-10-UNSATlog", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"UNSAT LOG, 2020, Sep.",subtitle:"Vol.1, No.9.",date:"2020-10-10T00:00:00.000Z",tags:["SAT","splr","unsatlog"],banner:"\u002Fimg\u002F2020\u002F10-10\u002Fbanner.jpg",bodyContent:"## 怪我の8〜9月\n\nすっかり遅くなってしまった。あちこち怪我したせいで色々と時間をとられてしまいました。9月はパラメータチューニングだけやって0.5.2をリリースするつもりだったのだけど、実行時間に対して求解可能問題が単調に増えるソルバにしたくてやっている最中にまた脱線してしまいました。ということで特に成果なし。強いて言うなら、\n\n* `StructOpts`への依存を削除。オブジェクトサイズがほぼ半減した！さらに`libc`への依存も実は std::time::{Duration, Instant}　で代替できたのでこれも削除。今やSplrが依存するのは`bitflags`だけ！\n\n* つい昨日気づいたけどリスタート延期の判断を矛盾発生時まで遅延させるのは筋が悪い。タイミングを逸している。作り直すべき。9月に散々試したいろいろなstabilizationの実験結果は全て放棄することになりました。まあ、リスタートに関するオリジナルの尺度は捨ててもいいかなと思っていたところではある。しかし、何を使っても実はベンチマークの設定が超短期間ならあまり意味がなくて、十分に線形に求解数が伸びていくことの方が大事なんだろう。これを実践するにはリソースがなさすぎ。\n\n* これまではchronoBTの理解ができていない箇所をうまいこと避けるような実装になっていたけど、レアケースでは無限ループに陥っていたことが判明。矛盾レベルのリテラルが一つしか含まれない矛盾節に対するバックトラックの処理を正しく実装し直した。\n\n* もしかしてと思ってリテラル監視節リストをVecDequeにしてみたりBinaryHeapにしてみたりしました。stabilizationと同じ効果があるのではと思ったのだけど、全般的にはむしろ性能悪化の傾向。計算量多すぎ。そもそもSplrのカクタスプロットが早い段階から悪化するのはやはり計算量のレベルの問題だろうか。\n\n他に何かあったかな？　思い出したら追加します。\n\n### 追伸\n\n[sudoku25が5000秒以内に解けなかった](\u002F2020\u002F2020-08-19-sudoku25\u002F)のが大変ショックなのでした。",bodyHtml:"\u003Ch2\u003E怪我の8〜9月\u003C\u002Fh2\u003E\n\u003Cp\u003Eすっかり遅くなってしまった。あちこち怪我したせいで色々と時間をとられてしまいました。9月はパラメータチューニングだけやって0.5.2をリリースするつもりだったのだけど、実行時間に対して求解可能問題が単調に増えるソルバにしたくてやっている最中にまた脱線してしまいました。ということで特に成果なし。強いて言うなら、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E\n\u003Cp\u003E\u003Ccode\u003EStructOpts\u003C\u002Fcode\u003Eへの依存を削除。オブジェクトサイズがほぼ半減した！さらに\u003Ccode\u003Elibc\u003C\u002Fcode\u003Eへの依存も実は std::time::{Duration, Instant}　で代替できたのでこれも削除。今やSplrが依存するのは\u003Ccode\u003Ebitflags\u003C\u002Fcode\u003Eだけ！\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Eつい昨日気づいたけどリスタート延期の判断を矛盾発生時まで遅延させるのは筋が悪い。タイミングを逸している。作り直すべき。9月に散々試したいろいろなstabilizationの実験結果は全て放棄することになりました。まあ、リスタートに関するオリジナルの尺度は捨ててもいいかなと思っていたところではある。しかし、何を使っても実はベンチマークの設定が超短期間ならあまり意味がなくて、十分に線形に求解数が伸びていくことの方が大事なんだろう。これを実践するにはリソースがなさすぎ。\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003EこれまではchronoBTの理解ができていない箇所をうまいこと避けるような実装になっていたけど、レアケースでは無限ループに陥っていたことが判明。矛盾レベルのリテラルが一つしか含まれない矛盾節に対するバックトラックの処理を正しく実装し直した。\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Eもしかしてと思ってリテラル監視節リストをVecDequeにしてみたりBinaryHeapにしてみたりしました。stabilizationと同じ効果があるのではと思ったのだけど、全般的にはむしろ性能悪化の傾向。計算量多すぎ。そもそもSplrのカクタスプロットが早い段階から悪化するのはやはり計算量のレベルの問題だろうか。\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003E他に何かあったかな？　思い出したら追加します。\u003C\u002Fp\u003E\n\u003Ch3\u003E追伸\u003C\u002Fh3\u003E\n\u003Cp\u003E\u003Ca href=\"\u002F2020\u002F2020-08-19-sudoku25\u002F\"\u003Esudoku25が5000秒以内に解けなかった\u003C\u002Fa\u003Eのが大変ショックなのでした。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2020",base:"2020-10-10-UNSATlog.json",ext:".json",sourceBase:"2020-10-10-UNSATlog.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"UNSAT LOG, 2020, Sep."},subtitle:{writable:true,enumerable:true,value:"Vol.1, No.9."},date:{writable:true,enumerable:true,value:"2020-10-10T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT","splr","unsatlog"]},banner:{writable:true,enumerable:true,value:"\u002Fimg\u002F2020\u002F10-10\u002Fbanner.jpg"},bodyContent:{writable:true,enumerable:true,value:"## 怪我の8〜9月\n\nすっかり遅くなってしまった。あちこち怪我したせいで色々と時間をとられてしまいました。9月はパラメータチューニングだけやって0.5.2をリリースするつもりだったのだけど、実行時間に対して求解可能問題が単調に増えるソルバにしたくてやっている最中にまた脱線してしまいました。ということで特に成果なし。強いて言うなら、\n\n* `StructOpts`への依存を削除。オブジェクトサイズがほぼ半減した！さらに`libc`への依存も実は std::time::{Duration, Instant}　で代替できたのでこれも削除。今やSplrが依存するのは`bitflags`だけ！\n\n* つい昨日気づいたけどリスタート延期の判断を矛盾発生時まで遅延させるのは筋が悪い。タイミングを逸している。作り直すべき。9月に散々試したいろいろなstabilizationの実験結果は全て放棄することになりました。まあ、リスタートに関するオリジナルの尺度は捨ててもいいかなと思っていたところではある。しかし、何を使っても実はベンチマークの設定が超短期間ならあまり意味がなくて、十分に線形に求解数が伸びていくことの方が大事なんだろう。これを実践するにはリソースがなさすぎ。\n\n* これまではchronoBTの理解ができていない箇所をうまいこと避けるような実装になっていたけど、レアケースでは無限ループに陥っていたことが判明。矛盾レベルのリテラルが一つしか含まれない矛盾節に対するバックトラックの処理を正しく実装し直した。\n\n* もしかしてと思ってリテラル監視節リストをVecDequeにしてみたりBinaryHeapにしてみたりしました。stabilizationと同じ効果があるのではと思ったのだけど、全般的にはむしろ性能悪化の傾向。計算量多すぎ。そもそもSplrのカクタスプロットが早い段階から悪化するのはやはり計算量のレベルの問題だろうか。\n\n他に何かあったかな？　思い出したら追加します。\n\n### 追伸\n\n[sudoku25が5000秒以内に解けなかった](\u002F2020\u002F2020-08-19-sudoku25\u002F)のが大変ショックなのでした。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Ch2\u003E怪我の8〜9月\u003C\u002Fh2\u003E\n\u003Cp\u003Eすっかり遅くなってしまった。あちこち怪我したせいで色々と時間をとられてしまいました。9月はパラメータチューニングだけやって0.5.2をリリースするつもりだったのだけど、実行時間に対して求解可能問題が単調に増えるソルバにしたくてやっている最中にまた脱線してしまいました。ということで特に成果なし。強いて言うなら、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E\n\u003Cp\u003E\u003Ccode\u003EStructOpts\u003C\u002Fcode\u003Eへの依存を削除。オブジェクトサイズがほぼ半減した！さらに\u003Ccode\u003Elibc\u003C\u002Fcode\u003Eへの依存も実は std::time::{Duration, Instant}　で代替できたのでこれも削除。今やSplrが依存するのは\u003Ccode\u003Ebitflags\u003C\u002Fcode\u003Eだけ！\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Eつい昨日気づいたけどリスタート延期の判断を矛盾発生時まで遅延させるのは筋が悪い。タイミングを逸している。作り直すべき。9月に散々試したいろいろなstabilizationの実験結果は全て放棄することになりました。まあ、リスタートに関するオリジナルの尺度は捨ててもいいかなと思っていたところではある。しかし、何を使っても実はベンチマークの設定が超短期間ならあまり意味がなくて、十分に線形に求解数が伸びていくことの方が大事なんだろう。これを実践するにはリソースがなさすぎ。\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003EこれまではchronoBTの理解ができていない箇所をうまいこと避けるような実装になっていたけど、レアケースでは無限ループに陥っていたことが判明。矛盾レベルのリテラルが一つしか含まれない矛盾節に対するバックトラックの処理を正しく実装し直した。\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Eもしかしてと思ってリテラル監視節リストをVecDequeにしてみたりBinaryHeapにしてみたりしました。stabilizationと同じ効果があるのではと思ったのだけど、全般的にはむしろ性能悪化の傾向。計算量多すぎ。そもそもSplrのカクタスプロットが早い段階から悪化するのはやはり計算量のレベルの問題だろうか。\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003E他に何かあったかな？　思い出したら追加します。\u003C\u002Fp\u003E\n\u003Ch3\u003E追伸\u003C\u002Fh3\u003E\n\u003Cp\u003E\u003Ca href=\"\u002F2020\u002F2020-08-19-sudoku25\u002F\"\u003Esudoku25が5000秒以内に解けなかった\u003C\u002Fa\u003Eのが大変ショックなのでした。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2020"},base:{writable:true,enumerable:true,value:"2020-10-10-UNSATlog.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2020-10-10-UNSATlog.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});