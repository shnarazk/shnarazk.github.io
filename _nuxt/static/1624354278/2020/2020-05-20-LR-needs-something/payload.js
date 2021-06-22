__NUXT_JSONP__("/2020/2020-05-20-LR-needs-something", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"LR needs something to explore the world",subtitle:"I guess so",date:"2020-05-21T00:00:00.000Z",tags:["SAT"],bodyContent:"引き続きよくわかってない人の意見の連投ですが。\n\n## LRのリスタート問題\n\nLR はよさそうなんだけども、そんなにいいならリスタートの立場はどうなる？\n矛盾発生率の最適化を達成していて何故リスタートが必要になるのだろうか。\n\nしかし何かそのようなものが必要なことはすぐわかる。\n以前も書いたような気がするがリスタートはリスタートであって、決してリセットではないのだ。\nEVSIDS も含めた変数選択ヒューリスティックスは割当て後にその使われた変数に値を割り当てるもので、使われてない変数に脚光を当てるものではない。\n従って、リスタートを掛けても優先度が高い変数間の順序が変わるだけと書いてもそれほど言い過ぎというわけではないだろう。\nもちろん順序を入れ替えることによってリスタート後の伝播の方向がこれまでと違う方向へと向かうことはあるけども、いきなり極端に違う変数が選ばれるものではない（という去年の経験）。\n\nさて、LRはあくまでみた事のある変数の中での順序づけであり、それが変数全体の中での最適解とはとても言えない。\nそして、矛盾から生成される学習節の LBD 的なよさとも無関係である。\n従って、もしLBD が悪い学習節が生成される傾向にあるならば、LRといえどもそれなりの対応が必要になるはずである。\n\nそれはどういうものかというと、\n\n* 試していない変数の評価を行う（そのためには割当てを実行しなければならない）。そのためにはリスタートが必要。\n* 単にそのような変数への割当て評価を行っただけでは、decay rateが高い状況では結局無視されてしまうので、decay rateの一時的な修正か何かが必要。\n\nということではなかろうか（decay rate を下げる云々は昨日の複数ヒューリスティックスの併用を念頭に置いている）。\nいっそのことdecay rate の違う二つのLRを使おうか。あるいはdecay rateを初期値に戻そうか。。。\n\nというわけでリスタートは実は不十分でさらにexploreのための補助となる仕組みが必要ではなかろうか、という作業仮説でした。\n\n```rust\n#[derive(Eq, Ord, PartialEq, PartialOrd)]\nstruct VarTimestamp {\n    timestamp: usize,\n    vi: VarId,\n}\n\nimpl VarSelectIF for AssignStack {\n    fn force_select_iter(&mut self, ...) {\n        let mut heap: BinaryHeap\u003CVarTimestamp\u003E = BinaryHeap::new();\n        let size: usize = todo!();\n        for v in self.var.iter().skip(1) {\n            if self.assign[v.index].is_some() || v.is(Flag::ELIMINATED) {\n                continue;\n            }\n            if let Some(top) = heap.peek() {\n                if v.timestamp \u003C top.timestamp {\n                    heap.push(VarTimestamp::from(v));\n                    if size \u003C heap.len() {\n                        heap.pop();\n                    }\n                }\n            }\n        }\n        for v in heap.iter() {\n            let lit = Lit::from_assign(v.vi, self.var[v.vi].is(Flag::PHASE));\n            self.temp_order.push(lit);\n        }\n    }\n```\n\n## 2020-05-21\n\nうまくいかぬ。exploreの契機はworse LBDではないのかもしれない。\n\n![](https:\u002F\u002F2.bp.blogspot.com\u002F-hMADLxB1puo\u002FVMIvawjKgWI\u002FAAAAAAAAq8E\u002F2bgLT3inaSk\u002Fs400\u002Fcooking15_rangiri.png)",bodyHtml:"\u003Cp\u003E引き続きよくわかってない人の意見の連投ですが。\u003C\u002Fp\u003E\n\u003Ch2\u003ELRのリスタート問題\u003C\u002Fh2\u003E\n\u003Cp\u003ELR はよさそうなんだけども、そんなにいいならリスタートの立場はどうなる？\n矛盾発生率の最適化を達成していて何故リスタートが必要になるのだろうか。\u003C\u002Fp\u003E\n\u003Cp\u003Eしかし何かそのようなものが必要なことはすぐわかる。\n以前も書いたような気がするがリスタートはリスタートであって、決してリセットではないのだ。\nEVSIDS も含めた変数選択ヒューリスティックスは割当て後にその使われた変数に値を割り当てるもので、使われてない変数に脚光を当てるものではない。\n従って、リスタートを掛けても優先度が高い変数間の順序が変わるだけと書いてもそれほど言い過ぎというわけではないだろう。\nもちろん順序を入れ替えることによってリスタート後の伝播の方向がこれまでと違う方向へと向かうことはあるけども、いきなり極端に違う変数が選ばれるものではない（という去年の経験）。\u003C\u002Fp\u003E\n\u003Cp\u003Eさて、LRはあくまでみた事のある変数の中での順序づけであり、それが変数全体の中での最適解とはとても言えない。\nそして、矛盾から生成される学習節の LBD 的なよさとも無関係である。\n従って、もしLBD が悪い学習節が生成される傾向にあるならば、LRといえどもそれなりの対応が必要になるはずである。\u003C\u002Fp\u003E\n\u003Cp\u003Eそれはどういうものかというと、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E試していない変数の評価を行う（そのためには割当てを実行しなければならない）。そのためにはリスタートが必要。\u003C\u002Fli\u003E\n\u003Cli\u003E単にそのような変数への割当て評価を行っただけでは、decay rateが高い状況では結局無視されてしまうので、decay rateの一時的な修正か何かが必要。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eということではなかろうか（decay rate を下げる云々は昨日の複数ヒューリスティックスの併用を念頭に置いている）。\nいっそのことdecay rate の違う二つのLRを使おうか。あるいはdecay rateを初期値に戻そうか。。。\u003C\u002Fp\u003E\n\u003Cp\u003Eというわけでリスタートは実は不十分でさらにexploreのための補助となる仕組みが必要ではなかろうか、という作業仮説でした。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-meta\"\u003E#[derive(Eq, Ord, PartialEq, PartialOrd)]\u003C\u002Fspan\u003E\n\u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Estruct\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EVarTimestamp\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E {\n    timestamp: \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E,\n    vi: VarId,\n}\n\n\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E VarSelectIF \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E AssignStack {\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eforce_select_iter\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, ...) {\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E heap: BinaryHeap&lt;VarTimestamp&gt; = BinaryHeap::new();\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E size: \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E = todo!();\n        \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E v \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.var.iter().skip(\u003Cspan class=\"hljs-number\"\u003E1\u003C\u002Fspan\u003E) {\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.assign[v.index].is_some() || v.is(Flag::ELIMINATED) {\n                \u003Cspan class=\"hljs-keyword\"\u003Econtinue\u003C\u002Fspan\u003E;\n            }\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(top) = heap.peek() {\n                \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E v.timestamp &lt; top.timestamp {\n                    heap.push(VarTimestamp::from(v));\n                    \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E size &lt; heap.len() {\n                        heap.pop();\n                    }\n                }\n            }\n        }\n        \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E v \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E heap.iter() {\n            \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E lit = Lit::from_assign(v.vi, \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.var[v.vi].is(Flag::PHASE));\n            \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.temp_order.push(lit);\n        }\n    }\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Ch2\u003E2020-05-21\u003C\u002Fh2\u003E\n\u003Cp\u003Eうまくいかぬ。exploreの契機はworse LBDではないのかもしれない。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"https:\u002F\u002F2.bp.blogspot.com\u002F-hMADLxB1puo\u002FVMIvawjKgWI\u002FAAAAAAAAq8E\u002F2bgLT3inaSk\u002Fs400\u002Fcooking15_rangiri.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2020",base:"2020-05-20-LR-needs-something.json",ext:".json",sourceBase:"2020-05-20-LR-needs-something.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"LR needs something to explore the world"},subtitle:{writable:true,enumerable:true,value:"I guess so"},date:{writable:true,enumerable:true,value:"2020-05-21T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT"]},bodyContent:{writable:true,enumerable:true,value:"引き続きよくわかってない人の意見の連投ですが。\n\n## LRのリスタート問題\n\nLR はよさそうなんだけども、そんなにいいならリスタートの立場はどうなる？\n矛盾発生率の最適化を達成していて何故リスタートが必要になるのだろうか。\n\nしかし何かそのようなものが必要なことはすぐわかる。\n以前も書いたような気がするがリスタートはリスタートであって、決してリセットではないのだ。\nEVSIDS も含めた変数選択ヒューリスティックスは割当て後にその使われた変数に値を割り当てるもので、使われてない変数に脚光を当てるものではない。\n従って、リスタートを掛けても優先度が高い変数間の順序が変わるだけと書いてもそれほど言い過ぎというわけではないだろう。\nもちろん順序を入れ替えることによってリスタート後の伝播の方向がこれまでと違う方向へと向かうことはあるけども、いきなり極端に違う変数が選ばれるものではない（という去年の経験）。\n\nさて、LRはあくまでみた事のある変数の中での順序づけであり、それが変数全体の中での最適解とはとても言えない。\nそして、矛盾から生成される学習節の LBD 的なよさとも無関係である。\n従って、もしLBD が悪い学習節が生成される傾向にあるならば、LRといえどもそれなりの対応が必要になるはずである。\n\nそれはどういうものかというと、\n\n* 試していない変数の評価を行う（そのためには割当てを実行しなければならない）。そのためにはリスタートが必要。\n* 単にそのような変数への割当て評価を行っただけでは、decay rateが高い状況では結局無視されてしまうので、decay rateの一時的な修正か何かが必要。\n\nということではなかろうか（decay rate を下げる云々は昨日の複数ヒューリスティックスの併用を念頭に置いている）。\nいっそのことdecay rate の違う二つのLRを使おうか。あるいはdecay rateを初期値に戻そうか。。。\n\nというわけでリスタートは実は不十分でさらにexploreのための補助となる仕組みが必要ではなかろうか、という作業仮説でした。\n\n```rust\n#[derive(Eq, Ord, PartialEq, PartialOrd)]\nstruct VarTimestamp {\n    timestamp: usize,\n    vi: VarId,\n}\n\nimpl VarSelectIF for AssignStack {\n    fn force_select_iter(&mut self, ...) {\n        let mut heap: BinaryHeap\u003CVarTimestamp\u003E = BinaryHeap::new();\n        let size: usize = todo!();\n        for v in self.var.iter().skip(1) {\n            if self.assign[v.index].is_some() || v.is(Flag::ELIMINATED) {\n                continue;\n            }\n            if let Some(top) = heap.peek() {\n                if v.timestamp \u003C top.timestamp {\n                    heap.push(VarTimestamp::from(v));\n                    if size \u003C heap.len() {\n                        heap.pop();\n                    }\n                }\n            }\n        }\n        for v in heap.iter() {\n            let lit = Lit::from_assign(v.vi, self.var[v.vi].is(Flag::PHASE));\n            self.temp_order.push(lit);\n        }\n    }\n```\n\n## 2020-05-21\n\nうまくいかぬ。exploreの契機はworse LBDではないのかもしれない。\n\n![](https:\u002F\u002F2.bp.blogspot.com\u002F-hMADLxB1puo\u002FVMIvawjKgWI\u002FAAAAAAAAq8E\u002F2bgLT3inaSk\u002Fs400\u002Fcooking15_rangiri.png)"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003E引き続きよくわかってない人の意見の連投ですが。\u003C\u002Fp\u003E\n\u003Ch2\u003ELRのリスタート問題\u003C\u002Fh2\u003E\n\u003Cp\u003ELR はよさそうなんだけども、そんなにいいならリスタートの立場はどうなる？\n矛盾発生率の最適化を達成していて何故リスタートが必要になるのだろうか。\u003C\u002Fp\u003E\n\u003Cp\u003Eしかし何かそのようなものが必要なことはすぐわかる。\n以前も書いたような気がするがリスタートはリスタートであって、決してリセットではないのだ。\nEVSIDS も含めた変数選択ヒューリスティックスは割当て後にその使われた変数に値を割り当てるもので、使われてない変数に脚光を当てるものではない。\n従って、リスタートを掛けても優先度が高い変数間の順序が変わるだけと書いてもそれほど言い過ぎというわけではないだろう。\nもちろん順序を入れ替えることによってリスタート後の伝播の方向がこれまでと違う方向へと向かうことはあるけども、いきなり極端に違う変数が選ばれるものではない（という去年の経験）。\u003C\u002Fp\u003E\n\u003Cp\u003Eさて、LRはあくまでみた事のある変数の中での順序づけであり、それが変数全体の中での最適解とはとても言えない。\nそして、矛盾から生成される学習節の LBD 的なよさとも無関係である。\n従って、もしLBD が悪い学習節が生成される傾向にあるならば、LRといえどもそれなりの対応が必要になるはずである。\u003C\u002Fp\u003E\n\u003Cp\u003Eそれはどういうものかというと、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E試していない変数の評価を行う（そのためには割当てを実行しなければならない）。そのためにはリスタートが必要。\u003C\u002Fli\u003E\n\u003Cli\u003E単にそのような変数への割当て評価を行っただけでは、decay rateが高い状況では結局無視されてしまうので、decay rateの一時的な修正か何かが必要。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eということではなかろうか（decay rate を下げる云々は昨日の複数ヒューリスティックスの併用を念頭に置いている）。\nいっそのことdecay rate の違う二つのLRを使おうか。あるいはdecay rateを初期値に戻そうか。。。\u003C\u002Fp\u003E\n\u003Cp\u003Eというわけでリスタートは実は不十分でさらにexploreのための補助となる仕組みが必要ではなかろうか、という作業仮説でした。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-meta\"\u003E#[derive(Eq, Ord, PartialEq, PartialOrd)]\u003C\u002Fspan\u003E\n\u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Estruct\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EVarTimestamp\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E {\n    timestamp: \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E,\n    vi: VarId,\n}\n\n\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E VarSelectIF \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E AssignStack {\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eforce_select_iter\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, ...) {\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E heap: BinaryHeap&lt;VarTimestamp&gt; = BinaryHeap::new();\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E size: \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E = todo!();\n        \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E v \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.var.iter().skip(\u003Cspan class=\"hljs-number\"\u003E1\u003C\u002Fspan\u003E) {\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.assign[v.index].is_some() || v.is(Flag::ELIMINATED) {\n                \u003Cspan class=\"hljs-keyword\"\u003Econtinue\u003C\u002Fspan\u003E;\n            }\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(top) = heap.peek() {\n                \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E v.timestamp &lt; top.timestamp {\n                    heap.push(VarTimestamp::from(v));\n                    \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E size &lt; heap.len() {\n                        heap.pop();\n                    }\n                }\n            }\n        }\n        \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E v \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E heap.iter() {\n            \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E lit = Lit::from_assign(v.vi, \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.var[v.vi].is(Flag::PHASE));\n            \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E.temp_order.push(lit);\n        }\n    }\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Ch2\u003E2020-05-21\u003C\u002Fh2\u003E\n\u003Cp\u003Eうまくいかぬ。exploreの契機はworse LBDではないのかもしれない。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"https:\u002F\u002F2.bp.blogspot.com\u002F-hMADLxB1puo\u002FVMIvawjKgWI\u002FAAAAAAAAq8E\u002F2bgLT3inaSk\u002Fs400\u002Fcooking15_rangiri.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2020"},base:{writable:true,enumerable:true,value:"2020-05-20-LR-needs-something.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2020-05-20-LR-needs-something.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});