(window.webpackJsonp=window.webpackJsonp||[]).push([[95],{572:function(n){n.exports=JSON.parse('{"title":"RustのClone on Writeについて","subtitle":"std::borrow::cow","date":"2020-08-15T00:00:00.000Z","tags":["Rust"],"banner":"/img/2020/08-15/banner.jpg","bodyContent":"自転車本では紹介されてないけれど、Rustならでは必要とされる面白い型、Copy on Writeではなくて、Clone on Writeを意味する[`std::borrow::Cow`](https://doc.rust-lang.org/std/borrow/enum.Cow.html) の紹介です。\\n\\n## 前提知識：`str` と `String`の違い\\n\\n* `str` -- （固定長の）UTF-8文字のスライス\\n* `&str` -- UTF-8文字のスライスへのポインタ\\n* `String` -- ヒープ上に置かれた、追加を含めた変更ができる文字列\\n\\n\\n## 前提知識：文字列定数とその参照\\n\\n#### ローカル変数\\n\\nまず、以下のように関数内のローカルデータとして確保された文字列定数を参照する変数の型を確認しておきます。\\n\\n```rust\\n/// コンパイルできる\\nfn f() {\\n  let s = \\"a fixed string\\";\\n  ...\\n```\\n\\nこれは `&str` です。\\n\\n```rust\\n/// コンパイルできる\\nfn f() {\\n  let s: &str = \\"a fixed string\\";\\n  ...\\n```\\n\\n* `\\"a fixed string\\"`はローカルなデータなので（Boxも使ってないし）ヒープに置く必要はありません。\\n* 変数`s`はその確保された領域を指すように型付けられます。\\n* `str`は通常Rustのプログラムには出てきません。\\n\\nちなみに`s`がグローバル変数`S`になるとどうなるでしょう。\\n\\n```rust\\n/// 設計中\\nconst S: ??? = \\"a fixed string\\";\\n```\\n\\nグローバル変数も他の言語同様にヒープではなくOSで言うところのデータ領域に置かれるのでやはり`str`であり、\\nその領域を指すので変数`S` は`&str`型になります。\\n\\n```rust\\n/// コンパイルできる\\nconst S: &str = \\"a fixed string\\";\\n```\\n\\n## 前提知識：`str`と`String`間の変換\\n\\n### `&str`から`String`へ\\n\\n`&str`型の変数があればその指している対象から`to_string`メソッドを使ってStringを作ることができます。\\n\\n```rust\\n/// コンパイルできる\\nfn f() {\\n  let s: &str = \\"A fixed string\\" \\n  let t = s.to_string();     // ヒープ操作を必要とする\\n  ...\\n```\\n\\nこの時`t`の実体はヒープ上に置かれたfat pointerです。固定長なのでメモリを大きく消費するわけではありませんが、実体へのポインタを含む構造体をヒープ上に構成する必要があります。\\n\\n### `String`から`&str`へ\\n\\n逆の操作は`as_str()`です。この操作は`String`を構成するfat pointerを流用すればいいので極めて軽量です。\\nこれは`&srt`から`String`への変換が`to_*`系なのに対し、`String`から`&str`への変換が`as_*`系の[命名](https://rust-lang.github.io/api-guidelines/naming.html#ad-hoc-conversions-follow-as_-to_-into_-conventions-c-conv)になっていることからもわかります。\\n\\n```rust\\n/// コンパイルできる\\nfn f() {\\n  let s: String = \\"A fixed string\\".to_string();\\n  let t: &str = s.as_str();    // 軽量な操作\\n  ...\\n```\\n\\nここまでが前提知識でした。\\n\\n# 問題となるシナリオ: `&str` と `String` の混在\\n\\nさて、以下のような構造体`S`に対してその文字列表現を返す`rep()`メソッドを定義するとします。\\n\\n```rust\\nstruct S {\\n  index: usize,\\n  vec: Vec<usize>,\\n}\\n```\\n\\nただし、\\n\\n* その構造体が持っているフィールド`index`が0の時は固定のメッセージを返す。\\n* そうでなければ内部データの値がわかる文字列にしたい。\\n\\nとします。\\n\\n```rust\\n/// 設計中\\nimpl S {\\n  fn rep(&self) -> ??? {\\n     if self.index == 0 {\\n         ...\\n     } else {\\n         ...\\n     }\\n  }\\n}\\n```\\n\\n### Case 1: index == 0 のオブジェクトの場合\\n\\nこの場合、`rep()`内部で固定のメッセージを保持するローカル変数`mes`の値をそのまま返すことにします。\\n`mes`の型は `&str` であることから`rep()`の返値型も`&str`になります。\\n\\n```rust\\n/// コンパイルできるはず\\nimpl S {\\n  fn rep(&self) -> &str {\\n     if self.index == 0 {\\n         let mes: &str = \\"null object\\";\\n         mes\\n     } else {\\n         ...\\n     }\\n  }\\n}\\n```\\n\\n### Case 2: それ以外\\n\\nフィールド`vec`の値を埋め込んだ文字列を作るため`format!`を使うことにしました。\\n\\n`format!`の返す型は`String`なので`rep()`の返値型も`String`になります。\\n```rust\\n/// コンパイルできない\\nimpl S {\\n  fn rep(&self) -> String {\\n\\n\\n         ...\\n     } else {\\n         format!(\\"S{{{:?}}}\\", self.vec)\\n     }\\n  }\\n}\\n```\\n\\nここで型が一致しない問題に直面します。\\n\\n### 案1: `&str`への統一\\n\\n既に見たようにどちらの方向にも変換できるのでまず`&str`へ統一することを考えてみます。\\n\\n```rust\\n  fn rep(&self) -> &str {\\n     if self.index == 0 {\\n         let mes: &str = \\"null object\\";\\n         mes\\n     } else {\\n         format!(\\"S{{{:?}}}\\", self.vec).as_str()\\n     }\\n  }\\n}\\n```\\n\\nこれはライフタイム制約を満足しないエラーになります。\\n\\n```text\\nerror[E0515]: cannot return value referencing temporary value\\n   |\\n   |          format!(\\"S{{{:?}}}\\", self.vec).as_str()                                                        \\n   |          ------------------------------^^^^^^^^^\\n   |          |\\n   |          returns a value referencing data owned by the current function\\n   |          temporary value created here\\n```\\n\\n以下のようにローカル変数`res`にバインドしても、\\n\\n```rust\\n  fn rep(&self) -> &str {\\n     if self.index == 0 {\\n         let mes: &str = \\"null object\\";\\n         mes\\n     } else {\\n         let res = format!(\\"S{{{:?}}}\\", self.vec);\\n         res.as_str()\\n     }\\n  }\\n}\\n```\\n\\nライフタイムが短すぎることには変わりはないので、エラーになります（`res`はヒープに置かれても所有者である`rep`からexitする時点で回収されてしまう）\\n\\n```text\\nerror[E0515]: cannot return value referencing local variable `res`\\n   |\\n   |          res.as_str()                                                        \\n   |          ---^^^^^^^^^\\n   |          |\\n   |          returns a value referencing data owned by the current function\\n   |          `res` is borrowed here\\n```\\n\\nなので、`format!`で作った`String`実体を呼び出し側に渡さないといけません。\\n\\n### 案2: `String`への統一\\n\\nということで`&str`型の`mes`を返しているパスの型を変えることにします。関数の返値型を変えてコンパイルすると以下のようなエラーメッセージが表示されます。\\n\\n```text\\nerror[E0308]: mismatched types\\n  --\x3e src/main.rs:13:10\\n   |\\n   |   fn rep(&self) -> String {                                                                               \\n   |                    ------ expected `std::string::String` because of return type\\n...\\n   |          mes                                                                                           \\n   |          ^^^^\\n   |          |\\n   |          expected struct `std::string::String`, found `&str`\\n   |          help: try using a conversion method: `mes.to_string()`\\n\\n```\\n\\nヘルプに従って修正すれば問題はなくなります。\\n\\n```rust\\n  /// コンパイルできる\\n  fn rep(&self) -> String {\\n     if self.index == 0 {\\n         let mes: &str = \\"null object\\";\\n         mes.to_string()\\n     } else {\\n         let res = format!(\\"S{{{:?}}}\\", self.vec);\\n         res.as_str()\\n     }\\n  }\\n}\\n```\\n\\nしかしこれは、必要とは思われないヒープでのオブジェクト生成をしているため、時間的にも空間的にも（できれば避けたい）コストをかけてしまっています。ゼロコストアブストラクションをうたうRustのプログラムとしては是非とも避けたいところです。\\n\\n### 案3: 型の包含\\n\\nこの問題を解決するには「借用」と「実体」のどちらも返せるような`enum`を用意するという手が使えます。\\n\\n* 借用でいいならなら借用を包む\\n* 実体が必要なら、実体を包む\\n\\n```rust\\n/// 設計中（ライフタイム指定がまだついていない）\\nenum WrapStr {\\n  from_str(&str),\\n  from_format(String),\\n}\\n\\nimpl S {\\n  fn rep(&self) -> WrapStr {\\n     if self.index == 0 {\\n         let mes: &str = \\"null object\\";\\n         WrapStr::from_str(mes)\\n     } else {\\n         WraStr::from_format(format!(\\"S{{{:?}}}\\", self.vec))\\n     }\\n  }\\n}\\n```\\n\\nこうすれば型の問題は解決するし、見かけ上構造体で包むコストは（おそらく）コンパイラの最適化中に何もしないコードに変換されることが期待できます。ということで`WrapStr`を追加定義すれば問題解決します。ポインタを含むのでライフタイム制約が必要かな。。。\\n\\n# Cow\\n\\nしかし自分で定義するよりも、このような状況のための型がすでに標準ライブラリに用意されているのでそれを使いましょう。\\nそれがClone on Write, `Cow`型です。これは以下のように定義されています。\\nhttps://doc.rust-lang.org/std/borrow/enum.Cow.html\\n\\n```rust\\n/// https://doc.rust-lang.org/std/borrow/enum.Cow.html\\npub enum Cow<\'a, B> \\nwhere\\n    B: \'a + ToOwned + ?Sized, \\n {\\n    Borrowed(&\'a B),\\n    Owned(<B as ToOwned>::Owned),\\n}\\n```\\n\\n`ToOwned`は借用したデータから、所有権を持つ実体を構成することができるというトレイトです。\\n文字列関連では以下のようになっています。\\nhttps://doc.rust-lang.org/std/borrow/trait.ToOwned.html\\n\\n```\\n/// https://doc.rust-lang.org/std/borrow/trait.ToOwned.html\\nimpl ToOwned for str\\n  type Owned = String\\n  \\n  /// Examples\\n  let s: &str = \\"a\\";\\n  let ss: String = s.to_owned();\\n```\\n\\nつまり`str`から`String`が作れると。これを見ながら`Cow`の定義の`B`を`str`に変換してやると以下のようになります。\\n\\n```\\npub enum Cow<\'a, str> \\nwhere\\n    str: \'a + ToOwned + ?Sized,  // 条件OK\\n {\\n    Borrowed(&\'a str),\\n    Owned(String),\\n}\\n```\\n\\nということで、借用(`&str`)は`Cow::Borrowed`で実体(`String`)は`Cow::Owned`で包んでやればいいことがわかりました。\\n\\n最終的なプログラムはこうなります。\\n\\n```rust\\nuse std::borrow::Cow;\\n\\nimpl S {\\n  /// コンパイルできる\\n  fn rep(&self) -> Cow<\'_, str> {\\n    if self.index == 0 {\\n      Cow::Borrowed(\\"Null S\\")                  // 場所は確保済み => 借用したい\\n    } else {\\n      Cow::Owned(format!(\\"S[{:?}]\\", self.vec)) // 借用ではダメ =>実体を渡したい\\n    }\\n  }\\n}\\n```\\n\\n使う側では一回derefしてやれば借用であったか実体であったかを気にする必要はありません。\\n\\n```rust\\n   println!(\\"{}\\", *s.rep());\\n```\\n\\nちなみにderefしたものが何型になっているかというと、\\n\\n```rust\\n  // コンパイルできる\\n  let temp: &str = &*s.rep();\\n```\\n\\nだそうです。文字列のスライスみたいですね。\\n\\n\\n### コストについて\\n\\nderefのコストは以下に引用したようにポインタ辿りだけなので、「軽量」と言ってしまっていいでしょう。\\n\\nhttps://doc.rust-lang.org/src/alloc/borrow.rs.html#320\\n```\\n/// https://doc.rust-lang.org/src/alloc/borrow.rs.html#320\\n#[stable(feature = \\"rust1\\", since = \\"1.0.0\\")]\\nimpl<B: ?Sized + ToOwned> Deref for Cow<\'_, B> {\\n    type Target = B;\\n\\n    fn deref(&self) -> &B {\\n        match *self {\\n            Borrowed(borrowed) => borrowed,\\n            Owned(ref owned) => owned.borrow(),\\n        }\\n    }\\n}\\n```\\n\\nhttps://doc.rust-lang.org/src/core/borrow.rs.html#212\\n```rust\\n/// https://doc.rust-lang.org/src/core/borrow.rs.html#212\\n#[stable(feature = \\"rust1\\", since = \\"1.0.0\\")]\\nimpl<T: ?Sized> Borrow<T> for T {\\n    fn borrow(&self) -> &T {\\n        self\\n    }\\n}\\n```\\n\\nhttps://doc.rust-lang.org/src/core/borrow.rs.html#226\\n```rust\\n/// https://doc.rust-lang.org/src/core/borrow.rs.html#226\\n#[stable(feature = \\"rust1\\", since = \\"1.0.0\\")]\\nimpl<T: ?Sized> Borrow<T> for &T {\\n    fn borrow(&self) -> &T {\\n        &**self\\n    }\\n}\\n```","bodyHtml":"<p>自転車本では紹介されてないけれど、Rustならでは必要とされる面白い型、Copy on Writeではなくて、Clone on Writeを意味する<a href=\\"https://doc.rust-lang.org/std/borrow/enum.Cow.html\\"><code>std::borrow::Cow</code></a> の紹介です。</p>\\n<h2>前提知識：<code>str</code> と <code>String</code>の違い</h2>\\n<ul>\\n<li><code>str</code> -- （固定長の）UTF-8文字のスライス</li>\\n<li><code>&amp;str</code> -- UTF-8文字のスライスへのポインタ</li>\\n<li><code>String</code> -- ヒープ上に置かれた、追加を含めた変更ができる文字列</li>\\n</ul>\\n<h2>前提知識：文字列定数とその参照</h2>\\n<h4>ローカル変数</h4>\\n<p>まず、以下のように関数内のローカルデータとして確保された文字列定数を参照する変数の型を確認しておきます。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできる</span>\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">f</span></span>() {\\n  <span class=\\"hljs-keyword\\">let</span> s = <span class=\\"hljs-string\\">\\"a fixed string\\"</span>;\\n  ...</code></pre><p>これは <code>&amp;str</code> です。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできる</span>\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">f</span></span>() {\\n  <span class=\\"hljs-keyword\\">let</span> s: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"a fixed string\\"</span>;\\n  ...</code></pre><ul>\\n<li><code>&quot;a fixed string&quot;</code>はローカルなデータなので（Boxも使ってないし）ヒープに置く必要はありません。</li>\\n<li>変数<code>s</code>はその確保された領域を指すように型付けられます。</li>\\n<li><code>str</code>は通常Rustのプログラムには出てきません。</li>\\n</ul>\\n<p>ちなみに<code>s</code>がグローバル変数<code>S</code>になるとどうなるでしょう。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// 設計中</span>\\n<span class=\\"hljs-keyword\\">const</span> S: ??? = <span class=\\"hljs-string\\">\\"a fixed string\\"</span>;</code></pre><p>グローバル変数も他の言語同様にヒープではなくOSで言うところのデータ領域に置かれるのでやはり<code>str</code>であり、\\nその領域を指すので変数<code>S</code> は<code>&amp;str</code>型になります。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできる</span>\\n<span class=\\"hljs-keyword\\">const</span> S: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"a fixed string\\"</span>;</code></pre><h2>前提知識：<code>str</code>と<code>String</code>間の変換</h2>\\n<h3><code>&amp;str</code>から<code>String</code>へ</h3>\\n<p><code>&amp;str</code>型の変数があればその指している対象から<code>to_string</code>メソッドを使ってStringを作ることができます。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできる</span>\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">f</span></span>() {\\n  <span class=\\"hljs-keyword\\">let</span> s: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"A fixed string\\"</span> \\n  <span class=\\"hljs-keyword\\">let</span> t = s.to_string();     <span class=\\"hljs-comment\\">// ヒープ操作を必要とする</span>\\n  ...</code></pre><p>この時<code>t</code>の実体はヒープ上に置かれたfat pointerです。固定長なのでメモリを大きく消費するわけではありませんが、実体へのポインタを含む構造体をヒープ上に構成する必要があります。</p>\\n<h3><code>String</code>から<code>&amp;str</code>へ</h3>\\n<p>逆の操作は<code>as_str()</code>です。この操作は<code>String</code>を構成するfat pointerを流用すればいいので極めて軽量です。\\nこれは<code>&amp;srt</code>から<code>String</code>への変換が<code>to_*</code>系なのに対し、<code>String</code>から<code>&amp;str</code>への変換が<code>as_*</code>系の<a href=\\"https://rust-lang.github.io/api-guidelines/naming.html#ad-hoc-conversions-follow-as_-to_-into_-conventions-c-conv\\">命名</a>になっていることからもわかります。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできる</span>\\n<span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">f</span></span>() {\\n  <span class=\\"hljs-keyword\\">let</span> s: <span class=\\"hljs-built_in\\">String</span> = <span class=\\"hljs-string\\">\\"A fixed string\\"</span>.to_string();\\n  <span class=\\"hljs-keyword\\">let</span> t: &amp;<span class=\\"hljs-built_in\\">str</span> = s.as_str();    <span class=\\"hljs-comment\\">// 軽量な操作</span>\\n  ...</code></pre><p>ここまでが前提知識でした。</p>\\n<h1>問題となるシナリオ: <code>&amp;str</code> と <code>String</code> の混在</h1>\\n<p>さて、以下のような構造体<code>S</code>に対してその文字列表現を返す<code>rep()</code>メソッドを定義するとします。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">struct</span> <span class=\\"hljs-title\\">S</span></span> {\\n  index: <span class=\\"hljs-built_in\\">usize</span>,\\n  vec: <span class=\\"hljs-built_in\\">Vec</span>&lt;<span class=\\"hljs-built_in\\">usize</span>&gt;,\\n}</code></pre><p>ただし、</p>\\n<ul>\\n<li>その構造体が持っているフィールド<code>index</code>が0の時は固定のメッセージを返す。</li>\\n<li>そうでなければ内部データの値がわかる文字列にしたい。</li>\\n</ul>\\n<p>とします。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// 設計中</span>\\n<span class=\\"hljs-keyword\\">impl</span> S {\\n  <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; ??? {\\n     <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">self</span>.index == <span class=\\"hljs-number\\">0</span> {\\n         ...\\n     } <span class=\\"hljs-keyword\\">else</span> {\\n         ...\\n     }\\n  }\\n}</code></pre><h3>Case 1: index == 0 のオブジェクトの場合</h3>\\n<p>この場合、<code>rep()</code>内部で固定のメッセージを保持するローカル変数<code>mes</code>の値をそのまま返すことにします。\\n<code>mes</code>の型は <code>&amp;str</code> であることから<code>rep()</code>の返値型も<code>&amp;str</code>になります。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできるはず</span>\\n<span class=\\"hljs-keyword\\">impl</span> S {\\n  <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; &amp;<span class=\\"hljs-built_in\\">str</span> {\\n     <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">self</span>.index == <span class=\\"hljs-number\\">0</span> {\\n         <span class=\\"hljs-keyword\\">let</span> mes: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"null object\\"</span>;\\n         mes\\n     } <span class=\\"hljs-keyword\\">else</span> {\\n         ...\\n     }\\n  }\\n}</code></pre><h3>Case 2: それ以外</h3>\\n<p>フィールド<code>vec</code>の値を埋め込んだ文字列を作るため<code>format!</code>を使うことにしました。</p>\\n<p><code>format!</code>の返す型は<code>String</code>なので<code>rep()</code>の返値型も<code>String</code>になります。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできない</span>\\n<span class=\\"hljs-keyword\\">impl</span> S {\\n  <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; <span class=\\"hljs-built_in\\">String</span> {\\n\\n\\n         ...\\n     } <span class=\\"hljs-keyword\\">else</span> {\\n         <span class=\\"hljs-built_in\\">format!</span>(<span class=\\"hljs-string\\">\\"S{{{:?}}}\\"</span>, <span class=\\"hljs-keyword\\">self</span>.vec)\\n     }\\n  }\\n}</code></pre><p>ここで型が一致しない問題に直面します。</p>\\n<h3>案1: <code>&amp;str</code>への統一</h3>\\n<p>既に見たようにどちらの方向にも変換できるのでまず<code>&amp;str</code>へ統一することを考えてみます。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; &amp;<span class=\\"hljs-built_in\\">str</span> {\\n     <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">self</span>.index == <span class=\\"hljs-number\\">0</span> {\\n         <span class=\\"hljs-keyword\\">let</span> mes: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"null object\\"</span>;\\n         mes\\n     } <span class=\\"hljs-keyword\\">else</span> {\\n         <span class=\\"hljs-built_in\\">format!</span>(<span class=\\"hljs-string\\">\\"S{{{:?}}}\\"</span>, <span class=\\"hljs-keyword\\">self</span>.vec).as_str()\\n     }\\n  }\\n}</code></pre><p>これはライフタイム制約を満足しないエラーになります。</p>\\n<pre><code class=\\"hljs\\">error[E0515]: cannot return value referencing temporary value\\n   |\\n   |          format!(\\"S{{{:?}}}\\", self.vec).as_str()                                                        \\n   |          ------------------------------^^^^^^^^^\\n   |          |\\n   |          returns a value referencing data owned by the current function\\n   |          temporary value created here</code></pre><p>以下のようにローカル変数<code>res</code>にバインドしても、</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; &amp;<span class=\\"hljs-built_in\\">str</span> {\\n     <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">self</span>.index == <span class=\\"hljs-number\\">0</span> {\\n         <span class=\\"hljs-keyword\\">let</span> mes: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"null object\\"</span>;\\n         mes\\n     } <span class=\\"hljs-keyword\\">else</span> {\\n         <span class=\\"hljs-keyword\\">let</span> res = <span class=\\"hljs-built_in\\">format!</span>(<span class=\\"hljs-string\\">\\"S{{{:?}}}\\"</span>, <span class=\\"hljs-keyword\\">self</span>.vec);\\n         res.as_str()\\n     }\\n  }\\n}</code></pre><p>ライフタイムが短すぎることには変わりはないので、エラーになります（<code>res</code>はヒープに置かれても所有者である<code>rep</code>からexitする時点で回収されてしまう）</p>\\n<pre><code class=\\"hljs\\">error[E0515]: cannot return value referencing local variable `res`\\n   |\\n   |          res.as_str()                                                        \\n   |          ---^^^^^^^^^\\n   |          |\\n   |          returns a value referencing data owned by the current function\\n   |          `res` is borrowed here</code></pre><p>なので、<code>format!</code>で作った<code>String</code>実体を呼び出し側に渡さないといけません。</p>\\n<h3>案2: <code>String</code>への統一</h3>\\n<p>ということで<code>&amp;str</code>型の<code>mes</code>を返しているパスの型を変えることにします。関数の返値型を変えてコンパイルすると以下のようなエラーメッセージが表示されます。</p>\\n<pre><code class=\\"hljs\\">error[E0308]: mismatched types\\n  --&gt; src/main.rs:13:10\\n   |\\n   |   fn rep(&amp;self) -&gt; String {                                                                               \\n   |                    ------ expected `std::string::String` because of return type\\n...\\n   |          mes                                                                                           \\n   |          ^^^^\\n   |          |\\n   |          expected struct `std::string::String`, found `&amp;str`\\n   |          help: try using a conversion method: `mes.to_string()`</code></pre><p>ヘルプに従って修正すれば問題はなくなります。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// コンパイルできる</span>\\n  <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; <span class=\\"hljs-built_in\\">String</span> {\\n     <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">self</span>.index == <span class=\\"hljs-number\\">0</span> {\\n         <span class=\\"hljs-keyword\\">let</span> mes: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"null object\\"</span>;\\n         mes.to_string()\\n     } <span class=\\"hljs-keyword\\">else</span> {\\n         <span class=\\"hljs-keyword\\">let</span> res = <span class=\\"hljs-built_in\\">format!</span>(<span class=\\"hljs-string\\">\\"S{{{:?}}}\\"</span>, <span class=\\"hljs-keyword\\">self</span>.vec);\\n         res.as_str()\\n     }\\n  }\\n}</code></pre><p>しかしこれは、必要とは思われないヒープでのオブジェクト生成をしているため、時間的にも空間的にも（できれば避けたい）コストをかけてしまっています。ゼロコストアブストラクションをうたうRustのプログラムとしては是非とも避けたいところです。</p>\\n<h3>案3: 型の包含</h3>\\n<p>この問題を解決するには「借用」と「実体」のどちらも返せるような<code>enum</code>を用意するという手が使えます。</p>\\n<ul>\\n<li>借用でいいならなら借用を包む</li>\\n<li>実体が必要なら、実体を包む</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// 設計中（ライフタイム指定がまだついていない）</span>\\n<span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">enum</span> <span class=\\"hljs-title\\">WrapStr</span></span> {\\n  from_str(&amp;<span class=\\"hljs-built_in\\">str</span>),\\n  from_format(<span class=\\"hljs-built_in\\">String</span>),\\n}\\n\\n<span class=\\"hljs-keyword\\">impl</span> S {\\n  <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; WrapStr {\\n     <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">self</span>.index == <span class=\\"hljs-number\\">0</span> {\\n         <span class=\\"hljs-keyword\\">let</span> mes: &amp;<span class=\\"hljs-built_in\\">str</span> = <span class=\\"hljs-string\\">\\"null object\\"</span>;\\n         WrapStr::from_str(mes)\\n     } <span class=\\"hljs-keyword\\">else</span> {\\n         WraStr::from_format(<span class=\\"hljs-built_in\\">format!</span>(<span class=\\"hljs-string\\">\\"S{{{:?}}}\\"</span>, <span class=\\"hljs-keyword\\">self</span>.vec))\\n     }\\n  }\\n}</code></pre><p>こうすれば型の問題は解決するし、見かけ上構造体で包むコストは（おそらく）コンパイラの最適化中に何もしないコードに変換されることが期待できます。ということで<code>WrapStr</code>を追加定義すれば問題解決します。ポインタを含むのでライフタイム制約が必要かな。。。</p>\\n<h1>Cow</h1>\\n<p>しかし自分で定義するよりも、このような状況のための型がすでに標準ライブラリに用意されているのでそれを使いましょう。\\nそれがClone on Write, <code>Cow</code>型です。これは以下のように定義されています。\\nhttps://doc.rust-lang.org/std/borrow/enum.Cow.html</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// https://doc.rust-lang.org/std/borrow/enum.Cow.html</span>\\n<span class=\\"hljs-keyword\\">pub</span> <span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">enum</span> <span class=\\"hljs-title\\">Cow</span></span>&lt;<span class=\\"hljs-symbol\\">\'a</span>, B&gt; \\n<span class=\\"hljs-keyword\\">where</span>\\n    B: <span class=\\"hljs-symbol\\">\'a</span> + <span class=\\"hljs-built_in\\">ToOwned</span> + ?<span class=\\"hljs-built_in\\">Sized</span>, \\n {\\n    Borrowed(&amp;<span class=\\"hljs-symbol\\">\'a</span> B),\\n    Owned(&lt;B <span class=\\"hljs-keyword\\">as</span> <span class=\\"hljs-built_in\\">ToOwned</span>&gt;::Owned),\\n}</code></pre><p><code>ToOwned</code>は借用したデータから、所有権を持つ実体を構成することができるというトレイトです。\\n文字列関連では以下のようになっています。\\nhttps://doc.rust-lang.org/std/borrow/trait.ToOwned.html</p>\\n<pre><code>/// https://doc.rust-lang.org/std/borrow/trait.ToOwned.html\\nimpl ToOwned for str\\n  type Owned = String\\n  \\n  /// Examples\\n  let s: &amp;str = &quot;a&quot;;\\n  let ss: String = s.to_owned();\\n</code></pre>\\n<p>つまり<code>str</code>から<code>String</code>が作れると。これを見ながら<code>Cow</code>の定義の<code>B</code>を<code>str</code>に変換してやると以下のようになります。</p>\\n<pre><code>pub enum Cow&lt;\'a, str&gt; \\nwhere\\n    str: \'a + ToOwned + ?Sized,  // 条件OK\\n {\\n    Borrowed(&amp;\'a str),\\n    Owned(String),\\n}\\n</code></pre>\\n<p>ということで、借用(<code>&amp;str</code>)は<code>Cow::Borrowed</code>で実体(<code>String</code>)は<code>Cow::Owned</code>で包んでやればいいことがわかりました。</p>\\n<p>最終的なプログラムはこうなります。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">use</span> std::borrow::Cow;\\n\\n<span class=\\"hljs-keyword\\">impl</span> S {\\n  <span class=\\"hljs-comment\\">/// コンパイルできる</span>\\n  <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">rep</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; Cow&lt;<span class=\\"hljs-symbol\\">\'_</span>, <span class=\\"hljs-built_in\\">str</span>&gt; {\\n    <span class=\\"hljs-keyword\\">if</span> <span class=\\"hljs-keyword\\">self</span>.index == <span class=\\"hljs-number\\">0</span> {\\n      Cow::Borrowed(<span class=\\"hljs-string\\">\\"Null S\\"</span>)                  <span class=\\"hljs-comment\\">// 場所は確保済み =&gt; 借用したい</span>\\n    } <span class=\\"hljs-keyword\\">else</span> {\\n      Cow::Owned(<span class=\\"hljs-built_in\\">format!</span>(<span class=\\"hljs-string\\">\\"S[{:?}]\\"</span>, <span class=\\"hljs-keyword\\">self</span>.vec)) <span class=\\"hljs-comment\\">// 借用ではダメ =&gt;実体を渡したい</span>\\n    }\\n  }\\n}</code></pre><p>使う側では一回derefしてやれば借用であったか実体であったかを気にする必要はありません。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-built_in\\">println!</span>(<span class=\\"hljs-string\\">\\"{}\\"</span>, *s.rep());</code></pre><p>ちなみにderefしたものが何型になっているかというと、</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">// コンパイルできる</span>\\n  <span class=\\"hljs-keyword\\">let</span> temp: &amp;<span class=\\"hljs-built_in\\">str</span> = &amp;*s.rep();</code></pre><p>だそうです。文字列のスライスみたいですね。</p>\\n<h3>コストについて</h3>\\n<p>derefのコストは以下に引用したようにポインタ辿りだけなので、「軽量」と言ってしまっていいでしょう。</p>\\n<p>https://doc.rust-lang.org/src/alloc/borrow.rs.html#320</p>\\n<pre><code>/// https://doc.rust-lang.org/src/alloc/borrow.rs.html#320\\n#[stable(feature = &quot;rust1&quot;, since = &quot;1.0.0&quot;)]\\nimpl&lt;B: ?Sized + ToOwned&gt; Deref for Cow&lt;\'_, B&gt; {\\n    type Target = B;\\n\\n    fn deref(&amp;self) -&gt; &amp;B {\\n        match *self {\\n            Borrowed(borrowed) =&gt; borrowed,\\n            Owned(ref owned) =&gt; owned.borrow(),\\n        }\\n    }\\n}\\n</code></pre>\\n<p>https://doc.rust-lang.org/src/core/borrow.rs.html#212</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// https://doc.rust-lang.org/src/core/borrow.rs.html#212</span>\\n<span class=\\"hljs-meta\\">#[stable(feature = <span class=\\"hljs-meta-string\\">\\"rust1\\"</span>, since = <span class=\\"hljs-meta-string\\">\\"1.0.0\\"</span>)]</span>\\n<span class=\\"hljs-keyword\\">impl</span>&lt;T: ?<span class=\\"hljs-built_in\\">Sized</span>&gt; Borrow&lt;T&gt; <span class=\\"hljs-keyword\\">for</span> T {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">borrow</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; &amp;T {\\n        <span class=\\"hljs-keyword\\">self</span>\\n    }\\n}</code></pre><p>https://doc.rust-lang.org/src/core/borrow.rs.html#226</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">/// https://doc.rust-lang.org/src/core/borrow.rs.html#226</span>\\n<span class=\\"hljs-meta\\">#[stable(feature = <span class=\\"hljs-meta-string\\">\\"rust1\\"</span>, since = <span class=\\"hljs-meta-string\\">\\"1.0.0\\"</span>)]</span>\\n<span class=\\"hljs-keyword\\">impl</span>&lt;T: ?<span class=\\"hljs-built_in\\">Sized</span>&gt; Borrow&lt;T&gt; <span class=\\"hljs-keyword\\">for</span> &amp;T {\\n    <span class=\\"hljs-function\\"><span class=\\"hljs-keyword\\">fn</span> <span class=\\"hljs-title\\">borrow</span></span>(&amp;<span class=\\"hljs-keyword\\">self</span>) -&gt; &amp;T {\\n        &amp;**<span class=\\"hljs-keyword\\">self</span>\\n    }\\n}</code></pre>","dir":"article/.json/2020","base":"2020-08-15-Cow.json","ext":".json","sourceBase":"2020-08-15-Cow.md","sourceExt":".md"}')}}]);