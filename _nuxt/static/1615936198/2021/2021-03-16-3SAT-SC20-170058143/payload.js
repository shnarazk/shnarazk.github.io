__NUXT_JSONP__("/2021/2021-03-16-3SAT-SC20-170058143", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"衝撃の320変数3-SAT",subtitle:"at Sat Competition 2020",date:"2021-03-17T00:00:00.000Z",tags:["SAT"],bodyContent:"まともなSAT solverなら250変数の3-SATなんて1秒程度で解け、その求解速度なんてなんの尺度にもならないものだろう。\nなので最近のSplrの開発は360変数の3-SATをマイクロベンチマークに使っている。\n最近はまあ「そこそこ待ち遠しくない時間」でSAT問題、UNSAT問題どちらも解けるようになってきていた。\nで、やっとSAT competition 2021での問題をつまみ食いし始めたのだけど、ある問題に衝撃を受けてしまった。\n\nそれはSATな320変数3-SAT問題170058143.cnf。解けて当然だと思ってたのだが、5000秒タイムアウトで解けない。\n色々設定変えて、やっと解けたらこんな感じ：\n\n```\n$ splr ~\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n170058143.cnf                                      320,1120 |time:  1574.08\n #conflict:    6289871, #decision:      7955609, #propagate:      306206577\n  Assignment|#rem:      320, #ass:        0, #elm:        0, prg%:   0.0000\n      Clause|Remv:   195608, LBD2:    78093, Binc:    18750, Perm:    19871\n     Restart|#BLK:        1, #RST:    24004, trgr:        2, peak:       64\n         LBD|avrg:  14.0921, trnd:   0.9422, depG:   3.3053, \u002Fdpc:     1.08\n    Conflict|tASG:   0.9536, cLvl:    18.99, bLvl:    17.84, \u002Fppc:    46.90\n        misc|elim:        5, #sub:        0, core:        0, \u002Fcpr:   227.20\n      Result|file: .\u002Fans_170058143.cnf\ns SATISFIABLE: \u002FUsers\u002Fnash\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n```                                         \n\n部分解には至らずに、たまたま解を見つけたということか！\n\nなんというか、どうしたもんか。すげーな。\n\n## 2021-03-17\n\n散発的網羅的なclause vivificationが効くようだ。相当に重複節が生成されている。",bodyHtml:"\u003Cp\u003EまともなSAT solverなら250変数の3-SATなんて1秒程度で解け、その求解速度なんてなんの尺度にもならないものだろう。\nなので最近のSplrの開発は360変数の3-SATをマイクロベンチマークに使っている。\n最近はまあ「そこそこ待ち遠しくない時間」でSAT問題、UNSAT問題どちらも解けるようになってきていた。\nで、やっとSAT competition 2021での問題をつまみ食いし始めたのだけど、ある問題に衝撃を受けてしまった。\u003C\u002Fp\u003E\n\u003Cp\u003EそれはSATな320変数3-SAT問題170058143.cnf。解けて当然だと思ってたのだが、5000秒タイムアウトで解けない。\n色々設定変えて、やっと解けたらこんな感じ：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E$ splr ~\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n170058143.cnf                                      320,1120 |time:  1574.08\n #conflict:    6289871, #decision:      7955609, #propagate:      306206577\n  Assignment|#rem:      320, #ass:        0, #elm:        0, prg%:   0.0000\n      Clause|Remv:   195608, LBD2:    78093, Binc:    18750, Perm:    19871\n     Restart|#BLK:        1, #RST:    24004, trgr:        2, peak:       64\n         LBD|avrg:  14.0921, trnd:   0.9422, depG:   3.3053, \u002Fdpc:     1.08\n    Conflict|tASG:   0.9536, cLvl:    18.99, bLvl:    17.84, \u002Fppc:    46.90\n        misc|elim:        5, #sub:        0, core:        0, \u002Fcpr:   227.20\n      Result|file: .\u002Fans_170058143.cnf\ns SATISFIABLE: \u002FUsers\u002Fnash\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E部分解には至らずに、たまたま解を見つけたということか！\u003C\u002Fp\u003E\n\u003Cp\u003Eなんというか、どうしたもんか。すげーな。\u003C\u002Fp\u003E\n\u003Ch2\u003E2021-03-17\u003C\u002Fh2\u003E\n\u003Cp\u003E散発的網羅的なclause vivificationが効くようだ。相当に重複節が生成されている。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2021",base:"2021-03-16-3SAT-SC20-170058143.json",ext:".json",sourceBase:"2021-03-16-3SAT-SC20-170058143.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"衝撃の320変数3-SAT"},subtitle:{writable:true,enumerable:true,value:"at Sat Competition 2020"},date:{writable:true,enumerable:true,value:"2021-03-17T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT"]},bodyContent:{writable:true,enumerable:true,value:"まともなSAT solverなら250変数の3-SATなんて1秒程度で解け、その求解速度なんてなんの尺度にもならないものだろう。\nなので最近のSplrの開発は360変数の3-SATをマイクロベンチマークに使っている。\n最近はまあ「そこそこ待ち遠しくない時間」でSAT問題、UNSAT問題どちらも解けるようになってきていた。\nで、やっとSAT competition 2021での問題をつまみ食いし始めたのだけど、ある問題に衝撃を受けてしまった。\n\nそれはSATな320変数3-SAT問題170058143.cnf。解けて当然だと思ってたのだが、5000秒タイムアウトで解けない。\n色々設定変えて、やっと解けたらこんな感じ：\n\n```\n$ splr ~\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n170058143.cnf                                      320,1120 |time:  1574.08\n #conflict:    6289871, #decision:      7955609, #propagate:      306206577\n  Assignment|#rem:      320, #ass:        0, #elm:        0, prg%:   0.0000\n      Clause|Remv:   195608, LBD2:    78093, Binc:    18750, Perm:    19871\n     Restart|#BLK:        1, #RST:    24004, trgr:        2, peak:       64\n         LBD|avrg:  14.0921, trnd:   0.9422, depG:   3.3053, \u002Fdpc:     1.08\n    Conflict|tASG:   0.9536, cLvl:    18.99, bLvl:    17.84, \u002Fppc:    46.90\n        misc|elim:        5, #sub:        0, core:        0, \u002Fcpr:   227.20\n      Result|file: .\u002Fans_170058143.cnf\ns SATISFIABLE: \u002FUsers\u002Fnash\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n```                                         \n\n部分解には至らずに、たまたま解を見つけたということか！\n\nなんというか、どうしたもんか。すげーな。\n\n## 2021-03-17\n\n散発的網羅的なclause vivificationが効くようだ。相当に重複節が生成されている。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003EまともなSAT solverなら250変数の3-SATなんて1秒程度で解け、その求解速度なんてなんの尺度にもならないものだろう。\nなので最近のSplrの開発は360変数の3-SATをマイクロベンチマークに使っている。\n最近はまあ「そこそこ待ち遠しくない時間」でSAT問題、UNSAT問題どちらも解けるようになってきていた。\nで、やっとSAT competition 2021での問題をつまみ食いし始めたのだけど、ある問題に衝撃を受けてしまった。\u003C\u002Fp\u003E\n\u003Cp\u003EそれはSATな320変数3-SAT問題170058143.cnf。解けて当然だと思ってたのだが、5000秒タイムアウトで解けない。\n色々設定変えて、やっと解けたらこんな感じ：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E$ splr ~\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n170058143.cnf                                      320,1120 |time:  1574.08\n #conflict:    6289871, #decision:      7955609, #propagate:      306206577\n  Assignment|#rem:      320, #ass:        0, #elm:        0, prg%:   0.0000\n      Clause|Remv:   195608, LBD2:    78093, Binc:    18750, Perm:    19871\n     Restart|#BLK:        1, #RST:    24004, trgr:        2, peak:       64\n         LBD|avrg:  14.0921, trnd:   0.9422, depG:   3.3053, \u002Fdpc:     1.08\n    Conflict|tASG:   0.9536, cLvl:    18.99, bLvl:    17.84, \u002Fppc:    46.90\n        misc|elim:        5, #sub:        0, core:        0, \u002Fcpr:   227.20\n      Result|file: .\u002Fans_170058143.cnf\ns SATISFIABLE: \u002FUsers\u002Fnash\u002FLibrary\u002FSAT\u002FSC20\u002F170058143.cnf\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E部分解には至らずに、たまたま解を見つけたということか！\u003C\u002Fp\u003E\n\u003Cp\u003Eなんというか、どうしたもんか。すげーな。\u003C\u002Fp\u003E\n\u003Ch2\u003E2021-03-17\u003C\u002Fh2\u003E\n\u003Cp\u003E散発的網羅的なclause vivificationが効くようだ。相当に重複節が生成されている。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2021"},base:{writable:true,enumerable:true,value:"2021-03-16-3SAT-SC20-170058143.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2021-03-16-3SAT-SC20-170058143.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});