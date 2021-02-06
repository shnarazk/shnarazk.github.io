__NUXT_JSONP__("/2019/2019-08-08-rust-lifetime", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"A trait definition with lifetimes",subtitle:"生存期間もややこしい",date:"2019-08-08T00:00:00.000Z",tags:["Rust"],bodyContent:"あるプログラムでアルゴリズムのバリエーションを併用するため、以下のトレイトが必要になったとしよう。\n\n```rust\npub trait RestartHeuristics {\n    type Item;\n    fn add(&mut self, item: Self::Item);\n    ...\n```\n\nここで、実装ごとにメソッド`add`に渡す引数を変えたいので、関連型`Item`を引数の型としてもたせた。\n例えば、以下のような実装を実現したい。\n\n- 単なる数値(`f64`)を受け取って計算する`add`\n- 何か構造体へのmut pointer(`&mut Var`)をもらってそれに対して変更を加えながら計算する`add`\n\nそれぞれ以下のような定義になった。\n\n```rust\nimpl RestartHeuristics for RestartByLBD {\n    type Item = usize;\n    fn add(&mut self, item: Self::Item) {...\n```\n\nそして問題となる二つ目の定義：\n\n```rust\nimpl RestartHeuristics for VarSet {\n    type Item = &mut Var;\n    fn add(&mut self, v: Self::Item) {...\n```\n\nこれで `r.add(4);` とか `r.add(&mut v);` とか自由に書けてスマート。\nつまり、意味もなく`r.add(&mut 4)`なんてことを強制されずに済んだ。\nところが、これはコンパイルエラーになる。\n\n```\nerror[E0106]: missing lifetime specifier\n   --\u003E src\u002Fvar.rs:114:17\n    |\n114 |     type Item = &mut Var;\n    |                 ^ help: consider using the named lifetime: `&'a`\n```\n\nポインタを渡しているので生存時間が必要らしい。\nうーむ、メソッド`add`の中ではCopy可能なフィールドを参照、変更するだけなので生存時間が問題になることはないと思うのだけど。。。\nともあれ、上記のヘルプに従ってこの引数に生存時間を追加した。\n\n\n```rust\nimpl RestartHeuristics for VarSet {\n    type Memory = Ema2;\n    type Item = &'a mut Var;\n    fn add(&mut self, v: Self::Item) {\n```\n\nすると以下のエラー。\n\n```\nerror[E0261]: use of undeclared lifetime name `'a`\n   --\u003E src\u002Fvar.rs:114:18\n    |\n114 |     type Item = &'a mut Var;\n    |                  ^^ undeclared lifetime\n```\n\nなので、生存期間`'a`を宣言できる唯一の場所`impl`に追加する（後述）。\n\n```\nimpl\u003C'a\u003E RestartHeuristics for VarSet {\n    type Memory = Ema2;\n    type Item = &'a mut Var;\n    fn add(&mut self, v: Self::Item) {\n```\n\nすると今度は以下のエラー。\n\n```\nerror[E0207]: the lifetime parameter `'a` is not constrained by the impl trait, self type, or predicates\n   --\u003E src\u002Fvar.rs:112:6\n    |\n112 | impl\u003C'a\u003E RestartHeuristics for VarSet {\n    |      ^^ unconstrained lifetime parameter\n```\n\n定義したものはトレイト（指示詞）かself型か述語(predicates)中で使え、だそうなので、\nトレイトに追加してみる。\n\n```rust\npub trait RestartHeuristics\u003C'a\u003E {\n    type Item;\n    fn add(&mut self, item: Self::Item);\n```\n\nここで、この生存期間パラメータの追加を各実装に反映させないと以下のエラーになる。\n\n```\nerror[E0726]: implicit elided lifetime not allowed here\n   --\u003E src\u002Frestart.rs:100:6\n    |\n100 | impl RestartHeuristics for RestartByLBD {\n    |      ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `\u003C'_\u003E`\n\nerror[E0726]: implicit elided lifetime not allowed here\n   --\u003E src\u002Fvar.rs:112:10\n    |\n112 | impl\u003C'a\u003E RestartHeuristics for VarSet {\n    |          ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `\u003C'_\u003E`\n```\n\n以下のように各実装に追加して、これで解決。\n\n- ポインタが出てくるのでトレイトには生存期間パラメータが必要\n- `usize`に対してはワイルドカードでOK\n- 構造体へのポインタに対しては、それをトレイトのパラメータに反映\n\n```rust\nimpl RestartHeuristics\u003C'_\u003E for RestartByLBD {\n    type Item = usize;\n    fn add(&mut self, item: Self::Item) {...\n```\t\n\t\n```rust\nimpl\u003C'a\u003E RestartHeuristics\u003C'a\u003E for VarSet {\n    type Item = &'a mut Var;\n    fn add(&mut self, item: Self::Item) {...\n```\n\nということで\n\nimplやtraitキーワードで導入した（型や生存期間）変数は、\n\n- トレイト名（指示詞）\n- Self -- `fn (&'a mut self,...)` ということか \n- 述語(predicates) -- whereの後の型（生存期間）制約\n\nで使わないといけない。\n\n*参考*\n\n- https:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F52318662\u002Fwhat-is-a-predicate-in-rust",bodyHtml:"\u003Cp\u003Eあるプログラムでアルゴリズムのバリエーションを併用するため、以下のトレイトが必要になったとしよう。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Epub\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etrait\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003ERestartHeuristics\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item);\n    ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eここで、実装ごとにメソッド\u003Ccode\u003Eadd\u003C\u002Fcode\u003Eに渡す引数を変えたいので、関連型\u003Ccode\u003EItem\u003C\u002Fcode\u003Eを引数の型としてもたせた。\n例えば、以下のような実装を実現したい。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E単なる数値(\u003Ccode\u003Ef64\u003C\u002Fcode\u003E)を受け取って計算する\u003Ccode\u003Eadd\u003C\u002Fcode\u003E\u003C\u002Fli\u003E\n\u003Cli\u003E何か構造体へのmut pointer(\u003Ccode\u003E&amp;mut Var\u003C\u002Fcode\u003E)をもらってそれに対して変更を加えながら計算する\u003Ccode\u003Eadd\u003C\u002Fcode\u003E\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eそれぞれ以下のような定義になった。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E RestartByLBD {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eそして問題となる二つ目の定義：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E VarSet {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = &amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E Var;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, v: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれで \u003Ccode\u003Er.add(4);\u003C\u002Fcode\u003E とか \u003Ccode\u003Er.add(&amp;mut v);\u003C\u002Fcode\u003E とか自由に書けてスマート。\nつまり、意味もなく\u003Ccode\u003Er.add(&amp;mut 4)\u003C\u002Fcode\u003Eなんてことを強制されずに済んだ。\nところが、これはコンパイルエラーになる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0106]: missing lifetime specifier\n   --&gt; src\u002Fvar.rs:114:17\n    |\n114 |     type Item = &amp;mut Var;\n    |                 ^ help: consider using the named lifetime: `&amp;'a`\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eポインタを渡しているので生存時間が必要らしい。\nうーむ、メソッド\u003Ccode\u003Eadd\u003C\u002Fcode\u003Eの中ではCopy可能なフィールドを参照、変更するだけなので生存時間が問題になることはないと思うのだけど。。。\nともあれ、上記のヘルプに従ってこの引数に生存時間を追加した。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E VarSet {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EMemory\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = Ema2;\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = &amp;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E Var;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, v: Self::Item) {\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eすると以下のエラー。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0261]: use of undeclared lifetime name `'a`\n   --&gt; src\u002Fvar.rs:114:18\n    |\n114 |     type Item = &amp;'a mut Var;\n    |                  ^^ undeclared lifetime\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eなので、生存期間\u003Ccode\u003E'a\u003C\u002Fcode\u003Eを宣言できる唯一の場所\u003Ccode\u003Eimpl\u003C\u002Fcode\u003Eに追加する（後述）。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eimpl&lt;'a&gt; RestartHeuristics for VarSet {\n    type Memory = Ema2;\n    type Item = &amp;'a mut Var;\n    fn add(&amp;mut self, v: Self::Item) {\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eすると今度は以下のエラー。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0207]: the lifetime parameter `'a` is not constrained by the impl trait, self type, or predicates\n   --&gt; src\u002Fvar.rs:112:6\n    |\n112 | impl&lt;'a&gt; RestartHeuristics for VarSet {\n    |      ^^ unconstrained lifetime parameter\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E定義したものはトレイト（指示詞）かself型か述語(predicates)中で使え、だそうなので、\nトレイトに追加してみる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Epub\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etrait\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003ERestartHeuristics\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E&gt; {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item);\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eここで、この生存期間パラメータの追加を各実装に反映させないと以下のエラーになる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0726]: implicit elided lifetime not allowed here\n   --&gt; src\u002Frestart.rs:100:6\n    |\n100 | impl RestartHeuristics for RestartByLBD {\n    |      ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `&lt;'_&gt;`\n\nerror[E0726]: implicit elided lifetime not allowed here\n   --&gt; src\u002Fvar.rs:112:10\n    |\n112 | impl&lt;'a&gt; RestartHeuristics for VarSet {\n    |          ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `&lt;'_&gt;`\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E以下のように各実装に追加して、これで解決。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Eポインタが出てくるのでトレイトには生存期間パラメータが必要\u003C\u002Fli\u003E\n\u003Cli\u003E\u003Ccode\u003Eusize\u003C\u002Fcode\u003Eに対してはワイルドカードでOK\u003C\u002Fli\u003E\n\u003Cli\u003E構造体へのポインタに対しては、それをトレイトのパラメータに反映\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;_\u003C\u002Fspan\u003E&gt; \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E RestartByLBD {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E&gt; RestartHeuristics&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E&gt; \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E VarSet {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = &amp;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E Var;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eということで\u003C\u002Fp\u003E\n\u003Cp\u003Eimplやtraitキーワードで導入した（型や生存期間）変数は、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Eトレイト名（指示詞）\u003C\u002Fli\u003E\n\u003Cli\u003ESelf -- \u003Ccode\u003Efn (&amp;'a mut self,...)\u003C\u002Fcode\u003E ということか\u003C\u002Fli\u003E\n\u003Cli\u003E述語(predicates) -- whereの後の型（生存期間）制約\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eで使わないといけない。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cem\u003E参考\u003C\u002Fem\u003E\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F52318662\u002Fwhat-is-a-predicate-in-rust\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n",dir:"article\u002F.json\u002F2019",base:"2019-08-08-rust-lifetime.json",ext:".json",sourceBase:"2019-08-08-rust-lifetime.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"A trait definition with lifetimes"},subtitle:{writable:true,enumerable:true,value:"生存期間もややこしい"},date:{writable:true,enumerable:true,value:"2019-08-08T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["Rust"]},bodyContent:{writable:true,enumerable:true,value:"あるプログラムでアルゴリズムのバリエーションを併用するため、以下のトレイトが必要になったとしよう。\n\n```rust\npub trait RestartHeuristics {\n    type Item;\n    fn add(&mut self, item: Self::Item);\n    ...\n```\n\nここで、実装ごとにメソッド`add`に渡す引数を変えたいので、関連型`Item`を引数の型としてもたせた。\n例えば、以下のような実装を実現したい。\n\n- 単なる数値(`f64`)を受け取って計算する`add`\n- 何か構造体へのmut pointer(`&mut Var`)をもらってそれに対して変更を加えながら計算する`add`\n\nそれぞれ以下のような定義になった。\n\n```rust\nimpl RestartHeuristics for RestartByLBD {\n    type Item = usize;\n    fn add(&mut self, item: Self::Item) {...\n```\n\nそして問題となる二つ目の定義：\n\n```rust\nimpl RestartHeuristics for VarSet {\n    type Item = &mut Var;\n    fn add(&mut self, v: Self::Item) {...\n```\n\nこれで `r.add(4);` とか `r.add(&mut v);` とか自由に書けてスマート。\nつまり、意味もなく`r.add(&mut 4)`なんてことを強制されずに済んだ。\nところが、これはコンパイルエラーになる。\n\n```\nerror[E0106]: missing lifetime specifier\n   --\u003E src\u002Fvar.rs:114:17\n    |\n114 |     type Item = &mut Var;\n    |                 ^ help: consider using the named lifetime: `&'a`\n```\n\nポインタを渡しているので生存時間が必要らしい。\nうーむ、メソッド`add`の中ではCopy可能なフィールドを参照、変更するだけなので生存時間が問題になることはないと思うのだけど。。。\nともあれ、上記のヘルプに従ってこの引数に生存時間を追加した。\n\n\n```rust\nimpl RestartHeuristics for VarSet {\n    type Memory = Ema2;\n    type Item = &'a mut Var;\n    fn add(&mut self, v: Self::Item) {\n```\n\nすると以下のエラー。\n\n```\nerror[E0261]: use of undeclared lifetime name `'a`\n   --\u003E src\u002Fvar.rs:114:18\n    |\n114 |     type Item = &'a mut Var;\n    |                  ^^ undeclared lifetime\n```\n\nなので、生存期間`'a`を宣言できる唯一の場所`impl`に追加する（後述）。\n\n```\nimpl\u003C'a\u003E RestartHeuristics for VarSet {\n    type Memory = Ema2;\n    type Item = &'a mut Var;\n    fn add(&mut self, v: Self::Item) {\n```\n\nすると今度は以下のエラー。\n\n```\nerror[E0207]: the lifetime parameter `'a` is not constrained by the impl trait, self type, or predicates\n   --\u003E src\u002Fvar.rs:112:6\n    |\n112 | impl\u003C'a\u003E RestartHeuristics for VarSet {\n    |      ^^ unconstrained lifetime parameter\n```\n\n定義したものはトレイト（指示詞）かself型か述語(predicates)中で使え、だそうなので、\nトレイトに追加してみる。\n\n```rust\npub trait RestartHeuristics\u003C'a\u003E {\n    type Item;\n    fn add(&mut self, item: Self::Item);\n```\n\nここで、この生存期間パラメータの追加を各実装に反映させないと以下のエラーになる。\n\n```\nerror[E0726]: implicit elided lifetime not allowed here\n   --\u003E src\u002Frestart.rs:100:6\n    |\n100 | impl RestartHeuristics for RestartByLBD {\n    |      ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `\u003C'_\u003E`\n\nerror[E0726]: implicit elided lifetime not allowed here\n   --\u003E src\u002Fvar.rs:112:10\n    |\n112 | impl\u003C'a\u003E RestartHeuristics for VarSet {\n    |          ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `\u003C'_\u003E`\n```\n\n以下のように各実装に追加して、これで解決。\n\n- ポインタが出てくるのでトレイトには生存期間パラメータが必要\n- `usize`に対してはワイルドカードでOK\n- 構造体へのポインタに対しては、それをトレイトのパラメータに反映\n\n```rust\nimpl RestartHeuristics\u003C'_\u003E for RestartByLBD {\n    type Item = usize;\n    fn add(&mut self, item: Self::Item) {...\n```\t\n\t\n```rust\nimpl\u003C'a\u003E RestartHeuristics\u003C'a\u003E for VarSet {\n    type Item = &'a mut Var;\n    fn add(&mut self, item: Self::Item) {...\n```\n\nということで\n\nimplやtraitキーワードで導入した（型や生存期間）変数は、\n\n- トレイト名（指示詞）\n- Self -- `fn (&'a mut self,...)` ということか \n- 述語(predicates) -- whereの後の型（生存期間）制約\n\nで使わないといけない。\n\n*参考*\n\n- https:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F52318662\u002Fwhat-is-a-predicate-in-rust"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003Eあるプログラムでアルゴリズムのバリエーションを併用するため、以下のトレイトが必要になったとしよう。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Epub\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etrait\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003ERestartHeuristics\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item);\n    ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eここで、実装ごとにメソッド\u003Ccode\u003Eadd\u003C\u002Fcode\u003Eに渡す引数を変えたいので、関連型\u003Ccode\u003EItem\u003C\u002Fcode\u003Eを引数の型としてもたせた。\n例えば、以下のような実装を実現したい。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E単なる数値(\u003Ccode\u003Ef64\u003C\u002Fcode\u003E)を受け取って計算する\u003Ccode\u003Eadd\u003C\u002Fcode\u003E\u003C\u002Fli\u003E\n\u003Cli\u003E何か構造体へのmut pointer(\u003Ccode\u003E&amp;mut Var\u003C\u002Fcode\u003E)をもらってそれに対して変更を加えながら計算する\u003Ccode\u003Eadd\u003C\u002Fcode\u003E\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eそれぞれ以下のような定義になった。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E RestartByLBD {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eそして問題となる二つ目の定義：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E VarSet {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = &amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E Var;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, v: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれで \u003Ccode\u003Er.add(4);\u003C\u002Fcode\u003E とか \u003Ccode\u003Er.add(&amp;mut v);\u003C\u002Fcode\u003E とか自由に書けてスマート。\nつまり、意味もなく\u003Ccode\u003Er.add(&amp;mut 4)\u003C\u002Fcode\u003Eなんてことを強制されずに済んだ。\nところが、これはコンパイルエラーになる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0106]: missing lifetime specifier\n   --&gt; src\u002Fvar.rs:114:17\n    |\n114 |     type Item = &amp;mut Var;\n    |                 ^ help: consider using the named lifetime: `&amp;'a`\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eポインタを渡しているので生存時間が必要らしい。\nうーむ、メソッド\u003Ccode\u003Eadd\u003C\u002Fcode\u003Eの中ではCopy可能なフィールドを参照、変更するだけなので生存時間が問題になることはないと思うのだけど。。。\nともあれ、上記のヘルプに従ってこの引数に生存時間を追加した。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E VarSet {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EMemory\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = Ema2;\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = &amp;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E Var;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, v: Self::Item) {\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eすると以下のエラー。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0261]: use of undeclared lifetime name `'a`\n   --&gt; src\u002Fvar.rs:114:18\n    |\n114 |     type Item = &amp;'a mut Var;\n    |                  ^^ undeclared lifetime\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eなので、生存期間\u003Ccode\u003E'a\u003C\u002Fcode\u003Eを宣言できる唯一の場所\u003Ccode\u003Eimpl\u003C\u002Fcode\u003Eに追加する（後述）。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eimpl&lt;'a&gt; RestartHeuristics for VarSet {\n    type Memory = Ema2;\n    type Item = &amp;'a mut Var;\n    fn add(&amp;mut self, v: Self::Item) {\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eすると今度は以下のエラー。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0207]: the lifetime parameter `'a` is not constrained by the impl trait, self type, or predicates\n   --&gt; src\u002Fvar.rs:112:6\n    |\n112 | impl&lt;'a&gt; RestartHeuristics for VarSet {\n    |      ^^ unconstrained lifetime parameter\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E定義したものはトレイト（指示詞）かself型か述語(predicates)中で使え、だそうなので、\nトレイトに追加してみる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Epub\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etrait\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003ERestartHeuristics\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E&gt; {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item);\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eここで、この生存期間パラメータの追加を各実装に反映させないと以下のエラーになる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eerror[E0726]: implicit elided lifetime not allowed here\n   --&gt; src\u002Frestart.rs:100:6\n    |\n100 | impl RestartHeuristics for RestartByLBD {\n    |      ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `&lt;'_&gt;`\n\nerror[E0726]: implicit elided lifetime not allowed here\n   --&gt; src\u002Fvar.rs:112:10\n    |\n112 | impl&lt;'a&gt; RestartHeuristics for VarSet {\n    |          ^^^^^^^^^^^^^^^^^- help: indicate the anonymous lifetime: `&lt;'_&gt;`\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E以下のように各実装に追加して、これで解決。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Eポインタが出てくるのでトレイトには生存期間パラメータが必要\u003C\u002Fli\u003E\n\u003Cli\u003E\u003Ccode\u003Eusize\u003C\u002Fcode\u003Eに対してはワイルドカードでOK\u003C\u002Fli\u003E\n\u003Cli\u003E構造体へのポインタに対しては、それをトレイトのパラメータに反映\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E RestartHeuristics&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;_\u003C\u002Fspan\u003E&gt; \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E RestartByLBD {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-built_in\"\u003Eusize\u003C\u002Fspan\u003E;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Eimpl\u003C\u002Fspan\u003E&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E&gt; RestartHeuristics&lt;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E&gt; \u003Cspan class=\"hljs-keyword\"\u003Efor\u003C\u002Fspan\u003E VarSet {\n    \u003Cspan class=\"hljs-class\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Etype\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003EItem\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E = &amp;\u003Cspan class=\"hljs-symbol\"\u003E&#x27;a\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E Var;\n    \u003Cspan class=\"hljs-function\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Efn\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-title\"\u003Eadd\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E(&amp;\u003Cspan class=\"hljs-keyword\"\u003Emut\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-keyword\"\u003Eself\u003C\u002Fspan\u003E, item: Self::Item) {...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eということで\u003C\u002Fp\u003E\n\u003Cp\u003Eimplやtraitキーワードで導入した（型や生存期間）変数は、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Eトレイト名（指示詞）\u003C\u002Fli\u003E\n\u003Cli\u003ESelf -- \u003Ccode\u003Efn (&amp;'a mut self,...)\u003C\u002Fcode\u003E ということか\u003C\u002Fli\u003E\n\u003Cli\u003E述語(predicates) -- whereの後の型（生存期間）制約\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eで使わないといけない。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cem\u003E参考\u003C\u002Fem\u003E\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fstackoverflow.com\u002Fquestions\u002F52318662\u002Fwhat-is-a-predicate-in-rust\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2019"},base:{writable:true,enumerable:true,value:"2019-08-08-rust-lifetime.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2019-08-08-rust-lifetime.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});