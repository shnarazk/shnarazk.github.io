__NUXT_JSONP__("/2021/2021-04-10-splr-vivification", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"New Implementation of vivification on Splr",subtitle:"vivification part 4",date:"2021-05-04T00:00:00.000Z",tags:["SAT","vivification","splr"],banner:"https:\u002F\u002Funsplash.com\u002Fphotos\u002FGWtOJTUyDfc\u002Fdownload?force=true&w=2400",banner_caption:"https:\u002F\u002Funsplash.com\u002Fphotos\u002FGWtOJTUyDfc",bodyContent:"### 2021-04-10\n\nSplr-0.7.1で発見された決定性誤りバグの一因がどうもvivificationにあるようなので、徹底的に見直してみた。\nその結果、バグ修正の副産物として大変更に至りました。\n\nこれまではひたすら論文[1]のオリジナル疑似コードに忠実な実装を心がけていた:\n\n![](\u002Fimg\u002F2020\u002F07-05\u002Fvivi-algo3.jpg)\n\nここで`confilctAnalysis`の引数は\n\n1. $\\phi$ -- 論理式式\n1. $D$ -- 仮定されたリテラル列（なぜtrailではいけないのだろう）\n1. $R$ - 矛盾節\n\n見ての通り、節を追加して伝播させて、節を削除して、ということを繰り返している。\nそのためsandboxなんてものをサブモジュールに追加したりしていたのだけど、この\"clause vivification\"とは\n\n- 節に含まれるリテラルを順に否定して行った時に、いくつ目のリテラルで（この節ひいては式が）矛盾するかを考え、それ以上のリテラルはあっても無駄なので省きましょう\n\nというだけのこと。だったらこの通りに実装すればいいんじゃない？\n\n```rust\n  let c = cdb.clause[cid];\n  for (i, lit) in c.lits.iter().enumerate() {  \u002F\u002F 順番に\n    asg.assign_by_decision(!lit); \u002F\u002F 否定してみて\n    if asg.propagate().is_some()  \u002F\u002F 矛盾した時に\n       && i \u003C c.lits.len() \u002F\u002F 短くなっていたら\n    {\n      cdb.strengthen_by_vivification(cid, i);  \u002F\u002F iまでのリテラルに縮退\n      break;\n    }\n  }\n  asg.cancel_until(self.root_level); \u002F\u002F クリーンアップ\n```\n\n節の出し入れが一切なくなってclauseDB的な負荷が一切消えてしまった!\nこれで決まりだな。\n\n### 2021-04-16\n\nそしてこれがSplr-0.7.1がさらに1週間リリースできなかった原因になってしまった。\nうん、全くダメな考えだった。論外だった。\n\n### 2021-05-04\n\nだめじゃない。ダメなのは矛盾解析の部分で、決定リテラルを積み重ねるこの方法はずっとスマートな気がしてきた。少なくとも、これがSplr-0.7.1におけるvivificationの決定性判定間違いの原因ではない。\n\nというわけでこれで行こう：\n\n```rust\n  let c = cdb.clause[cid];\n  for lit in c.lits.iter().take(c.lits.len() - 1) {  \u002F\u002F 順番に\n    asg.assign_by_decision(!lit);       \u002F\u002F 否定してみて\n    if let Some(cc) = asg.propagate() { \u002F\u002F 矛盾した時に\n      if cc == cid {                    \u002F\u002F それが対象節なら、\n        let vec = conflict_analyze(cc); \u002F\u002F 矛盾解析して\n        cdb.new_clause(vec);            \u002F\u002F 学習節を追加\n        cdb.remove_clause(cid);         \u002F\u002F 対象節を削除\n      }\n      break;\n    }\n  }\n  asg.cancel_until(self.root_level); \u002F\u002F クリーンアップ\n```\n\n## References\n\n[1] C.-M. Li, F. Xiao, M. Luo, F. Manyà, Z. Lü, and Y. Li, “Clause Vivification by Unit Propagation in CDCL SAT Solvers,”* Artif. Intell*., vol. 279, Jul. 2019.",bodyHtml:"\u003Ch3\u003E2021-04-10\u003C\u002Fh3\u003E\n\u003Cp\u003ESplr-0.7.1で発見された決定性誤りバグの一因がどうもvivificationにあるようなので、徹底的に見直してみた。\nその結果、バグ修正の副産物として大変更に至りました。\u003C\u002Fp\u003E\n\u003Cp\u003Eこれまではひたすら論文[1]のオリジナル疑似コードに忠実な実装を心がけていた:\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2020\u002F07-05\u002Fvivi-algo3.jpg\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eここで\u003Ccode\u003EconfilctAnalysis\u003C\u002Fcode\u003Eの引数は\u003C\u002Fp\u003E\n\u003Col\u003E\n\u003Cli\u003E$\\phi$ -- 論理式式\u003C\u002Fli\u003E\n\u003Cli\u003E$D$ -- 仮定されたリテラル列（なぜtrailではいけないのだろう）\u003C\u002Fli\u003E\n\u003Cli\u003E$R$ - 矛盾節\u003C\u002Fli\u003E\n\u003C\u002Fol\u003E\n\u003Cp\u003E見ての通り、節を追加して伝播させて、節を削除して、ということを繰り返している。\nそのためsandboxなんてものをサブモジュールに追加したりしていたのだけど、この&quot;clause vivification&quot;とは\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E節に含まれるリテラルを順に否定して行った時に、いくつ目のリテラルで（この節ひいては式が）矛盾するかを考え、それ以上のリテラルはあっても無駄なので省きましょう\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eというだけのこと。だったらこの通りに実装すればいいんじゃない？\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E c = cdb.clause[cid];\n  \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E (i, lit) \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E c.lits.iter().enumerate() {  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 順番に\u003C\u002Fspan\u003E\n    asg.assign_by_decision(!lit); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 否定してみて\u003C\u002Fspan\u003E\n    \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E asg.propagate().is_some()  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 矛盾した時に\u003C\u002Fspan\u003E\n       &amp;&amp; i &lt; c.lits.len() \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 短くなっていたら\u003C\u002Fspan\u003E\n    {\n      cdb.strengthen_by_vivification(cid, i);  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F iまでのリテラルに縮退\u003C\u002Fspan\u003E\n      \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n    }\n  }\n  asg.cancel_until(\u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.root_level); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F クリーンアップ\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003E節の出し入れが一切なくなってclauseDB的な負荷が一切消えてしまった!\nこれで決まりだな。\u003C\u002Fp\u003E\n\u003Ch3\u003E2021-04-16\u003C\u002Fh3\u003E\n\u003Cp\u003EそしてこれがSplr-0.7.1がさらに1週間リリースできなかった原因になってしまった。\nうん、全くダメな考えだった。論外だった。\u003C\u002Fp\u003E\n\u003Ch3\u003E2021-05-04\u003C\u002Fh3\u003E\n\u003Cp\u003Eだめじゃない。ダメなのは矛盾解析の部分で、決定リテラルを積み重ねるこの方法はずっとスマートな気がしてきた。少なくとも、これがSplr-0.7.1におけるvivificationの決定性判定間違いの原因ではない。\u003C\u002Fp\u003E\n\u003Cp\u003Eというわけでこれで行こう：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E c = cdb.clause[cid];\n  \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E lit \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E c.lits.iter().take(c.lits.len() - \u003Cspan class=\"hljs-number\"\u003E1\u003C\u002Fspan\u003E) {  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 順番に\u003C\u002Fspan\u003E\n    asg.assign_by_decision(!lit);       \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 否定してみて\u003C\u002Fspan\u003E\n    \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(cc) = asg.propagate() { \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 矛盾した時に\u003C\u002Fspan\u003E\n      \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E cc == cid {                    \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F それが対象節なら、\u003C\u002Fspan\u003E\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E vec = conflict_analyze(cc); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 矛盾解析して\u003C\u002Fspan\u003E\n        cdb.new_clause(vec);            \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 学習節を追加\u003C\u002Fspan\u003E\n        cdb.remove_clause(cid);         \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 対象節を削除\u003C\u002Fspan\u003E\n      }\n      \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n    }\n  }\n  asg.cancel_until(\u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.root_level); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F クリーンアップ\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Ch2\u003EReferences\u003C\u002Fh2\u003E\n\u003Cp\u003E[1] C.-M. Li, F. Xiao, M. Luo, F. Manyà, Z. Lü, and Y. Li, “Clause Vivification by Unit Propagation in CDCL SAT Solvers,”* Artif. Intell*., vol. 279, Jul. 2019.\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2021",base:"2021-04-10-splr-vivification.json",ext:".json",sourceBase:"2021-04-10-splr-vivification.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"New Implementation of vivification on Splr"},subtitle:{writable:true,enumerable:true,value:"vivification part 4"},date:{writable:true,enumerable:true,value:"2021-05-04T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT","vivification","splr"]},banner:{writable:true,enumerable:true,value:"https:\u002F\u002Funsplash.com\u002Fphotos\u002FGWtOJTUyDfc\u002Fdownload?force=true&w=2400"},banner_caption:{writable:true,enumerable:true,value:"https:\u002F\u002Funsplash.com\u002Fphotos\u002FGWtOJTUyDfc"},bodyContent:{writable:true,enumerable:true,value:"### 2021-04-10\n\nSplr-0.7.1で発見された決定性誤りバグの一因がどうもvivificationにあるようなので、徹底的に見直してみた。\nその結果、バグ修正の副産物として大変更に至りました。\n\nこれまではひたすら論文[1]のオリジナル疑似コードに忠実な実装を心がけていた:\n\n![](\u002Fimg\u002F2020\u002F07-05\u002Fvivi-algo3.jpg)\n\nここで`confilctAnalysis`の引数は\n\n1. $\\phi$ -- 論理式式\n1. $D$ -- 仮定されたリテラル列（なぜtrailではいけないのだろう）\n1. $R$ - 矛盾節\n\n見ての通り、節を追加して伝播させて、節を削除して、ということを繰り返している。\nそのためsandboxなんてものをサブモジュールに追加したりしていたのだけど、この\"clause vivification\"とは\n\n- 節に含まれるリテラルを順に否定して行った時に、いくつ目のリテラルで（この節ひいては式が）矛盾するかを考え、それ以上のリテラルはあっても無駄なので省きましょう\n\nというだけのこと。だったらこの通りに実装すればいいんじゃない？\n\n```rust\n  let c = cdb.clause[cid];\n  for (i, lit) in c.lits.iter().enumerate() {  \u002F\u002F 順番に\n    asg.assign_by_decision(!lit); \u002F\u002F 否定してみて\n    if asg.propagate().is_some()  \u002F\u002F 矛盾した時に\n       && i \u003C c.lits.len() \u002F\u002F 短くなっていたら\n    {\n      cdb.strengthen_by_vivification(cid, i);  \u002F\u002F iまでのリテラルに縮退\n      break;\n    }\n  }\n  asg.cancel_until(self.root_level); \u002F\u002F クリーンアップ\n```\n\n節の出し入れが一切なくなってclauseDB的な負荷が一切消えてしまった!\nこれで決まりだな。\n\n### 2021-04-16\n\nそしてこれがSplr-0.7.1がさらに1週間リリースできなかった原因になってしまった。\nうん、全くダメな考えだった。論外だった。\n\n### 2021-05-04\n\nだめじゃない。ダメなのは矛盾解析の部分で、決定リテラルを積み重ねるこの方法はずっとスマートな気がしてきた。少なくとも、これがSplr-0.7.1におけるvivificationの決定性判定間違いの原因ではない。\n\nというわけでこれで行こう：\n\n```rust\n  let c = cdb.clause[cid];\n  for lit in c.lits.iter().take(c.lits.len() - 1) {  \u002F\u002F 順番に\n    asg.assign_by_decision(!lit);       \u002F\u002F 否定してみて\n    if let Some(cc) = asg.propagate() { \u002F\u002F 矛盾した時に\n      if cc == cid {                    \u002F\u002F それが対象節なら、\n        let vec = conflict_analyze(cc); \u002F\u002F 矛盾解析して\n        cdb.new_clause(vec);            \u002F\u002F 学習節を追加\n        cdb.remove_clause(cid);         \u002F\u002F 対象節を削除\n      }\n      break;\n    }\n  }\n  asg.cancel_until(self.root_level); \u002F\u002F クリーンアップ\n```\n\n## References\n\n[1] C.-M. Li, F. Xiao, M. Luo, F. Manyà, Z. Lü, and Y. Li, “Clause Vivification by Unit Propagation in CDCL SAT Solvers,”* Artif. Intell*., vol. 279, Jul. 2019."},bodyHtml:{writable:true,enumerable:true,value:"\u003Ch3\u003E2021-04-10\u003C\u002Fh3\u003E\n\u003Cp\u003ESplr-0.7.1で発見された決定性誤りバグの一因がどうもvivificationにあるようなので、徹底的に見直してみた。\nその結果、バグ修正の副産物として大変更に至りました。\u003C\u002Fp\u003E\n\u003Cp\u003Eこれまではひたすら論文[1]のオリジナル疑似コードに忠実な実装を心がけていた:\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2020\u002F07-05\u002Fvivi-algo3.jpg\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eここで\u003Ccode\u003EconfilctAnalysis\u003C\u002Fcode\u003Eの引数は\u003C\u002Fp\u003E\n\u003Col\u003E\n\u003Cli\u003E$\\phi$ -- 論理式式\u003C\u002Fli\u003E\n\u003Cli\u003E$D$ -- 仮定されたリテラル列（なぜtrailではいけないのだろう）\u003C\u002Fli\u003E\n\u003Cli\u003E$R$ - 矛盾節\u003C\u002Fli\u003E\n\u003C\u002Fol\u003E\n\u003Cp\u003E見ての通り、節を追加して伝播させて、節を削除して、ということを繰り返している。\nそのためsandboxなんてものをサブモジュールに追加したりしていたのだけど、この&quot;clause vivification&quot;とは\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E節に含まれるリテラルを順に否定して行った時に、いくつ目のリテラルで（この節ひいては式が）矛盾するかを考え、それ以上のリテラルはあっても無駄なので省きましょう\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eというだけのこと。だったらこの通りに実装すればいいんじゃない？\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E c = cdb.clause[cid];\n  \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E (i, lit) \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E c.lits.iter().enumerate() {  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 順番に\u003C\u002Fspan\u003E\n    asg.assign_by_decision(!lit); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 否定してみて\u003C\u002Fspan\u003E\n    \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E asg.propagate().is_some()  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 矛盾した時に\u003C\u002Fspan\u003E\n       &amp;&amp; i &lt; c.lits.len() \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 短くなっていたら\u003C\u002Fspan\u003E\n    {\n      cdb.strengthen_by_vivification(cid, i);  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F iまでのリテラルに縮退\u003C\u002Fspan\u003E\n      \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n    }\n  }\n  asg.cancel_until(\u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.root_level); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F クリーンアップ\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003E節の出し入れが一切なくなってclauseDB的な負荷が一切消えてしまった!\nこれで決まりだな。\u003C\u002Fp\u003E\n\u003Ch3\u003E2021-04-16\u003C\u002Fh3\u003E\n\u003Cp\u003EそしてこれがSplr-0.7.1がさらに1週間リリースできなかった原因になってしまった。\nうん、全くダメな考えだった。論外だった。\u003C\u002Fp\u003E\n\u003Ch3\u003E2021-05-04\u003C\u002Fh3\u003E\n\u003Cp\u003Eだめじゃない。ダメなのは矛盾解析の部分で、決定リテラルを積み重ねるこの方法はずっとスマートな気がしてきた。少なくとも、これがSplr-0.7.1におけるvivificationの決定性判定間違いの原因ではない。\u003C\u002Fp\u003E\n\u003Cp\u003Eというわけでこれで行こう：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E c = cdb.clause[cid];\n  \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E lit \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E c.lits.iter().take(c.lits.len() - \u003Cspan class=\"hljs-number\"\u003E1\u003C\u002Fspan\u003E) {  \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 順番に\u003C\u002Fspan\u003E\n    asg.assign_by_decision(!lit);       \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 否定してみて\u003C\u002Fspan\u003E\n    \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(cc) = asg.propagate() { \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 矛盾した時に\u003C\u002Fspan\u003E\n      \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E cc == cid {                    \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F それが対象節なら、\u003C\u002Fspan\u003E\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E vec = conflict_analyze(cc); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 矛盾解析して\u003C\u002Fspan\u003E\n        cdb.new_clause(vec);            \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 学習節を追加\u003C\u002Fspan\u003E\n        cdb.remove_clause(cid);         \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F 対象節を削除\u003C\u002Fspan\u003E\n      }\n      \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n    }\n  }\n  asg.cancel_until(\u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.root_level); \u003Cspan class=\"hljs-comment\"\u003E\u002F\u002F クリーンアップ\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Ch2\u003EReferences\u003C\u002Fh2\u003E\n\u003Cp\u003E[1] C.-M. Li, F. Xiao, M. Luo, F. Manyà, Z. Lü, and Y. Li, “Clause Vivification by Unit Propagation in CDCL SAT Solvers,”* Artif. Intell*., vol. 279, Jul. 2019.\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2021"},base:{writable:true,enumerable:true,value:"2021-04-10-splr-vivification.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2021-04-10-splr-vivification.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});