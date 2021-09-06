__NUXT_JSONP__("/2021/2021-08-31-kissat-on-macos", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Kissat on macOS",subtitle:"Abort!",date:"2021-08-31T00:00:00.000Z",tags:["SAT"],bodyContent:"KissatをNix package化しようとして、OSの違いに阻まれてしまった。\nこりゃ手に負えない。\n\n```\n$ .\u002Fresult\u002Fbin\u002Fkissat ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf proof                 \nc ---- [ banner ] ------------------------------------------------------------\nc                                                                             \nc KISSAT SAT Solver                                                           \nc Copyright (c) 2019-2021 Armin Biere JKU Linz                                \nc                                                                             \nc Version 2.0.0 unknown                                                       \nc clang version 7.1.0 (tags\u002FRELEASE_710\u002Ffinal) -W -Wall -O3 -DNDEBUG          \nc Mon Aug 30 23:51:02 UTC 2021 Darwin demorgan.local 20.6.0 x86_64            \nc                                                                             \nc ---- [ proving ] -----------------------------------------------------------\nc                                                                             \nc opened and writing proof to DRAT file:                                      \nc                                                                             \nc   proof                                                                     \nc                                                                             \nc ---- [ parsing ] -----------------------------------------------------------\nc                                                                             \nc opened and reading DIMACS file:                                             \nc                                                                             \nc   ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf                                         \nc                                                                             \nc parsed 'p cnf 2282 6586' header                                             \nc closing input after reading 96737 bytes (94 KB)                             \nc finished parsing after 0.00 seconds                                         \nc                                                                             \nc ---- [ solving ] -----------------------------------------------------------\nc                                                                             \nc  seconds switched rate      trail    variables                              \nc         MB reductions conflicts glue      remaining                         \nc          level restarts redundant irredundant                               \nc                                                                             \nc *  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc {  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc i  0.00  0 128 0 0  0 128   1   0 11% 0 6584 2279 100%                      \nc i  0.01  0 230 0 0  1 77   6   2 38% 1 6584 2277 100%                       \nc -  0.01  0 260 0 1  8 9 301 206 60% 2 6576 2277 100%                        \nc i  0.01  0 152 0 1 124 20 664 506 47% 2 6576 2263 99%                       \nc }  0.02  0 149 1 1 220 30 1000 741 50% 2 6576 2263 99%                      \nc [  0.02  0 0 1 1 220 0 1000 741 0% 0 6576 2263 99%                          \nc O  0.02  0 143 1 1 220 31 1004 672 21% 2 6538 2263 99%                      \nc i  0.02  0 199 1 1 220 41 1009 675 55% 2 6538 2261 99%\nc i  0.02  0 169 1 1 220 24 1025 682 38% 2 6538 2257 99%\n..\u002Fsrc\u002Fproof.c:269: check_repeated_proof_lines: Coverage goal `proof-\u003Eunits[punit]' reached.\nc caught signal 6 (SIGABRT)\nc\n```\n\n## 2021-09-07\n\n手に負えないと思ったけど、ちょっとだけコードを追ってみると単なる境界条件の判定ミスだ。\n丁寧な表現でissue立てたけど返事がこん。\n今週返事がなければ修正パッチ込みでNixパッケージ化しよう！",bodyHtml:"\u003Cp\u003EKissatをNix package化しようとして、OSの違いに阻まれてしまった。\nこりゃ手に負えない。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E$ .\u002Fresult\u002Fbin\u002Fkissat ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf proof                 \nc ---- [ banner ] ------------------------------------------------------------\nc                                                                             \nc KISSAT SAT Solver                                                           \nc Copyright (c) 2019-2021 Armin Biere JKU Linz                                \nc                                                                             \nc Version 2.0.0 unknown                                                       \nc clang version 7.1.0 (tags\u002FRELEASE_710\u002Ffinal) -W -Wall -O3 -DNDEBUG          \nc Mon Aug 30 23:51:02 UTC 2021 Darwin demorgan.local 20.6.0 x86_64            \nc                                                                             \nc ---- [ proving ] -----------------------------------------------------------\nc                                                                             \nc opened and writing proof to DRAT file:                                      \nc                                                                             \nc   proof                                                                     \nc                                                                             \nc ---- [ parsing ] -----------------------------------------------------------\nc                                                                             \nc opened and reading DIMACS file:                                             \nc                                                                             \nc   ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf                                         \nc                                                                             \nc parsed 'p cnf 2282 6586' header                                             \nc closing input after reading 96737 bytes (94 KB)                             \nc finished parsing after 0.00 seconds                                         \nc                                                                             \nc ---- [ solving ] -----------------------------------------------------------\nc                                                                             \nc  seconds switched rate      trail    variables                              \nc         MB reductions conflicts glue      remaining                         \nc          level restarts redundant irredundant                               \nc                                                                             \nc *  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc {  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc i  0.00  0 128 0 0  0 128   1   0 11% 0 6584 2279 100%                      \nc i  0.01  0 230 0 0  1 77   6   2 38% 1 6584 2277 100%                       \nc -  0.01  0 260 0 1  8 9 301 206 60% 2 6576 2277 100%                        \nc i  0.01  0 152 0 1 124 20 664 506 47% 2 6576 2263 99%                       \nc }  0.02  0 149 1 1 220 30 1000 741 50% 2 6576 2263 99%                      \nc [  0.02  0 0 1 1 220 0 1000 741 0% 0 6576 2263 99%                          \nc O  0.02  0 143 1 1 220 31 1004 672 21% 2 6538 2263 99%                      \nc i  0.02  0 199 1 1 220 41 1009 675 55% 2 6538 2261 99%\nc i  0.02  0 169 1 1 220 24 1025 682 38% 2 6538 2257 99%\n..\u002Fsrc\u002Fproof.c:269: check_repeated_proof_lines: Coverage goal `proof-&gt;units[punit]' reached.\nc caught signal 6 (SIGABRT)\nc\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Ch2\u003E2021-09-07\u003C\u002Fh2\u003E\n\u003Cp\u003E手に負えないと思ったけど、ちょっとだけコードを追ってみると単なる境界条件の判定ミスだ。\n丁寧な表現でissue立てたけど返事がこん。\n今週返事がなければ修正パッチ込みでNixパッケージ化しよう！\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2021",base:"2021-08-31-kissat-on-macos.json",ext:".json",sourceBase:"2021-08-31-kissat-on-macos.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Kissat on macOS"},subtitle:{writable:true,enumerable:true,value:"Abort!"},date:{writable:true,enumerable:true,value:"2021-08-31T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT"]},bodyContent:{writable:true,enumerable:true,value:"KissatをNix package化しようとして、OSの違いに阻まれてしまった。\nこりゃ手に負えない。\n\n```\n$ .\u002Fresult\u002Fbin\u002Fkissat ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf proof                 \nc ---- [ banner ] ------------------------------------------------------------\nc                                                                             \nc KISSAT SAT Solver                                                           \nc Copyright (c) 2019-2021 Armin Biere JKU Linz                                \nc                                                                             \nc Version 2.0.0 unknown                                                       \nc clang version 7.1.0 (tags\u002FRELEASE_710\u002Ffinal) -W -Wall -O3 -DNDEBUG          \nc Mon Aug 30 23:51:02 UTC 2021 Darwin demorgan.local 20.6.0 x86_64            \nc                                                                             \nc ---- [ proving ] -----------------------------------------------------------\nc                                                                             \nc opened and writing proof to DRAT file:                                      \nc                                                                             \nc   proof                                                                     \nc                                                                             \nc ---- [ parsing ] -----------------------------------------------------------\nc                                                                             \nc opened and reading DIMACS file:                                             \nc                                                                             \nc   ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf                                         \nc                                                                             \nc parsed 'p cnf 2282 6586' header                                             \nc closing input after reading 96737 bytes (94 KB)                             \nc finished parsing after 0.00 seconds                                         \nc                                                                             \nc ---- [ solving ] -----------------------------------------------------------\nc                                                                             \nc  seconds switched rate      trail    variables                              \nc         MB reductions conflicts glue      remaining                         \nc          level restarts redundant irredundant                               \nc                                                                             \nc *  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc {  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc i  0.00  0 128 0 0  0 128   1   0 11% 0 6584 2279 100%                      \nc i  0.01  0 230 0 0  1 77   6   2 38% 1 6584 2277 100%                       \nc -  0.01  0 260 0 1  8 9 301 206 60% 2 6576 2277 100%                        \nc i  0.01  0 152 0 1 124 20 664 506 47% 2 6576 2263 99%                       \nc }  0.02  0 149 1 1 220 30 1000 741 50% 2 6576 2263 99%                      \nc [  0.02  0 0 1 1 220 0 1000 741 0% 0 6576 2263 99%                          \nc O  0.02  0 143 1 1 220 31 1004 672 21% 2 6538 2263 99%                      \nc i  0.02  0 199 1 1 220 41 1009 675 55% 2 6538 2261 99%\nc i  0.02  0 169 1 1 220 24 1025 682 38% 2 6538 2257 99%\n..\u002Fsrc\u002Fproof.c:269: check_repeated_proof_lines: Coverage goal `proof-\u003Eunits[punit]' reached.\nc caught signal 6 (SIGABRT)\nc\n```\n\n## 2021-09-07\n\n手に負えないと思ったけど、ちょっとだけコードを追ってみると単なる境界条件の判定ミスだ。\n丁寧な表現でissue立てたけど返事がこん。\n今週返事がなければ修正パッチ込みでNixパッケージ化しよう！"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003EKissatをNix package化しようとして、OSの違いに阻まれてしまった。\nこりゃ手に負えない。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E$ .\u002Fresult\u002Fbin\u002Fkissat ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf proof                 \nc ---- [ banner ] ------------------------------------------------------------\nc                                                                             \nc KISSAT SAT Solver                                                           \nc Copyright (c) 2019-2021 Armin Biere JKU Linz                                \nc                                                                             \nc Version 2.0.0 unknown                                                       \nc clang version 7.1.0 (tags\u002FRELEASE_710\u002Ffinal) -W -Wall -O3 -DNDEBUG          \nc Mon Aug 30 23:51:02 UTC 2021 Darwin demorgan.local 20.6.0 x86_64            \nc                                                                             \nc ---- [ proving ] -----------------------------------------------------------\nc                                                                             \nc opened and writing proof to DRAT file:                                      \nc                                                                             \nc   proof                                                                     \nc                                                                             \nc ---- [ parsing ] -----------------------------------------------------------\nc                                                                             \nc opened and reading DIMACS file:                                             \nc                                                                             \nc   ..\u002FSAT\u002Fkissat\u002Ftest\u002Fcnf\u002Fadd128.cnf                                         \nc                                                                             \nc parsed 'p cnf 2282 6586' header                                             \nc closing input after reading 96737 bytes (94 KB)                             \nc finished parsing after 0.00 seconds                                         \nc                                                                             \nc ---- [ solving ] -----------------------------------------------------------\nc                                                                             \nc  seconds switched rate      trail    variables                              \nc         MB reductions conflicts glue      remaining                         \nc          level restarts redundant irredundant                               \nc                                                                             \nc *  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc {  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           \nc i  0.00  0 128 0 0  0 128   1   0 11% 0 6584 2279 100%                      \nc i  0.01  0 230 0 0  1 77   6   2 38% 1 6584 2277 100%                       \nc -  0.01  0 260 0 1  8 9 301 206 60% 2 6576 2277 100%                        \nc i  0.01  0 152 0 1 124 20 664 506 47% 2 6576 2263 99%                       \nc }  0.02  0 149 1 1 220 30 1000 741 50% 2 6576 2263 99%                      \nc [  0.02  0 0 1 1 220 0 1000 741 0% 0 6576 2263 99%                          \nc O  0.02  0 143 1 1 220 31 1004 672 21% 2 6538 2263 99%                      \nc i  0.02  0 199 1 1 220 41 1009 675 55% 2 6538 2261 99%\nc i  0.02  0 169 1 1 220 24 1025 682 38% 2 6538 2257 99%\n..\u002Fsrc\u002Fproof.c:269: check_repeated_proof_lines: Coverage goal `proof-&gt;units[punit]' reached.\nc caught signal 6 (SIGABRT)\nc\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Ch2\u003E2021-09-07\u003C\u002Fh2\u003E\n\u003Cp\u003E手に負えないと思ったけど、ちょっとだけコードを追ってみると単なる境界条件の判定ミスだ。\n丁寧な表現でissue立てたけど返事がこん。\n今週返事がなければ修正パッチ込みでNixパッケージ化しよう！\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2021"},base:{writable:true,enumerable:true,value:"2021-08-31-kissat-on-macos.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2021-08-31-kissat-on-macos.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});