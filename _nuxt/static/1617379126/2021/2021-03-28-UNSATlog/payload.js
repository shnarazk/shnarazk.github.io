__NUXT_JSONP__("/2021/2021-03-28-UNSATlog", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"UNSAT LOG, 2021, Mar.",subtitle:"Vol.2, No.3.",date:"2021-03-28T00:00:00.000Z",tags:["SAT","splr","unsatlog"],banner:"\u002Fimg\u002F2021\u002F03-28\u002Fbanner.jpg",bodyContent:"# UNSATlog\n\n## Splr-0.7.1リリースのはずが\n\n前号を出したのが12日でそれから2週間足らずなので、Splr-0.7.1をリリースしたことしか書くことないよなあと思っていたら、リリース前のルーチンワークのベンチマークの検証中にエラーが発見されてしまった。\n\nまさか、UNSAT問題をSATと答えるなんて！\nそれも、原因モジュールの同定に数時間かかることになってしまって、半日経っても何が問題なのかすら判明できていない有様。\nちょっとこのバグはキツい。リリースは（楽観的にみて）1週間ほど延期になりそうだ。\n\nという以上の内容だけでvol.3を出して、Splr-0.7.1のリリースのタイミングで次の号を出し、そこで UNSAT logの号数を実暦に合わせよう。ああ、それだけが楽しみ。\n\n## 2021-04-02\n\nやっと、やっと、原因の節が特定できそう。`watch`が適切なリテラルを持ってない。\n多分shrink, shortenでのリテラル削除に監視リテラルが追従してないようだ。\n\n```\n$ splr aes.cnf\naes.cnf                                      501284,2928183 |time:     5.21\n #conflict:          0, #decision:            0, #propagate:         221128\n  Assignment|#rem:    34160, #ass:   221128, #elm:   245996, prg%:  93.1855\n      Clause|Remv:        0, LBD2:        0, Binc:  2472979, Perm:  4073761\n     Restart|#BLK:        0, #RST:        0, trgr:        1, peak:        1\n         LBD|avrg:   0.0000, trnd:      NaN, depG:   0.0000, \u002Fdpc:     0.00\n    Conflict|tASG:      NaN, cLvl:     0.00, bLvl:     0.00, \u002Fppc:     0.00\n        misc|elim:        1, #sub:    87499, core:   501284, \u002Fcpr:     0.00\nunreachable core: 24650\n[src\u002Fcdb\u002Fdb.rs:958] \n  (l, w.blocker, w.c, &c.lits)\n  = ( L151359, L158797, Cid3949122, [ L151358, L149809, L151175 ])\n```\n\nこの結果を出すのに実行時間は3時間越え。\n原因を正確につきとめようと細かくチェックを入れたら10時間経ってもコアサイズが31000を下回らなかった。\n今日中に塞げるだろうか。\n\n## 2021-04-03\n\n塞げたような気がする。\nまだ結論が出てないので「気がする」としか書きようがないのが、とにかく検証中。\nバグによって偶然解けたことになってしまった問題なので、何時間かかっても解き、さらにそれが無謬であることを証明しなければならない。\n計算が終わるまでじっと我慢しなくては。",bodyHtml:"\u003Ch1\u003EUNSATlog\u003C\u002Fh1\u003E\n\u003Ch2\u003ESplr-0.7.1リリースのはずが\u003C\u002Fh2\u003E\n\u003Cp\u003E前号を出したのが12日でそれから2週間足らずなので、Splr-0.7.1をリリースしたことしか書くことないよなあと思っていたら、リリース前のルーチンワークのベンチマークの検証中にエラーが発見されてしまった。\u003C\u002Fp\u003E\n\u003Cp\u003Eまさか、UNSAT問題をSATと答えるなんて！\nそれも、原因モジュールの同定に数時間かかることになってしまって、半日経っても何が問題なのかすら判明できていない有様。\nちょっとこのバグはキツい。リリースは（楽観的にみて）1週間ほど延期になりそうだ。\u003C\u002Fp\u003E\n\u003Cp\u003Eという以上の内容だけでvol.3を出して、Splr-0.7.1のリリースのタイミングで次の号を出し、そこで UNSAT logの号数を実暦に合わせよう。ああ、それだけが楽しみ。\u003C\u002Fp\u003E\n\u003Ch2\u003E2021-04-02\u003C\u002Fh2\u003E\n\u003Cp\u003Eやっと、やっと、原因の節が特定できそう。\u003Ccode\u003Ewatch\u003C\u002Fcode\u003Eが適切なリテラルを持ってない。\n多分shrink, shortenでのリテラル削除に監視リテラルが追従してないようだ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E$ splr aes.cnf\naes.cnf                                      501284,2928183 |time:     5.21\n #conflict:          0, #decision:            0, #propagate:         221128\n  Assignment|#rem:    34160, #ass:   221128, #elm:   245996, prg%:  93.1855\n      Clause|Remv:        0, LBD2:        0, Binc:  2472979, Perm:  4073761\n     Restart|#BLK:        0, #RST:        0, trgr:        1, peak:        1\n         LBD|avrg:   0.0000, trnd:      NaN, depG:   0.0000, \u002Fdpc:     0.00\n    Conflict|tASG:      NaN, cLvl:     0.00, bLvl:     0.00, \u002Fppc:     0.00\n        misc|elim:        1, #sub:    87499, core:   501284, \u002Fcpr:     0.00\nunreachable core: 24650\n[src\u002Fcdb\u002Fdb.rs:958] \n  (l, w.blocker, w.c, &amp;c.lits)\n  = ( L151359, L158797, Cid3949122, [ L151358, L149809, L151175 ])\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eこの結果を出すのに実行時間は3時間越え。\n原因を正確につきとめようと細かくチェックを入れたら10時間経ってもコアサイズが31000を下回らなかった。\n今日中に塞げるだろうか。\u003C\u002Fp\u003E\n\u003Ch2\u003E2021-04-03\u003C\u002Fh2\u003E\n\u003Cp\u003E塞げたような気がする。\nまだ結論が出てないので「気がする」としか書きようがないのが、とにかく検証中。\nバグによって偶然解けたことになってしまった問題なので、何時間かかっても解き、さらにそれが無謬であることを証明しなければならない。\n計算が終わるまでじっと我慢しなくては。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2021",base:"2021-03-28-UNSATlog.json",ext:".json",sourceBase:"2021-03-28-UNSATlog.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"UNSAT LOG, 2021, Mar."},subtitle:{writable:true,enumerable:true,value:"Vol.2, No.3."},date:{writable:true,enumerable:true,value:"2021-03-28T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT","splr","unsatlog"]},banner:{writable:true,enumerable:true,value:"\u002Fimg\u002F2021\u002F03-28\u002Fbanner.jpg"},bodyContent:{writable:true,enumerable:true,value:"# UNSATlog\n\n## Splr-0.7.1リリースのはずが\n\n前号を出したのが12日でそれから2週間足らずなので、Splr-0.7.1をリリースしたことしか書くことないよなあと思っていたら、リリース前のルーチンワークのベンチマークの検証中にエラーが発見されてしまった。\n\nまさか、UNSAT問題をSATと答えるなんて！\nそれも、原因モジュールの同定に数時間かかることになってしまって、半日経っても何が問題なのかすら判明できていない有様。\nちょっとこのバグはキツい。リリースは（楽観的にみて）1週間ほど延期になりそうだ。\n\nという以上の内容だけでvol.3を出して、Splr-0.7.1のリリースのタイミングで次の号を出し、そこで UNSAT logの号数を実暦に合わせよう。ああ、それだけが楽しみ。\n\n## 2021-04-02\n\nやっと、やっと、原因の節が特定できそう。`watch`が適切なリテラルを持ってない。\n多分shrink, shortenでのリテラル削除に監視リテラルが追従してないようだ。\n\n```\n$ splr aes.cnf\naes.cnf                                      501284,2928183 |time:     5.21\n #conflict:          0, #decision:            0, #propagate:         221128\n  Assignment|#rem:    34160, #ass:   221128, #elm:   245996, prg%:  93.1855\n      Clause|Remv:        0, LBD2:        0, Binc:  2472979, Perm:  4073761\n     Restart|#BLK:        0, #RST:        0, trgr:        1, peak:        1\n         LBD|avrg:   0.0000, trnd:      NaN, depG:   0.0000, \u002Fdpc:     0.00\n    Conflict|tASG:      NaN, cLvl:     0.00, bLvl:     0.00, \u002Fppc:     0.00\n        misc|elim:        1, #sub:    87499, core:   501284, \u002Fcpr:     0.00\nunreachable core: 24650\n[src\u002Fcdb\u002Fdb.rs:958] \n  (l, w.blocker, w.c, &c.lits)\n  = ( L151359, L158797, Cid3949122, [ L151358, L149809, L151175 ])\n```\n\nこの結果を出すのに実行時間は3時間越え。\n原因を正確につきとめようと細かくチェックを入れたら10時間経ってもコアサイズが31000を下回らなかった。\n今日中に塞げるだろうか。\n\n## 2021-04-03\n\n塞げたような気がする。\nまだ結論が出てないので「気がする」としか書きようがないのが、とにかく検証中。\nバグによって偶然解けたことになってしまった問題なので、何時間かかっても解き、さらにそれが無謬であることを証明しなければならない。\n計算が終わるまでじっと我慢しなくては。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Ch1\u003EUNSATlog\u003C\u002Fh1\u003E\n\u003Ch2\u003ESplr-0.7.1リリースのはずが\u003C\u002Fh2\u003E\n\u003Cp\u003E前号を出したのが12日でそれから2週間足らずなので、Splr-0.7.1をリリースしたことしか書くことないよなあと思っていたら、リリース前のルーチンワークのベンチマークの検証中にエラーが発見されてしまった。\u003C\u002Fp\u003E\n\u003Cp\u003Eまさか、UNSAT問題をSATと答えるなんて！\nそれも、原因モジュールの同定に数時間かかることになってしまって、半日経っても何が問題なのかすら判明できていない有様。\nちょっとこのバグはキツい。リリースは（楽観的にみて）1週間ほど延期になりそうだ。\u003C\u002Fp\u003E\n\u003Cp\u003Eという以上の内容だけでvol.3を出して、Splr-0.7.1のリリースのタイミングで次の号を出し、そこで UNSAT logの号数を実暦に合わせよう。ああ、それだけが楽しみ。\u003C\u002Fp\u003E\n\u003Ch2\u003E2021-04-02\u003C\u002Fh2\u003E\n\u003Cp\u003Eやっと、やっと、原因の節が特定できそう。\u003Ccode\u003Ewatch\u003C\u002Fcode\u003Eが適切なリテラルを持ってない。\n多分shrink, shortenでのリテラル削除に監視リテラルが追従してないようだ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E$ splr aes.cnf\naes.cnf                                      501284,2928183 |time:     5.21\n #conflict:          0, #decision:            0, #propagate:         221128\n  Assignment|#rem:    34160, #ass:   221128, #elm:   245996, prg%:  93.1855\n      Clause|Remv:        0, LBD2:        0, Binc:  2472979, Perm:  4073761\n     Restart|#BLK:        0, #RST:        0, trgr:        1, peak:        1\n         LBD|avrg:   0.0000, trnd:      NaN, depG:   0.0000, \u002Fdpc:     0.00\n    Conflict|tASG:      NaN, cLvl:     0.00, bLvl:     0.00, \u002Fppc:     0.00\n        misc|elim:        1, #sub:    87499, core:   501284, \u002Fcpr:     0.00\nunreachable core: 24650\n[src\u002Fcdb\u002Fdb.rs:958] \n  (l, w.blocker, w.c, &amp;c.lits)\n  = ( L151359, L158797, Cid3949122, [ L151358, L149809, L151175 ])\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eこの結果を出すのに実行時間は3時間越え。\n原因を正確につきとめようと細かくチェックを入れたら10時間経ってもコアサイズが31000を下回らなかった。\n今日中に塞げるだろうか。\u003C\u002Fp\u003E\n\u003Ch2\u003E2021-04-03\u003C\u002Fh2\u003E\n\u003Cp\u003E塞げたような気がする。\nまだ結論が出てないので「気がする」としか書きようがないのが、とにかく検証中。\nバグによって偶然解けたことになってしまった問題なので、何時間かかっても解き、さらにそれが無謬であることを証明しなければならない。\n計算が終わるまでじっと我慢しなくては。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2021"},base:{writable:true,enumerable:true,value:"2021-03-28-UNSATlog.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2021-03-28-UNSATlog.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});