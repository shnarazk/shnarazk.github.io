__NUXT_JSONP__("/2019/2019-02-27-memo-on-nix", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Memo on Nixpkgs",subtitle:"nixで最強パッケージ管理",date:"2019-02-27T00:00:00.000Z",tags:["nixos"],bodyContent:"## Location of my configuration file\n\nis **~\u002F.config\u002Fnixpkgs\u002Fconfig.nix**.\n\n- https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F\n\n\n## Overriding nix package\n\n- 'error: attribute `override' missing'\n\nProbably you're trying to override a non-existing package.\n\nFor example, the following emits the error because `emacs26` doesn't exist.\n\n```\n# ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix\n{ pkgs }:\n{\n    allowBroken = true;\n    allowUnfree = true;\n\n    packageOverrides = pkgs : rec {\n   \temacs26 = pkgs.stdenv.lib.overrideDerivation pkgs.emacs26 (oldAttrs : {\n\t    name = \"emacs-26.1.92\";\n\t    version = \"26.1.92\";\n\t    src = pkgs.fetchurl {\n\t        url = \"https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz\";\n\t\t    sha256 = \"0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41\";\n\t\t};\n\t});\n  };\n}\n```\n\nBy changing the package name to `emacs`, it works.\n\n- https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F4017\n\n### UPDATE\n\n`overrideDerivation` is almost depricated. Here's a better version:\n\n```\nself: super:\n{\n    emacs26 = super.emacs26.overrideAttrs (attrs: rec {\n        name = \"emacs-26.1.92\";\n        version = \"26.1.92\";\n        src = super.fetchurl {\n            url = \"https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz\";\n            sha256 = \"0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41\";\n        };\n        patches = [];\n    });\n}\n```\n\n### nixファイルの構造\n\nnixファイルはnix式を定義するもの。\n\n- nix-buildはderivationを生成する式を要求する。そしてその環境のシェルを走らせる。?\n- config.nixやオーバレイはnixpkgsを更新する関数を定義するもの。?\n\n- https:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-nix-syntax-summary\n- https:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-configuration-syntax\n\n### そもそもの関数の構文\n\n- `:`が引数と本体のセパレータ。\n\n```nix\nx : x + 1\n```\n\n- 集合を引数に取り、その中の特定要素を参照するならば、セレクタを並べた（カンマ区切り）集合が引数に位置する。\n\n```nix\n{ x, y }: x + y\n```\n\nこれは一見、2引数関数のように見えるがコロンの位置からもそうではない。\n\nということで、例えばlet構文（式）なしで集合型の返値が計算できるなら\n\n```nix\n{ config, pkgs }:\n{\n\t属性の定義式;\n}\n```\n\nとなるし、let構文を使いたいなら以下のようになる。\n\n```nix\n{ config, pkgs }:\nlet\n  x = { ... };\n  y = { ... };\n  ...\nin\n  x\n```\n\nなお、2引数関数はoverlayで用いられている。\n\n```nix\nself: super:\n...\n```\n\n- nix-buildに与えるべきnixファイル(shell.nixという名前がconvention?)はこんな感じ:\n\n```nix\nwith import \u003Cnixgkgs\u003E {};   # この;は文を区切るものではなく、withは次の行まで続いている\n  ...  # derivationを返すこと\n```\n\nA derivationを返すwith構文が一つあるだけ。with構文については後述。\n\n- nix-shellに与えるべきnixファイル（default.nixがデフォールト）はこんな感じ:\n\n```nix\nwith import \u003Cnixgkgs\u003E {};\n{ ... } # 集合を返す\n```\n\npkgsを更新している？\n\n### モジュールとwith構文\n\nということで多くのファイルは以下の構造で単一の関数が定義されているだけ。\n\n```nix\n{ 依存するモジュール（カンマ区切り） }:\n返値\n```\n\nオーバレイも ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix もこんな感じ。\n\n```nix\n{ pkgs }:\n{\n\t...\n}\n```\n\nここで`with import \u003Cnixpkgs\u003E`を先頭に置いても問題ないはず。\n試してみたところ、下のどちらの書き方でも正しく評価できる。\n\n```nix\nwith import \u003Cinxpkgs\u003E; self: super:\n  ...\n```\n\n\n```nix\nwith import \u003Cinxpkgs\u003E {}; self: super:\n  ...\n```\n\nそれどころか以下でも問題ない。\n\n```nix\nwith import \u003Cinxpkgs\u003E {} {}; self: super:\n  ...\n```\n\n何故ならば、`import \u003Cnixpkgs\u003E`は`関数：集合 -\u003E 集合`。\nなので`(import \u003Cinxpkgs\u003E) {}`は関数適用。もちろんその返値は集合を受け付ける関数。なので`{}`を受け付\nける。\nそして評価が終わった`import \u003Cinxpkgs\u003E {} {}`までを環境として、セミコロン以下の本体を評価するのがwith\n構文（式）。\n\n- https:\u002F\u002Fnixos.org\u002Fnixos\u002Fnix-pills\u002Ffunctions-and-imports.html#idm140737316371552\n\nS式で表せばこういうこと。\n\n```nix\n(with (((import \u003Cinxpkgs\u003E) {}) {}) (self: super: ...))\n```\n\nうーん、ヘンタイ。",bodyHtml:"\u003Ch2\u003ELocation of my configuration file\u003C\u002Fh2\u003E\n\u003Cp\u003Eis \u003Cstrong\u003E~\u002F.config\u002Fnixpkgs\u002Fconfig.nix\u003C\u002Fstrong\u003E.\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch2\u003EOverriding nix package\u003C\u002Fh2\u003E\n\u003Cul\u003E\n\u003Cli\u003E'error: attribute `override' missing'\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003EProbably you're trying to override a non-existing package.\u003C\u002Fp\u003E\n\u003Cp\u003EFor example, the following emits the error because \u003Ccode\u003Eemacs26\u003C\u002Fcode\u003E doesn't exist.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E# ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix\n{ pkgs }:\n{\n    allowBroken = true;\n    allowUnfree = true;\n\n    packageOverrides = pkgs : rec {\n   \temacs26 = pkgs.stdenv.lib.overrideDerivation pkgs.emacs26 (oldAttrs : {\n\t    name = &quot;emacs-26.1.92&quot;;\n\t    version = &quot;26.1.92&quot;;\n\t    src = pkgs.fetchurl {\n\t        url = &quot;https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz&quot;;\n\t\t    sha256 = &quot;0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41&quot;;\n\t\t};\n\t});\n  };\n}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003EBy changing the package name to \u003Ccode\u003Eemacs\u003C\u002Fcode\u003E, it works.\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F4017\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch3\u003EUPDATE\u003C\u002Fh3\u003E\n\u003Cp\u003E\u003Ccode\u003EoverrideDerivation\u003C\u002Fcode\u003E is almost depricated. Here's a better version:\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eself: super:\n{\n    emacs26 = super.emacs26.overrideAttrs (attrs: rec {\n        name = &quot;emacs-26.1.92&quot;;\n        version = &quot;26.1.92&quot;;\n        src = super.fetchurl {\n            url = &quot;https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz&quot;;\n            sha256 = &quot;0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41&quot;;\n        };\n        patches = [];\n    });\n}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Ch3\u003Enixファイルの構造\u003C\u002Fh3\u003E\n\u003Cp\u003Enixファイルはnix式を定義するもの。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E\n\u003Cp\u003Enix-buildはderivationを生成する式を要求する。そしてその環境のシェルを走らせる。?\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Econfig.nixやオーバレイはnixpkgsを更新する関数を定義するもの。?\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Ehttps:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-nix-syntax-summary\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Ehttps:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-configuration-syntax\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch3\u003Eそもそもの関数の構文\u003C\u002Fh3\u003E\n\u003Cul\u003E\n\u003Cli\u003E\u003Ccode\u003E:\u003C\u002Fcode\u003Eが引数と本体のセパレータ。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003Ex : x + 1\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cul\u003E\n\u003Cli\u003E集合を引数に取り、その中の特定要素を参照するならば、セレクタを並べた（カンマ区切り）集合が引数に位置する。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ x, y }: x + y\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれは一見、2引数関数のように見えるがコロンの位置からもそうではない。\u003C\u002Fp\u003E\n\u003Cp\u003Eということで、例えばlet構文（式）なしで集合型の返値が計算できるなら\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ config, pkgs }:\n{\n\t属性の定義式;\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eとなるし、let構文を使いたいなら以下のようになる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ config, pkgs }:\n\u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E\n  \u003Cspan class=\"hljs-attr\"\u003Ex\u003C\u002Fspan\u003E = { ... };\n  \u003Cspan class=\"hljs-attr\"\u003Ey\u003C\u002Fspan\u003E = { ... };\n  ...\n\u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E\n  x\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eなお、2引数関数はoverlayで用いられている。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003Eself: super:\n...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cul\u003E\n\u003Cli\u003Enix-buildに与えるべきnixファイル(shell.nixという名前がconvention?)はこんな感じ:\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;nixgkgs&gt; {};   \u003Cspan class=\"hljs-comment\"\u003E# この;は文を区切るものではなく、withは次の行まで続いている\u003C\u002Fspan\u003E\n  ...  \u003Cspan class=\"hljs-comment\"\u003E# derivationを返すこと\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003EA derivationを返すwith構文が一つあるだけ。with構文については後述。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Enix-shellに与えるべきnixファイル（default.nixがデフォールト）はこんな感じ:\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;nixgkgs&gt; {};\n{ ... } \u003Cspan class=\"hljs-comment\"\u003E# 集合を返す\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Epkgsを更新している？\u003C\u002Fp\u003E\n\u003Ch3\u003Eモジュールとwith構文\u003C\u002Fh3\u003E\n\u003Cp\u003Eということで多くのファイルは以下の構造で単一の関数が定義されているだけ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ 依存するモジュール（カンマ区切り） }:\n返値\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eオーバレイも ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix もこんな感じ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ pkgs }:\n{\n\t...\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eここで\u003Ccode\u003Ewith import &lt;nixpkgs&gt;\u003C\u002Fcode\u003Eを先頭に置いても問題ないはず。\n試してみたところ、下のどちらの書き方でも正しく評価できる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt;; self: super:\n  ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt; {}; self: super:\n  ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eそれどころか以下でも問題ない。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt; {} {}; self: super:\n  ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003E何故ならば、\u003Ccode\u003Eimport &lt;nixpkgs&gt;\u003C\u002Fcode\u003Eは\u003Ccode\u003E関数：集合 -&gt; 集合\u003C\u002Fcode\u003E。\nなので\u003Ccode\u003E(import &lt;inxpkgs&gt;) {}\u003C\u002Fcode\u003Eは関数適用。もちろんその返値は集合を受け付ける関数。なので\u003Ccode\u003E{}\u003C\u002Fcode\u003Eを受け付\nける。\nそして評価が終わった\u003Ccode\u003Eimport &lt;inxpkgs&gt; {} {}\u003C\u002Fcode\u003Eまでを環境として、セミコロン以下の本体を評価するのがwith\n構文（式）。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fnixos.org\u002Fnixos\u002Fnix-pills\u002Ffunctions-and-imports.html#idm140737316371552\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003ES式で表せばこういうこと。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E(\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E (((\u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt;) {}) {}) (self: super: ...))\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eうーん、ヘンタイ。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2019",base:"2019-02-27-memo-on-nix.json",ext:".json",sourceBase:"2019-02-27-memo-on-nix.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Memo on Nixpkgs"},subtitle:{writable:true,enumerable:true,value:"nixで最強パッケージ管理"},date:{writable:true,enumerable:true,value:"2019-02-27T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["nixos"]},bodyContent:{writable:true,enumerable:true,value:"## Location of my configuration file\n\nis **~\u002F.config\u002Fnixpkgs\u002Fconfig.nix**.\n\n- https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F\n\n\n## Overriding nix package\n\n- 'error: attribute `override' missing'\n\nProbably you're trying to override a non-existing package.\n\nFor example, the following emits the error because `emacs26` doesn't exist.\n\n```\n# ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix\n{ pkgs }:\n{\n    allowBroken = true;\n    allowUnfree = true;\n\n    packageOverrides = pkgs : rec {\n   \temacs26 = pkgs.stdenv.lib.overrideDerivation pkgs.emacs26 (oldAttrs : {\n\t    name = \"emacs-26.1.92\";\n\t    version = \"26.1.92\";\n\t    src = pkgs.fetchurl {\n\t        url = \"https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz\";\n\t\t    sha256 = \"0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41\";\n\t\t};\n\t});\n  };\n}\n```\n\nBy changing the package name to `emacs`, it works.\n\n- https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F4017\n\n### UPDATE\n\n`overrideDerivation` is almost depricated. Here's a better version:\n\n```\nself: super:\n{\n    emacs26 = super.emacs26.overrideAttrs (attrs: rec {\n        name = \"emacs-26.1.92\";\n        version = \"26.1.92\";\n        src = super.fetchurl {\n            url = \"https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz\";\n            sha256 = \"0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41\";\n        };\n        patches = [];\n    });\n}\n```\n\n### nixファイルの構造\n\nnixファイルはnix式を定義するもの。\n\n- nix-buildはderivationを生成する式を要求する。そしてその環境のシェルを走らせる。?\n- config.nixやオーバレイはnixpkgsを更新する関数を定義するもの。?\n\n- https:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-nix-syntax-summary\n- https:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-configuration-syntax\n\n### そもそもの関数の構文\n\n- `:`が引数と本体のセパレータ。\n\n```nix\nx : x + 1\n```\n\n- 集合を引数に取り、その中の特定要素を参照するならば、セレクタを並べた（カンマ区切り）集合が引数に位置する。\n\n```nix\n{ x, y }: x + y\n```\n\nこれは一見、2引数関数のように見えるがコロンの位置からもそうではない。\n\nということで、例えばlet構文（式）なしで集合型の返値が計算できるなら\n\n```nix\n{ config, pkgs }:\n{\n\t属性の定義式;\n}\n```\n\nとなるし、let構文を使いたいなら以下のようになる。\n\n```nix\n{ config, pkgs }:\nlet\n  x = { ... };\n  y = { ... };\n  ...\nin\n  x\n```\n\nなお、2引数関数はoverlayで用いられている。\n\n```nix\nself: super:\n...\n```\n\n- nix-buildに与えるべきnixファイル(shell.nixという名前がconvention?)はこんな感じ:\n\n```nix\nwith import \u003Cnixgkgs\u003E {};   # この;は文を区切るものではなく、withは次の行まで続いている\n  ...  # derivationを返すこと\n```\n\nA derivationを返すwith構文が一つあるだけ。with構文については後述。\n\n- nix-shellに与えるべきnixファイル（default.nixがデフォールト）はこんな感じ:\n\n```nix\nwith import \u003Cnixgkgs\u003E {};\n{ ... } # 集合を返す\n```\n\npkgsを更新している？\n\n### モジュールとwith構文\n\nということで多くのファイルは以下の構造で単一の関数が定義されているだけ。\n\n```nix\n{ 依存するモジュール（カンマ区切り） }:\n返値\n```\n\nオーバレイも ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix もこんな感じ。\n\n```nix\n{ pkgs }:\n{\n\t...\n}\n```\n\nここで`with import \u003Cnixpkgs\u003E`を先頭に置いても問題ないはず。\n試してみたところ、下のどちらの書き方でも正しく評価できる。\n\n```nix\nwith import \u003Cinxpkgs\u003E; self: super:\n  ...\n```\n\n\n```nix\nwith import \u003Cinxpkgs\u003E {}; self: super:\n  ...\n```\n\nそれどころか以下でも問題ない。\n\n```nix\nwith import \u003Cinxpkgs\u003E {} {}; self: super:\n  ...\n```\n\n何故ならば、`import \u003Cnixpkgs\u003E`は`関数：集合 -\u003E 集合`。\nなので`(import \u003Cinxpkgs\u003E) {}`は関数適用。もちろんその返値は集合を受け付ける関数。なので`{}`を受け付\nける。\nそして評価が終わった`import \u003Cinxpkgs\u003E {} {}`までを環境として、セミコロン以下の本体を評価するのがwith\n構文（式）。\n\n- https:\u002F\u002Fnixos.org\u002Fnixos\u002Fnix-pills\u002Ffunctions-and-imports.html#idm140737316371552\n\nS式で表せばこういうこと。\n\n```nix\n(with (((import \u003Cinxpkgs\u003E) {}) {}) (self: super: ...))\n```\n\nうーん、ヘンタイ。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Ch2\u003ELocation of my configuration file\u003C\u002Fh2\u003E\n\u003Cp\u003Eis \u003Cstrong\u003E~\u002F.config\u002Fnixpkgs\u002Fconfig.nix\u003C\u002Fstrong\u003E.\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFAQ#How_can_I_manage_software_with_nix-env_like_with_configuration.nix.3F\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch2\u003EOverriding nix package\u003C\u002Fh2\u003E\n\u003Cul\u003E\n\u003Cli\u003E'error: attribute `override' missing'\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003EProbably you're trying to override a non-existing package.\u003C\u002Fp\u003E\n\u003Cp\u003EFor example, the following emits the error because \u003Ccode\u003Eemacs26\u003C\u002Fcode\u003E doesn't exist.\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E# ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix\n{ pkgs }:\n{\n    allowBroken = true;\n    allowUnfree = true;\n\n    packageOverrides = pkgs : rec {\n   \temacs26 = pkgs.stdenv.lib.overrideDerivation pkgs.emacs26 (oldAttrs : {\n\t    name = &quot;emacs-26.1.92&quot;;\n\t    version = &quot;26.1.92&quot;;\n\t    src = pkgs.fetchurl {\n\t        url = &quot;https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz&quot;;\n\t\t    sha256 = &quot;0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41&quot;;\n\t\t};\n\t});\n  };\n}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003EBy changing the package name to \u003Ccode\u003Eemacs\u003C\u002Fcode\u003E, it works.\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F4017\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch3\u003EUPDATE\u003C\u002Fh3\u003E\n\u003Cp\u003E\u003Ccode\u003EoverrideDerivation\u003C\u002Fcode\u003E is almost depricated. Here's a better version:\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eself: super:\n{\n    emacs26 = super.emacs26.overrideAttrs (attrs: rec {\n        name = &quot;emacs-26.1.92&quot;;\n        version = &quot;26.1.92&quot;;\n        src = super.fetchurl {\n            url = &quot;https:\u002F\u002Falpha.gnu.org\u002Fgnu\u002Femacs\u002Fpretest\u002Femacs-26.1.92.tar.xz&quot;;\n            sha256 = &quot;0aa1dfa39b020feb49b82a388863c8a4b2ee0f1dfc04528f49759dbba4f28d41&quot;;\n        };\n        patches = [];\n    });\n}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Ch3\u003Enixファイルの構造\u003C\u002Fh3\u003E\n\u003Cp\u003Enixファイルはnix式を定義するもの。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E\n\u003Cp\u003Enix-buildはderivationを生成する式を要求する。そしてその環境のシェルを走らせる。?\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Econfig.nixやオーバレイはnixpkgsを更新する関数を定義するもの。?\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Ehttps:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-nix-syntax-summary\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003Cli\u003E\n\u003Cp\u003Ehttps:\u002F\u002Fnixos.org\u002Fnixos\u002Fmanual\u002Findex.html#sec-configuration-syntax\u003C\u002Fp\u003E\n\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Ch3\u003Eそもそもの関数の構文\u003C\u002Fh3\u003E\n\u003Cul\u003E\n\u003Cli\u003E\u003Ccode\u003E:\u003C\u002Fcode\u003Eが引数と本体のセパレータ。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003Ex : x + 1\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cul\u003E\n\u003Cli\u003E集合を引数に取り、その中の特定要素を参照するならば、セレクタを並べた（カンマ区切り）集合が引数に位置する。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ x, y }: x + y\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれは一見、2引数関数のように見えるがコロンの位置からもそうではない。\u003C\u002Fp\u003E\n\u003Cp\u003Eということで、例えばlet構文（式）なしで集合型の返値が計算できるなら\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ config, pkgs }:\n{\n\t属性の定義式;\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eとなるし、let構文を使いたいなら以下のようになる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ config, pkgs }:\n\u003Cspan class=\"hljs-keyword\"\u003Elet\u003C\u002Fspan\u003E\n  \u003Cspan class=\"hljs-attr\"\u003Ex\u003C\u002Fspan\u003E = { ... };\n  \u003Cspan class=\"hljs-attr\"\u003Ey\u003C\u002Fspan\u003E = { ... };\n  ...\n\u003Cspan class=\"hljs-keyword\"\u003Ein\u003C\u002Fspan\u003E\n  x\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eなお、2引数関数はoverlayで用いられている。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003Eself: super:\n...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cul\u003E\n\u003Cli\u003Enix-buildに与えるべきnixファイル(shell.nixという名前がconvention?)はこんな感じ:\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;nixgkgs&gt; {};   \u003Cspan class=\"hljs-comment\"\u003E# この;は文を区切るものではなく、withは次の行まで続いている\u003C\u002Fspan\u003E\n  ...  \u003Cspan class=\"hljs-comment\"\u003E# derivationを返すこと\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003EA derivationを返すwith構文が一つあるだけ。with構文については後述。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Enix-shellに与えるべきnixファイル（default.nixがデフォールト）はこんな感じ:\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;nixgkgs&gt; {};\n{ ... } \u003Cspan class=\"hljs-comment\"\u003E# 集合を返す\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Epkgsを更新している？\u003C\u002Fp\u003E\n\u003Ch3\u003Eモジュールとwith構文\u003C\u002Fh3\u003E\n\u003Cp\u003Eということで多くのファイルは以下の構造で単一の関数が定義されているだけ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ 依存するモジュール（カンマ区切り） }:\n返値\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eオーバレイも ~\u002F.config\u002Fnixpkgs\u002Fconfig.nix もこんな感じ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{ pkgs }:\n{\n\t...\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eここで\u003Ccode\u003Ewith import &lt;nixpkgs&gt;\u003C\u002Fcode\u003Eを先頭に置いても問題ないはず。\n試してみたところ、下のどちらの書き方でも正しく評価できる。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt;; self: super:\n  ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt; {}; self: super:\n  ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eそれどころか以下でも問題ない。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt; {} {}; self: super:\n  ...\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003E何故ならば、\u003Ccode\u003Eimport &lt;nixpkgs&gt;\u003C\u002Fcode\u003Eは\u003Ccode\u003E関数：集合 -&gt; 集合\u003C\u002Fcode\u003E。\nなので\u003Ccode\u003E(import &lt;inxpkgs&gt;) {}\u003C\u002Fcode\u003Eは関数適用。もちろんその返値は集合を受け付ける関数。なので\u003Ccode\u003E{}\u003C\u002Fcode\u003Eを受け付\nける。\nそして評価が終わった\u003Ccode\u003Eimport &lt;inxpkgs&gt; {} {}\u003C\u002Fcode\u003Eまでを環境として、セミコロン以下の本体を評価するのがwith\n構文（式）。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fnixos.org\u002Fnixos\u002Fnix-pills\u002Ffunctions-and-imports.html#idm140737316371552\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003ES式で表せばこういうこと。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E(\u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E (((\u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E &lt;inxpkgs&gt;) {}) {}) (self: super: ...))\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eうーん、ヘンタイ。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2019"},base:{writable:true,enumerable:true,value:"2019-02-27-memo-on-nix.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2019-02-27-memo-on-nix.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});