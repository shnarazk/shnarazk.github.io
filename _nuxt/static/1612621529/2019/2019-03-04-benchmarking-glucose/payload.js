__NUXT_JSONP__("/2019/2019-03-04-benchmarking-glucose", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Running Glucose in benchmark mode",subtitle:"Glucoseのベンチマークがしたい",date:"2019-03-04T00:00:00.000Z",tags:["glucose","SAT"],bodyContent:"Using my [patched](https:\u002F\u002Fgitlab.com\u002Fsatisfiability01\u002Fglucose\u002Ftree\u002Fv.4.1) glucose, we can get more useful result.\n\n```\nglucose -cpu-lim=TIMEOUT -verb=0 a.cnf result.file\n```\n\n- `-cpu-lim=TIMEOUT` ; you can't insert whitespaces.\n- no progress report if `verb`== 0.\n\nNow the result file contains the stats information.\n\n```\nc restarts              : 2 (2201 conflicts in avg)\nc blocked restarts      : 0 (multiple: 0) \nc last block at restart : 0\nc nb ReduceDB           : 1\nc nb removed Clauses    : 994\nc nb learnts DL2        : 22\nc nb learnts size 2     : 0\nc nb learnts size 1     : 0\nc conflicts             : 4403           (83932 \u002Fsec)\nc decisions             : 5285           (0.00 % random) (100745 \u002Fsec)\nc propagations          : 184690         (3520654 \u002Fsec)\nc nb reduced Clauses    : 0\nc CPU time              : 0.052459 s\n-1 2 -3 -4 5 -6 -7 ...\n```\n\nNice!\n\n### remaining parts\n\nLet's run on the benchmark suit.\n\n```\nparallel -j1 \"glucose -cpu-lim=5000 -verb=0 {} .ans_{\u002F}\" ::: SAT-COMPETITION\u002F*.cnf\n```\n\nThen gather the results into a csv.\n\n```rust\nfn main() { ...\n    for e in fs::read_dir(...)? {\n        let f = e?;\n        if f.file_name().to_string_lossy().starts_with(\".ans_\") {\n            if let Some(t) = read_time(...) {\n                hash.insert(f, t);\n                break;\n            }\n         }\n    }\n    ...\n}\n\nfn read_time(input: ... ) -\u003E Option\u003Cf64\u003E {\n    let re = Regex::new(r\"c CPU time +: ([.0-9]+)\").expect(\"wrong regex\");\n    let mut buf = String::new();\n    while let Ok(k) = input.read_line(&mut buf) {\n        if k == 0 {\n            break;\n        }\n        if let Some(c) = re.captures(&buf) {\n            if let Ok(v) = c[1].parse::\u003Cf64\u003E() {\n                return Some(v)\n            }\n        }\n        buf.clear();\n    }\n    None\n}\n```",bodyHtml:"\u003Cp\u003EUsing my \u003Ca href=\"https:\u002F\u002Fgitlab.com\u002Fsatisfiability01\u002Fglucose\u002Ftree\u002Fv.4.1\"\u003Epatched\u003C\u002Fa\u003E glucose, we can get more useful result.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eglucose -cpu-lim=TIMEOUT -verb=0 a.cnf result.file\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cul\u003E\n\u003Cli\u003E\u003Ccode\u003E-cpu-lim=TIMEOUT\u003C\u002Fcode\u003E ; you can't insert whitespaces.\u003C\u002Fli\u003E\n\u003Cli\u003Eno progress report if \u003Ccode\u003Everb\u003C\u002Fcode\u003E== 0.\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003ENow the result file contains the stats information.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Ec restarts              : 2 (2201 conflicts in avg)\nc blocked restarts      : 0 (multiple: 0) \nc last block at restart : 0\nc nb ReduceDB           : 1\nc nb removed Clauses    : 994\nc nb learnts DL2        : 22\nc nb learnts size 2     : 0\nc nb learnts size 1     : 0\nc conflicts             : 4403           (83932 \u002Fsec)\nc decisions             : 5285           (0.00 % random) (100745 \u002Fsec)\nc propagations          : 184690         (3520654 \u002Fsec)\nc nb reduced Clauses    : 0\nc CPU time              : 0.052459 s\n-1 2 -3 -4 5 -6 -7 ...\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003ENice!\u003C\u002Fp\u003E\n\u003Ch3\u003Eremaining parts\u003C\u002Fh3\u003E\n\u003Cp\u003ELet's run on the benchmark suit.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eparallel -j1 &quot;glucose -cpu-lim=5000 -verb=0 {} .ans_{\u002F}&quot; ::: SAT-COMPETITION\u002F*.cnf\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003EThen gather the results into a csv.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Emain\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E() { ...\n    \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E e \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E fs::read_dir(...)? {\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E f = e?;\n        \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E f.file_name().to_string_lossy().starts_with(\u003Cspan class=\"hljs-string\"\u003E&quot;.ans_&quot;\u003C\u002Fspan\u003E) {\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(t) = read_time(...) {\n                hash.insert(f, t);\n                \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n            }\n         }\n    }\n    ...\n}\n\n\u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eread_time\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(input: ... ) -&gt; \u003Cspan class=\"hljs-built_in\"\u003EOption\u003C\u002Fspan\u003E&lt;\u003Cspan class=\"hljs-built_in\"\u003Ef64\u003C\u002Fspan\u003E&gt; {\n    \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E re = Regex::new(\u003Cspan class=\"hljs-string\"\u003Er&quot;c CPU time +: ([.0-9]+)&quot;\u003C\u002Fspan\u003E).expect(\u003Cspan class=\"hljs-string\"\u003E&quot;wrong regex&quot;\u003C\u002Fspan\u003E);\n    \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E buf = \u003Cspan class=\"hljs-built_in\"\u003EString\u003C\u002Fspan\u003E::new();\n    \u003Cspan class=\"hljs-keyword\"\u003Ewhile\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003EOk\u003C\u002Fspan\u003E(k) = input.read_line(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E buf) {\n        \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E k == \u003Cspan class=\"hljs-number\"\u003E0\u003C\u002Fspan\u003E {\n            \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n        }\n        \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(c) = re.captures(&amp;buf) {\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003EOk\u003C\u002Fspan\u003E(v) = c[\u003Cspan class=\"hljs-number\"\u003E1\u003C\u002Fspan\u003E].parse::&lt;\u003Cspan class=\"hljs-built_in\"\u003Ef64\u003C\u002Fspan\u003E&gt;() {\n                \u003Cspan class=\"hljs-keyword\"\u003Ereturn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(v)\n            }\n        }\n        buf.clear();\n    }\n    \u003Cspan class=\"hljs-literal\"\u003ENone\u003C\u002Fspan\u003E\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E",dir:"article\u002F.json\u002F2019",base:"2019-03-04-benchmarking-glucose.json",ext:".json",sourceBase:"2019-03-04-benchmarking-glucose.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Running Glucose in benchmark mode"},subtitle:{writable:true,enumerable:true,value:"Glucoseのベンチマークがしたい"},date:{writable:true,enumerable:true,value:"2019-03-04T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["glucose","SAT"]},bodyContent:{writable:true,enumerable:true,value:"Using my [patched](https:\u002F\u002Fgitlab.com\u002Fsatisfiability01\u002Fglucose\u002Ftree\u002Fv.4.1) glucose, we can get more useful result.\n\n```\nglucose -cpu-lim=TIMEOUT -verb=0 a.cnf result.file\n```\n\n- `-cpu-lim=TIMEOUT` ; you can't insert whitespaces.\n- no progress report if `verb`== 0.\n\nNow the result file contains the stats information.\n\n```\nc restarts              : 2 (2201 conflicts in avg)\nc blocked restarts      : 0 (multiple: 0) \nc last block at restart : 0\nc nb ReduceDB           : 1\nc nb removed Clauses    : 994\nc nb learnts DL2        : 22\nc nb learnts size 2     : 0\nc nb learnts size 1     : 0\nc conflicts             : 4403           (83932 \u002Fsec)\nc decisions             : 5285           (0.00 % random) (100745 \u002Fsec)\nc propagations          : 184690         (3520654 \u002Fsec)\nc nb reduced Clauses    : 0\nc CPU time              : 0.052459 s\n-1 2 -3 -4 5 -6 -7 ...\n```\n\nNice!\n\n### remaining parts\n\nLet's run on the benchmark suit.\n\n```\nparallel -j1 \"glucose -cpu-lim=5000 -verb=0 {} .ans_{\u002F}\" ::: SAT-COMPETITION\u002F*.cnf\n```\n\nThen gather the results into a csv.\n\n```rust\nfn main() { ...\n    for e in fs::read_dir(...)? {\n        let f = e?;\n        if f.file_name().to_string_lossy().starts_with(\".ans_\") {\n            if let Some(t) = read_time(...) {\n                hash.insert(f, t);\n                break;\n            }\n         }\n    }\n    ...\n}\n\nfn read_time(input: ... ) -\u003E Option\u003Cf64\u003E {\n    let re = Regex::new(r\"c CPU time +: ([.0-9]+)\").expect(\"wrong regex\");\n    let mut buf = String::new();\n    while let Ok(k) = input.read_line(&mut buf) {\n        if k == 0 {\n            break;\n        }\n        if let Some(c) = re.captures(&buf) {\n            if let Ok(v) = c[1].parse::\u003Cf64\u003E() {\n                return Some(v)\n            }\n        }\n        buf.clear();\n    }\n    None\n}\n```"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003EUsing my \u003Ca href=\"https:\u002F\u002Fgitlab.com\u002Fsatisfiability01\u002Fglucose\u002Ftree\u002Fv.4.1\"\u003Epatched\u003C\u002Fa\u003E glucose, we can get more useful result.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eglucose -cpu-lim=TIMEOUT -verb=0 a.cnf result.file\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cul\u003E\n\u003Cli\u003E\u003Ccode\u003E-cpu-lim=TIMEOUT\u003C\u002Fcode\u003E ; you can't insert whitespaces.\u003C\u002Fli\u003E\n\u003Cli\u003Eno progress report if \u003Ccode\u003Everb\u003C\u002Fcode\u003E== 0.\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003ENow the result file contains the stats information.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Ec restarts              : 2 (2201 conflicts in avg)\nc blocked restarts      : 0 (multiple: 0) \nc last block at restart : 0\nc nb ReduceDB           : 1\nc nb removed Clauses    : 994\nc nb learnts DL2        : 22\nc nb learnts size 2     : 0\nc nb learnts size 1     : 0\nc conflicts             : 4403           (83932 \u002Fsec)\nc decisions             : 5285           (0.00 % random) (100745 \u002Fsec)\nc propagations          : 184690         (3520654 \u002Fsec)\nc nb reduced Clauses    : 0\nc CPU time              : 0.052459 s\n-1 2 -3 -4 5 -6 -7 ...\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003ENice!\u003C\u002Fp\u003E\n\u003Ch3\u003Eremaining parts\u003C\u002Fh3\u003E\n\u003Cp\u003ELet's run on the benchmark suit.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eparallel -j1 &quot;glucose -cpu-lim=5000 -verb=0 {} .ans_{\u002F}&quot; ::: SAT-COMPETITION\u002F*.cnf\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003EThen gather the results into a csv.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Emain\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E() { ...\n    \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E e \u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E fs::read_dir(...)? {\n        \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E f = e?;\n        \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E f.file_name().to_string_lossy().starts_with(\u003Cspan class=\"hljs-string\"\u003E&quot;.ans_&quot;\u003C\u002Fspan\u003E) {\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(t) = read_time(...) {\n                hash.insert(f, t);\n                \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n            }\n         }\n    }\n    ...\n}\n\n\u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eread_time\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(input: ... ) -&gt; \u003Cspan class=\"hljs-built_in\"\u003EOption\u003C\u002Fspan\u003E&lt;\u003Cspan class=\"hljs-built_in\"\u003Ef64\u003C\u002Fspan\u003E&gt; {\n    \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E re = Regex::new(\u003Cspan class=\"hljs-string\"\u003Er&quot;c CPU time +: ([.0-9]+)&quot;\u003C\u002Fspan\u003E).expect(\u003Cspan class=\"hljs-string\"\u003E&quot;wrong regex&quot;\u003C\u002Fspan\u003E);\n    \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E buf = \u003Cspan class=\"hljs-built_in\"\u003EString\u003C\u002Fspan\u003E::new();\n    \u003Cspan class=\"hljs-keyword\"\u003Ewhile\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003EOk\u003C\u002Fspan\u003E(k) = input.read_line(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E buf) {\n        \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E k == \u003Cspan class=\"hljs-number\"\u003E0\u003C\u002Fspan\u003E {\n            \u003Cspan class=\"hljs-keyword\"\u003Ebreak\u003C\u002Fspan\u003E;\n        }\n        \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(c) = re.captures(&amp;buf) {\n            \u003Cspan class=\"hljs-keyword\"\u003Eif\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003EOk\u003C\u002Fspan\u003E(v) = c[\u003Cspan class=\"hljs-number\"\u003E1\u003C\u002Fspan\u003E].parse::&lt;\u003Cspan class=\"hljs-built_in\"\u003Ef64\u003C\u002Fspan\u003E&gt;() {\n                \u003Cspan class=\"hljs-keyword\"\u003Ereturn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-literal\"\u003ESome\u003C\u002Fspan\u003E(v)\n            }\n        }\n        buf.clear();\n    }\n    \u003Cspan class=\"hljs-literal\"\u003ENone\u003C\u002Fspan\u003E\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2019"},base:{writable:true,enumerable:true,value:"2019-03-04-benchmarking-glucose.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2019-03-04-benchmarking-glucose.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});