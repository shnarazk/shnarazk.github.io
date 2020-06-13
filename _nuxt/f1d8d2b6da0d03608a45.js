(window.webpackJsonp=window.webpackJsonp||[]).push([[81],{553:function(t){t.exports=JSON.parse('{"title":"Clap-3.0.0-beta.1","subtitle":"from StructOpt","date":"2020-06-13T00:00:00.000Z","tags":["Rust"],"bodyContent":"[Clap](https://crates.io/crates/clap)-3.0だと[StructOpt](https://crates.io/crates/structopt)が要らなくなるのでclap-3.0.0-beta.1をちょっと試してみた。\\n\\n### 1. PathBufの取扱いの違い\\n\\nStructOptでは問題なくオプションになる以下のフィールドは、\\n\\n```rust\\n   #[structopt(long = \\"result\\", default_value = \\"\\", parse(from_os_str))]\\n   pub result: PathBuf,\\n```\\n\\nClapでは引数が指定されてないエラーを起こしてしまう。\\ndefault_valueを空以外にすれば直るのだが、それは困る、Optionでくるむことにした：\\n\\n```rust\\n    #[clap(long = \\"result\\")]\\n    pub result: Option<PathBuf>,\\n```\\n\\nこれで解決するのだが、なんかスマートではない。\\n\\n### 2. StructOpt::from_iterがない\\n\\nこれはClap::prase_fromに置き換えることが必要（そもそも、これを内部で呼び出しているだけ）。\\nもう一つ書き替えがあったのでまとめると、以下の通り。\\n\\n- `StructOpt::from_args` -> `Clap::parse`\\n- `StructOpt::from_iter` -> `Clap::parse_from`\\n\\n\\n## 依存関係\\n\\nclapがstructoptを取り込んだようなものなので、基本は変化がないはず。\\nしかし、開発時期の違いだろうか、依存クレートにバージョンの違いが見られる。\\nまたclapのメジャーバージョンアップということでcurses的なものに変化があった（共通部は省略）：\\n\\n```plain: structopt\\n$ cargo tree \\nsplr v0.4.2-dev.1\\n└── structopt v0.3.14\\n    ├── clap v2.33.1\\n    │   ├── ansi_term v0.11.0\\n    │   └── strsim v0.8.0\\n    └── structopt-derive v0.4.7\\n        └── proc-macro-error v1.0.2\\n            └── proc-macro-error-attr v1.0.2\\n```\\n\\n```plain: clap-3.0.0\\n$ cargo tree \\nsplr v0.4.2-dev.0\\n└── clap v3.0.0-beta.1\\n    ├── clap_derive v3.0.0-beta.1\\n    │   └── proc-macro-error v0.4.12\\n    │       └── proc-macro-error-attr v0.4.12\\n    ├── indexmap v1.4.0\\n    │   [build-dependencies]\\n    │   └── autocfg v1.0.0\\n    ├── os_str_bytes v2.3.1\\n    ├── strsim v0.10.0\\n    └── termcolor v1.1.0\\n```\\n\\nでコンパイルしてみるとclapを使った方が（strip後のサイズで）70KBほど大きくなってしまう。\\nうーん、それはどうなのか。。。\\n\\nコンパイル時間や実行時間に関しては見ていない。多分大きな差はないだろう。","bodyHtml":"<p><a href=\\"https://crates.io/crates/clap\\">Clap</a>-3.0だと<a href=\\"https://crates.io/crates/structopt\\">StructOpt</a>が要らなくなるのでclap-3.0.0-beta.1をちょっと試してみた。</p>\\n<h3>1. PathBufの取扱いの違い</h3>\\n<p>StructOptでは問題なくオプションになる以下のフィールドは、</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-meta\\">#[structopt(long = <span class=\\"hljs-meta-string\\">\\"result\\"</span>, default_value = <span class=\\"hljs-meta-string\\">\\"\\"</span>, parse(from_os_str))]</span>\\n   <span class=\\"hljs-keyword\\">pub</span> result: PathBuf,</code></pre><p>Clapでは引数が指定されてないエラーを起こしてしまう。\\ndefault_valueを空以外にすれば直るのだが、それは困る、Optionでくるむことにした：</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-meta\\">#[clap(long = <span class=\\"hljs-meta-string\\">\\"result\\"</span>)]</span>\\n    <span class=\\"hljs-keyword\\">pub</span> result: <span class=\\"hljs-built_in\\">Option</span>&lt;PathBuf&gt;,</code></pre><p>これで解決するのだが、なんかスマートではない。</p>\\n<h3>2. StructOpt::from_iterがない</h3>\\n<p>これはClap::prase_fromに置き換えることが必要（そもそも、これを内部で呼び出しているだけ）。\\nもう一つ書き替えがあったのでまとめると、以下の通り。</p>\\n<ul>\\n<li><code>StructOpt::from_args</code> -&gt; <code>Clap::parse</code></li>\\n<li><code>StructOpt::from_iter</code> -&gt; <code>Clap::parse_from</code></li>\\n</ul>\\n<h2>依存関係</h2>\\n<p>clapがstructoptを取り込んだようなものなので、基本は変化がないはず。\\nしかし、開発時期の違いだろうか、依存クレートにバージョンの違いが見られる。\\nまたclapのメジャーバージョンアップということでcurses的なものに変化があった（共通部は省略）：</p>\\n<pre><code class=\\"hljs\\">$ cargo tree \\nsplr v0.4.2-dev.1\\n└── structopt v0.3.14\\n    ├── clap v2.33.1\\n    │   ├── ansi_term v0.11.0\\n    │   └── strsim v0.8.0\\n    └── structopt-derive v0.4.7\\n        └── proc-macro-error v1.0.2\\n            └── proc-macro-error-attr v1.0.2</code></pre><pre><code class=\\"hljs\\">$ cargo tree \\nsplr v0.4.2-dev.0\\n└── clap v3.0.0-beta.1\\n    ├── clap_derive v3.0.0-beta.1\\n    │   └── proc-macro-error v0.4.12\\n    │       └── proc-macro-error-attr v0.4.12\\n    ├── indexmap v1.4.0\\n    │   [build-dependencies]\\n    │   └── autocfg v1.0.0\\n    ├── os_str_bytes v2.3.1\\n    ├── strsim v0.10.0\\n    └── termcolor v1.1.0</code></pre><p>でコンパイルしてみるとclapを使った方が（strip後のサイズで）70KBほど大きくなってしまう。\\nうーん、それはどうなのか。。。</p>\\n<p>コンパイル時間や実行時間に関しては見ていない。多分大きな差はないだろう。</p>\\n","dir":"article/.json/2020","base":"2020-06-13-clap3.json","ext":".json","sourceBase":"2020-06-13-clap3.md","sourceExt":".md"}')}}]);