__NUXT_JSONP__("/2021/2021-03-14-nix-flakes", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Nix flakeの作り方",subtitle:"さあ来いnix-2.4",date:"2021-03-16T00:00:00.000Z",tags:["NixOS"],banner:"https:\u002F\u002Fimages.unsplash.com\u002Fphoto-1482597869166-609e91429f40?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2400",banner_caption:"https:\u002F\u002Funsplash.com\u002Fphotos\u002FU2L0qbBw9Jo",bodyContent:"2021-03-08にnixのベータ版？が三ヶ月ぶりに更新されて、ようやくnixを置き換えてもエラーなく使えるようになりました。\nなので早速Splrで使ってみたのでいくつかメモ。\n\n## restricted modeとは\n\n`nix-env -u`でエラーはなくなったものの、flake.nixを作ろうとすると相変わらずrestricted modeではxxxxにアクセスできないというようなエラーが出る。これは`--impure`フラグを渡してやるといい。`nix --help`によると、\n\n\u003E When the --expr option is given, all installables are interpreted as Nix expressions.\n\u003E You may need to specify --impure if the expression references impure inputs (such as \u003Cnixpkgs\u003E).\n\nということで、多分12月頃からこうすればよかったようだ。\n\n```shell\n$ nix flake init --impure\n$ nix build --impure\n```\n\n## flake.nixはどう書けばいいのか\n\n[Nix Wiki](https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFlakes)に出てくるのは以下の例\n\n```nix\n{\n  inputs = {\n    home-manager.url = \"github:nix-community\u002Fhome-manager\";\n  };\n}\n```\n\n```nix\n{\n  outputs = { self, nixpkgs }: {\n     # replace 'joes-desktop' with your hostname here.\n     nixosConfigurations.joes-desktop = nixpkgs.lib.nixosSystem {\n       system = \"x86_64-linux\";\n       modules = [ .\u002Fconfiguration.nix ];\n     };\n  };\n}\n```\n\nしかし、2020年5月の記事だけど[NIX FLAKES, PART 1: AN INTRODUCTION AND TUTORIAL](https:\u002F\u002Fwww.tweag.io\u002Fblog\u002F2020-05-25-flakes\u002F)の以下の例がまず足掛かり。\n\n```nix\n{\n  description = \"A flake for building Hello World\";\n  inputs.nixpkgs.url = github:NixOS\u002Fnixpkgs\u002Fnixos-20.03;\n  outputs = { self, nixpkgs }: {\n    defaultPackage.x86_64-linux =\n      # Notice the reference to nixpkgs here.\n      with import nixpkgs { system = \"x86_64-linux\"; };\n      stdenv.mkDerivation {\n        name = \"hello\";\n        src = self;\n        buildPhase = \"gcc -o hello .\u002Fhello.c\";\n        installPhase = \"mkdir -p $out\u002Fbin; install -t $out\u002Fbin hello\";\n      };\n  };\n}\n```\n\nこれを真似すればよさそうだが、この例ではsystemが `x86_64-linux` に限定されている。\nいや `darwin` メインだし将来的には `aarch65` も期待したいのでもっとスマートな方法はないかと探すと、\nNix Wikiで使われている[flake-utils](https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils)がよさそうである。このパッケージは\n\n```nix\neachDefaultSystem -\u003E (\u003Csystem\u003E -\u003E attrs)\n```\n\nを提供している。ええと、これは返値がないように見えるけどこういうこと：\n\n```haskell\neachDefaultSystem :: (\u003Csystem\u003E -\u003E attrs) -\u003E attrs\n```\n\nただし、使い方は微妙である。\nよくわからないまま使うと、例えば`defaultPackege.x86-64-darwin`がエクスポートされていないというエラーが出てしまった。\nでこれによく似た関数`eachSystem`の[サンプル](https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils#eachsystem---system---system---attrs)をよく見る：\n\n```nix\neachSystem allSystems (system: { hello = 42; })\n# =\u003E {\n   hello.aarch64-darwin = 42,\n   hello.aarch64-genode = 42,\n}\n```\n\n引数closureの中で`hello`を使うと最終的に`hello.${system}`にpopulateされるのだから、`defaultPackege.色々なシステム`をpopulateするにはclosureの中では`defaultPackage`にderivationを束縛すればいい。\nということで\n\n```nix\n{\n  inputs.flake-utils.url = \"github:numtide\u002Fflake-utils\";\n  outputs = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      defaultPackage =\n        with import nixpkgs { system = \"${system}\"; };\n        stdenv.mkDerivation {...};\n    });\n}\n```\n\nとするのが正解。\n[実際のコード](https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fblob\u002Ff34a664f0f031a9ffe0c4c63558f33ab6b90eec1\u002Fflake.nix)はこれ:\n\n```nix\n{\n  description = \"A modern SAT solver in Rust\";\n  inputs.flake-utils.url = \"github:numtide\u002Fflake-utils\";\n  outputs = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      defaultPackage =\n        with import nixpkgs { system = \"${system}\"; };\n        stdenv.mkDerivation {\n          name = \"splr\";\n          src = self;\n          buildInputs = [ cargo rustc ];\n          buildPhase = \"cargo build --release\";\n          installPhase = \"mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsplr target\u002Frelease\u002Fdmcr\";\n        }\n      ;\n    })\n  ;\n}\n```\n\nこれでgit cloneしてnix buildでインストールできるようになりました。\nうむ。簡単。\nオーバレイでnixパッケージ化するよりもお手軽なので、[SAT-bench](https:\u002F\u002Fgithub.com\u002Fshnarazk\u002FSAT-bench)も乗り換えるかも。\n\n初めてFlakesを知ってから半年というか約1年。\n長い道のりでした。\n\n### MacOSでRustのプログラムがコンパイルできない\n\n`framework Security`がないとか言われるなら、それはnixパッケージ化した時と同じような環境を作ってやらなければ。\nということでwebまわりの機能を使うSAT-benchの場合は以下の修正が必要だった。\n\n```\n1 file changed, 1 insertion(+), 1 deletion(-)\nflake.nix | 2 +-\n\nmodified   flake.nix\n@@ -8,7 +8,7 @@\n         stdenv.mkDerivation {\n           name = \"SAT-bench\";\n           src = self;\n-          buildInputs = [ cargo rustc ];\n+          buildInputs = rustc.buildInputs ++ [ cargo rustc libiconv openssl pkgconfig ];\n           buildPhase = \"cargo build --release\";\n           installPhase = \"mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsat-bench target\u002Frelease\u002Fbenchm\";\n         }\n```",bodyHtml:"\u003Cp\u003E2021-03-08にnixのベータ版？が三ヶ月ぶりに更新されて、ようやくnixを置き換えてもエラーなく使えるようになりました。\nなので早速Splrで使ってみたのでいくつかメモ。\u003C\u002Fp\u003E\n\u003Ch2\u003Erestricted modeとは\u003C\u002Fh2\u003E\n\u003Cp\u003E\u003Ccode\u003Enix-env -u\u003C\u002Fcode\u003Eでエラーはなくなったものの、flake.nixを作ろうとすると相変わらずrestricted modeではxxxxにアクセスできないというようなエラーが出る。これは\u003Ccode\u003E--impure\u003C\u002Fcode\u003Eフラグを渡してやるといい。\u003Ccode\u003Enix --help\u003C\u002Fcode\u003Eによると、\u003C\u002Fp\u003E\n\u003Cblockquote\u003E\n\u003Cp\u003EWhen the --expr option is given, all installables are interpreted as Nix expressions.\nYou may need to specify --impure if the expression references impure inputs (such as &lt;nixpkgs&gt;).\u003C\u002Fp\u003E\n\u003C\u002Fblockquote\u003E\n\u003Cp\u003Eということで、多分12月頃からこうすればよかったようだ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-meta\"\u003E$\u003C\u002Fspan\u003E\u003Cspan class=\"bash\"\u003E nix flake init --impure\u003C\u002Fspan\u003E\n\u003Cspan class=\"hljs-meta\"\u003E$\u003C\u002Fspan\u003E\u003Cspan class=\"bash\"\u003E nix build --impure\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Ch2\u003Eflake.nixはどう書けばいいのか\u003C\u002Fh2\u003E\n\u003Cp\u003E\u003Ca href=\"https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFlakes\"\u003ENix Wiki\u003C\u002Fa\u003Eに出てくるのは以下の例\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Einputs\u003C\u002Fspan\u003E = {\n    home-manager.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;github:nix-community\u002Fhome-manager&quot;\u003C\u002Fspan\u003E;\n  };\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs }: {\n     \u003Cspan class=\"hljs-comment\"\u003E# replace &#x27;joes-desktop&#x27; with your hostname here.\u003C\u002Fspan\u003E\n     nixosConfigurations.\u003Cspan class=\"hljs-attr\"\u003Ejoes-desktop\u003C\u002Fspan\u003E = nixpkgs.lib.nixosSystem {\n       \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;x86_64-linux&quot;\u003C\u002Fspan\u003E;\n       \u003Cspan class=\"hljs-attr\"\u003Emodules\u003C\u002Fspan\u003E = [ .\u002Fconfiguration.nix ];\n     };\n  };\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eしかし、2020年5月の記事だけど\u003Ca href=\"https:\u002F\u002Fwww.tweag.io\u002Fblog\u002F2020-05-25-flakes\u002F\"\u003ENIX FLAKES, PART 1: AN INTRODUCTION AND TUTORIAL\u003C\u002Fa\u003Eの以下の例がまず足掛かり。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Edescription\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;A flake for building Hello World&quot;\u003C\u002Fspan\u003E;\n  inputs.nixpkgs.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = github:NixOS\u002Fnixpkgs\u002Fnixos-\u003Cspan class=\"hljs-number\"\u003E20.03\u003C\u002Fspan\u003E;\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs }: {\n    defaultPackage.\u003Cspan class=\"hljs-attr\"\u003Ex86_64-linux\u003C\u002Fspan\u003E =\n      \u003Cspan class=\"hljs-comment\"\u003E# Notice the reference to nixpkgs here.\u003C\u002Fspan\u003E\n      \u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E nixpkgs { \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;x86_64-linux&quot;\u003C\u002Fspan\u003E; };\n      stdenv.mkDerivation {\n        \u003Cspan class=\"hljs-attr\"\u003Ename\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;hello&quot;\u003C\u002Fspan\u003E;\n        \u003Cspan class=\"hljs-attr\"\u003Esrc\u003C\u002Fspan\u003E = self;\n        \u003Cspan class=\"hljs-attr\"\u003EbuildPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;gcc -o hello .\u002Fhello.c&quot;\u003C\u002Fspan\u003E;\n        \u003Cspan class=\"hljs-attr\"\u003EinstallPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;mkdir -p $out\u002Fbin; install -t $out\u002Fbin hello&quot;\u003C\u002Fspan\u003E;\n      };\n  };\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれを真似すればよさそうだが、この例ではsystemが \u003Ccode\u003Ex86_64-linux\u003C\u002Fcode\u003E に限定されている。\nいや \u003Ccode\u003Edarwin\u003C\u002Fcode\u003E メインだし将来的には \u003Ccode\u003Eaarch65\u003C\u002Fcode\u003E も期待したいのでもっとスマートな方法はないかと探すと、\nNix Wikiで使われている\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils\"\u003Eflake-utils\u003C\u002Fa\u003Eがよさそうである。このパッケージは\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003EeachDefaultSystem -&gt; (&lt;system&gt; -&gt; attrs)\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eを提供している。ええと、これは返値がないように見えるけどこういうこと：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-title\"\u003EeachDefaultSystem\u003C\u002Fspan\u003E :: (&lt;system&gt; -&gt; attrs) -&gt; attrs\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eただし、使い方は微妙である。\nよくわからないまま使うと、例えば\u003Ccode\u003EdefaultPackege.x86-64-darwin\u003C\u002Fcode\u003Eがエクスポートされていないというエラーが出てしまった。\nでこれによく似た関数\u003Ccode\u003EeachSystem\u003C\u002Fcode\u003Eの\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils#eachsystem---system---system---attrs\"\u003Eサンプル\u003C\u002Fa\u003Eをよく見る：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003EeachSystem allSystems (system: { \u003Cspan class=\"hljs-attr\"\u003Ehello\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-number\"\u003E42\u003C\u002Fspan\u003E; })\n\u003Cspan class=\"hljs-comment\"\u003E# =&gt; {\u003C\u002Fspan\u003E\n   hello.\u003Cspan class=\"hljs-attr\"\u003Eaarch64-darwin\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-number\"\u003E42\u003C\u002Fspan\u003E,\n   hello.\u003Cspan class=\"hljs-attr\"\u003Eaarch64-genode\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-number\"\u003E42\u003C\u002Fspan\u003E,\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003E引数closureの中で\u003Ccode\u003Ehello\u003C\u002Fcode\u003Eを使うと最終的に\u003Ccode\u003Ehello.${system}\u003C\u002Fcode\u003Eにpopulateされるのだから、\u003Ccode\u003EdefaultPackege.色々なシステム\u003C\u002Fcode\u003Eをpopulateするにはclosureの中では\u003Ccode\u003EdefaultPackage\u003C\u002Fcode\u003Eにderivationを束縛すればいい。\nということで\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  inputs.flake-utils.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;github:numtide\u002Fflake-utils&quot;\u003C\u002Fspan\u003E;\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      \u003Cspan class=\"hljs-attr\"\u003EdefaultPackage\u003C\u002Fspan\u003E =\n        \u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E nixpkgs { \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;\u003Cspan class=\"hljs-subst\"\u003E${system}\u003C\u002Fspan\u003E&quot;\u003C\u002Fspan\u003E; };\n        stdenv.mkDerivation {...};\n    });\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eとするのが正解。\n\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fblob\u002Ff34a664f0f031a9ffe0c4c63558f33ab6b90eec1\u002Fflake.nix\"\u003E実際のコード\u003C\u002Fa\u003Eはこれ:\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Edescription\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;A modern SAT solver in Rust&quot;\u003C\u002Fspan\u003E;\n  inputs.flake-utils.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;github:numtide\u002Fflake-utils&quot;\u003C\u002Fspan\u003E;\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      \u003Cspan class=\"hljs-attr\"\u003EdefaultPackage\u003C\u002Fspan\u003E =\n        \u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E nixpkgs { \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;\u003Cspan class=\"hljs-subst\"\u003E${system}\u003C\u002Fspan\u003E&quot;\u003C\u002Fspan\u003E; };\n        stdenv.mkDerivation {\n          \u003Cspan class=\"hljs-attr\"\u003Ename\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;splr&quot;\u003C\u002Fspan\u003E;\n          \u003Cspan class=\"hljs-attr\"\u003Esrc\u003C\u002Fspan\u003E = self;\n          \u003Cspan class=\"hljs-attr\"\u003EbuildInputs\u003C\u002Fspan\u003E = [ cargo rustc ];\n          \u003Cspan class=\"hljs-attr\"\u003EbuildPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;cargo build --release&quot;\u003C\u002Fspan\u003E;\n          \u003Cspan class=\"hljs-attr\"\u003EinstallPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsplr target\u002Frelease\u002Fdmcr&quot;\u003C\u002Fspan\u003E;\n        }\n      ;\n    })\n  ;\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれでgit cloneしてnix buildでインストールできるようになりました。\nうむ。簡単。\nオーバレイでnixパッケージ化するよりもお手軽なので、\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fshnarazk\u002FSAT-bench\"\u003ESAT-bench\u003C\u002Fa\u003Eも乗り換えるかも。\u003C\u002Fp\u003E\n\u003Cp\u003E初めてFlakesを知ってから半年というか約1年。\n長い道のりでした。\u003C\u002Fp\u003E\n\u003Ch3\u003EMacOSでRustのプログラムがコンパイルできない\u003C\u002Fh3\u003E\n\u003Cp\u003E\u003Ccode\u003Eframework Security\u003C\u002Fcode\u003Eがないとか言われるなら、それはnixパッケージ化した時と同じような環境を作ってやらなければ。\nということでwebまわりの機能を使うSAT-benchの場合は以下の修正が必要だった。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E1 file changed, 1 insertion(+), 1 deletion(-)\nflake.nix | 2 +-\n\nmodified   flake.nix\n@@ -8,7 +8,7 @@\n         stdenv.mkDerivation {\n           name = &quot;SAT-bench&quot;;\n           src = self;\n-          buildInputs = [ cargo rustc ];\n+          buildInputs = rustc.buildInputs ++ [ cargo rustc libiconv openssl pkgconfig ];\n           buildPhase = &quot;cargo build --release&quot;;\n           installPhase = &quot;mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsat-bench target\u002Frelease\u002Fbenchm&quot;;\n         }\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n",dir:"article\u002F.json\u002F2021",base:"2021-03-14-nix-flakes.json",ext:".json",sourceBase:"2021-03-14-nix-flakes.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Nix flakeの作り方"},subtitle:{writable:true,enumerable:true,value:"さあ来いnix-2.4"},date:{writable:true,enumerable:true,value:"2021-03-16T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["NixOS"]},banner:{writable:true,enumerable:true,value:"https:\u002F\u002Fimages.unsplash.com\u002Fphoto-1482597869166-609e91429f40?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=2400"},banner_caption:{writable:true,enumerable:true,value:"https:\u002F\u002Funsplash.com\u002Fphotos\u002FU2L0qbBw9Jo"},bodyContent:{writable:true,enumerable:true,value:"2021-03-08にnixのベータ版？が三ヶ月ぶりに更新されて、ようやくnixを置き換えてもエラーなく使えるようになりました。\nなので早速Splrで使ってみたのでいくつかメモ。\n\n## restricted modeとは\n\n`nix-env -u`でエラーはなくなったものの、flake.nixを作ろうとすると相変わらずrestricted modeではxxxxにアクセスできないというようなエラーが出る。これは`--impure`フラグを渡してやるといい。`nix --help`によると、\n\n\u003E When the --expr option is given, all installables are interpreted as Nix expressions.\n\u003E You may need to specify --impure if the expression references impure inputs (such as \u003Cnixpkgs\u003E).\n\nということで、多分12月頃からこうすればよかったようだ。\n\n```shell\n$ nix flake init --impure\n$ nix build --impure\n```\n\n## flake.nixはどう書けばいいのか\n\n[Nix Wiki](https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFlakes)に出てくるのは以下の例\n\n```nix\n{\n  inputs = {\n    home-manager.url = \"github:nix-community\u002Fhome-manager\";\n  };\n}\n```\n\n```nix\n{\n  outputs = { self, nixpkgs }: {\n     # replace 'joes-desktop' with your hostname here.\n     nixosConfigurations.joes-desktop = nixpkgs.lib.nixosSystem {\n       system = \"x86_64-linux\";\n       modules = [ .\u002Fconfiguration.nix ];\n     };\n  };\n}\n```\n\nしかし、2020年5月の記事だけど[NIX FLAKES, PART 1: AN INTRODUCTION AND TUTORIAL](https:\u002F\u002Fwww.tweag.io\u002Fblog\u002F2020-05-25-flakes\u002F)の以下の例がまず足掛かり。\n\n```nix\n{\n  description = \"A flake for building Hello World\";\n  inputs.nixpkgs.url = github:NixOS\u002Fnixpkgs\u002Fnixos-20.03;\n  outputs = { self, nixpkgs }: {\n    defaultPackage.x86_64-linux =\n      # Notice the reference to nixpkgs here.\n      with import nixpkgs { system = \"x86_64-linux\"; };\n      stdenv.mkDerivation {\n        name = \"hello\";\n        src = self;\n        buildPhase = \"gcc -o hello .\u002Fhello.c\";\n        installPhase = \"mkdir -p $out\u002Fbin; install -t $out\u002Fbin hello\";\n      };\n  };\n}\n```\n\nこれを真似すればよさそうだが、この例ではsystemが `x86_64-linux` に限定されている。\nいや `darwin` メインだし将来的には `aarch65` も期待したいのでもっとスマートな方法はないかと探すと、\nNix Wikiで使われている[flake-utils](https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils)がよさそうである。このパッケージは\n\n```nix\neachDefaultSystem -\u003E (\u003Csystem\u003E -\u003E attrs)\n```\n\nを提供している。ええと、これは返値がないように見えるけどこういうこと：\n\n```haskell\neachDefaultSystem :: (\u003Csystem\u003E -\u003E attrs) -\u003E attrs\n```\n\nただし、使い方は微妙である。\nよくわからないまま使うと、例えば`defaultPackege.x86-64-darwin`がエクスポートされていないというエラーが出てしまった。\nでこれによく似た関数`eachSystem`の[サンプル](https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils#eachsystem---system---system---attrs)をよく見る：\n\n```nix\neachSystem allSystems (system: { hello = 42; })\n# =\u003E {\n   hello.aarch64-darwin = 42,\n   hello.aarch64-genode = 42,\n}\n```\n\n引数closureの中で`hello`を使うと最終的に`hello.${system}`にpopulateされるのだから、`defaultPackege.色々なシステム`をpopulateするにはclosureの中では`defaultPackage`にderivationを束縛すればいい。\nということで\n\n```nix\n{\n  inputs.flake-utils.url = \"github:numtide\u002Fflake-utils\";\n  outputs = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      defaultPackage =\n        with import nixpkgs { system = \"${system}\"; };\n        stdenv.mkDerivation {...};\n    });\n}\n```\n\nとするのが正解。\n[実際のコード](https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fblob\u002Ff34a664f0f031a9ffe0c4c63558f33ab6b90eec1\u002Fflake.nix)はこれ:\n\n```nix\n{\n  description = \"A modern SAT solver in Rust\";\n  inputs.flake-utils.url = \"github:numtide\u002Fflake-utils\";\n  outputs = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      defaultPackage =\n        with import nixpkgs { system = \"${system}\"; };\n        stdenv.mkDerivation {\n          name = \"splr\";\n          src = self;\n          buildInputs = [ cargo rustc ];\n          buildPhase = \"cargo build --release\";\n          installPhase = \"mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsplr target\u002Frelease\u002Fdmcr\";\n        }\n      ;\n    })\n  ;\n}\n```\n\nこれでgit cloneしてnix buildでインストールできるようになりました。\nうむ。簡単。\nオーバレイでnixパッケージ化するよりもお手軽なので、[SAT-bench](https:\u002F\u002Fgithub.com\u002Fshnarazk\u002FSAT-bench)も乗り換えるかも。\n\n初めてFlakesを知ってから半年というか約1年。\n長い道のりでした。\n\n### MacOSでRustのプログラムがコンパイルできない\n\n`framework Security`がないとか言われるなら、それはnixパッケージ化した時と同じような環境を作ってやらなければ。\nということでwebまわりの機能を使うSAT-benchの場合は以下の修正が必要だった。\n\n```\n1 file changed, 1 insertion(+), 1 deletion(-)\nflake.nix | 2 +-\n\nmodified   flake.nix\n@@ -8,7 +8,7 @@\n         stdenv.mkDerivation {\n           name = \"SAT-bench\";\n           src = self;\n-          buildInputs = [ cargo rustc ];\n+          buildInputs = rustc.buildInputs ++ [ cargo rustc libiconv openssl pkgconfig ];\n           buildPhase = \"cargo build --release\";\n           installPhase = \"mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsat-bench target\u002Frelease\u002Fbenchm\";\n         }\n```"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003E2021-03-08にnixのベータ版？が三ヶ月ぶりに更新されて、ようやくnixを置き換えてもエラーなく使えるようになりました。\nなので早速Splrで使ってみたのでいくつかメモ。\u003C\u002Fp\u003E\n\u003Ch2\u003Erestricted modeとは\u003C\u002Fh2\u003E\n\u003Cp\u003E\u003Ccode\u003Enix-env -u\u003C\u002Fcode\u003Eでエラーはなくなったものの、flake.nixを作ろうとすると相変わらずrestricted modeではxxxxにアクセスできないというようなエラーが出る。これは\u003Ccode\u003E--impure\u003C\u002Fcode\u003Eフラグを渡してやるといい。\u003Ccode\u003Enix --help\u003C\u002Fcode\u003Eによると、\u003C\u002Fp\u003E\n\u003Cblockquote\u003E\n\u003Cp\u003EWhen the --expr option is given, all installables are interpreted as Nix expressions.\nYou may need to specify --impure if the expression references impure inputs (such as &lt;nixpkgs&gt;).\u003C\u002Fp\u003E\n\u003C\u002Fblockquote\u003E\n\u003Cp\u003Eということで、多分12月頃からこうすればよかったようだ。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-meta\"\u003E$\u003C\u002Fspan\u003E\u003Cspan class=\"bash\"\u003E nix flake init --impure\u003C\u002Fspan\u003E\n\u003Cspan class=\"hljs-meta\"\u003E$\u003C\u002Fspan\u003E\u003Cspan class=\"bash\"\u003E nix build --impure\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Ch2\u003Eflake.nixはどう書けばいいのか\u003C\u002Fh2\u003E\n\u003Cp\u003E\u003Ca href=\"https:\u002F\u002Fnixos.wiki\u002Fwiki\u002FFlakes\"\u003ENix Wiki\u003C\u002Fa\u003Eに出てくるのは以下の例\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Einputs\u003C\u002Fspan\u003E = {\n    home-manager.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;github:nix-community\u002Fhome-manager&quot;\u003C\u002Fspan\u003E;\n  };\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs }: {\n     \u003Cspan class=\"hljs-comment\"\u003E# replace &#x27;joes-desktop&#x27; with your hostname here.\u003C\u002Fspan\u003E\n     nixosConfigurations.\u003Cspan class=\"hljs-attr\"\u003Ejoes-desktop\u003C\u002Fspan\u003E = nixpkgs.lib.nixosSystem {\n       \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;x86_64-linux&quot;\u003C\u002Fspan\u003E;\n       \u003Cspan class=\"hljs-attr\"\u003Emodules\u003C\u002Fspan\u003E = [ .\u002Fconfiguration.nix ];\n     };\n  };\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eしかし、2020年5月の記事だけど\u003Ca href=\"https:\u002F\u002Fwww.tweag.io\u002Fblog\u002F2020-05-25-flakes\u002F\"\u003ENIX FLAKES, PART 1: AN INTRODUCTION AND TUTORIAL\u003C\u002Fa\u003Eの以下の例がまず足掛かり。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Edescription\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;A flake for building Hello World&quot;\u003C\u002Fspan\u003E;\n  inputs.nixpkgs.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = github:NixOS\u002Fnixpkgs\u002Fnixos-\u003Cspan class=\"hljs-number\"\u003E20.03\u003C\u002Fspan\u003E;\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs }: {\n    defaultPackage.\u003Cspan class=\"hljs-attr\"\u003Ex86_64-linux\u003C\u002Fspan\u003E =\n      \u003Cspan class=\"hljs-comment\"\u003E# Notice the reference to nixpkgs here.\u003C\u002Fspan\u003E\n      \u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E nixpkgs { \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;x86_64-linux&quot;\u003C\u002Fspan\u003E; };\n      stdenv.mkDerivation {\n        \u003Cspan class=\"hljs-attr\"\u003Ename\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;hello&quot;\u003C\u002Fspan\u003E;\n        \u003Cspan class=\"hljs-attr\"\u003Esrc\u003C\u002Fspan\u003E = self;\n        \u003Cspan class=\"hljs-attr\"\u003EbuildPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;gcc -o hello .\u002Fhello.c&quot;\u003C\u002Fspan\u003E;\n        \u003Cspan class=\"hljs-attr\"\u003EinstallPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;mkdir -p $out\u002Fbin; install -t $out\u002Fbin hello&quot;\u003C\u002Fspan\u003E;\n      };\n  };\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれを真似すればよさそうだが、この例ではsystemが \u003Ccode\u003Ex86_64-linux\u003C\u002Fcode\u003E に限定されている。\nいや \u003Ccode\u003Edarwin\u003C\u002Fcode\u003E メインだし将来的には \u003Ccode\u003Eaarch65\u003C\u002Fcode\u003E も期待したいのでもっとスマートな方法はないかと探すと、\nNix Wikiで使われている\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils\"\u003Eflake-utils\u003C\u002Fa\u003Eがよさそうである。このパッケージは\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003EeachDefaultSystem -&gt; (&lt;system&gt; -&gt; attrs)\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eを提供している。ええと、これは返値がないように見えるけどこういうこと：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E\u003Cspan class=\"hljs-title\"\u003EeachDefaultSystem\u003C\u002Fspan\u003E :: (&lt;system&gt; -&gt; attrs) -&gt; attrs\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eただし、使い方は微妙である。\nよくわからないまま使うと、例えば\u003Ccode\u003EdefaultPackege.x86-64-darwin\u003C\u002Fcode\u003Eがエクスポートされていないというエラーが出てしまった。\nでこれによく似た関数\u003Ccode\u003EeachSystem\u003C\u002Fcode\u003Eの\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fnumtide\u002Fflake-utils#eachsystem---system---system---attrs\"\u003Eサンプル\u003C\u002Fa\u003Eをよく見る：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003EeachSystem allSystems (system: { \u003Cspan class=\"hljs-attr\"\u003Ehello\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-number\"\u003E42\u003C\u002Fspan\u003E; })\n\u003Cspan class=\"hljs-comment\"\u003E# =&gt; {\u003C\u002Fspan\u003E\n   hello.\u003Cspan class=\"hljs-attr\"\u003Eaarch64-darwin\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-number\"\u003E42\u003C\u002Fspan\u003E,\n   hello.\u003Cspan class=\"hljs-attr\"\u003Eaarch64-genode\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-number\"\u003E42\u003C\u002Fspan\u003E,\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003E引数closureの中で\u003Ccode\u003Ehello\u003C\u002Fcode\u003Eを使うと最終的に\u003Ccode\u003Ehello.${system}\u003C\u002Fcode\u003Eにpopulateされるのだから、\u003Ccode\u003EdefaultPackege.色々なシステム\u003C\u002Fcode\u003Eをpopulateするにはclosureの中では\u003Ccode\u003EdefaultPackage\u003C\u002Fcode\u003Eにderivationを束縛すればいい。\nということで\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  inputs.flake-utils.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;github:numtide\u002Fflake-utils&quot;\u003C\u002Fspan\u003E;\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      \u003Cspan class=\"hljs-attr\"\u003EdefaultPackage\u003C\u002Fspan\u003E =\n        \u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E nixpkgs { \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;\u003Cspan class=\"hljs-subst\"\u003E${system}\u003C\u002Fspan\u003E&quot;\u003C\u002Fspan\u003E; };\n        stdenv.mkDerivation {...};\n    });\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eとするのが正解。\n\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fshnarazk\u002Fsplr\u002Fblob\u002Ff34a664f0f031a9ffe0c4c63558f33ab6b90eec1\u002Fflake.nix\"\u003E実際のコード\u003C\u002Fa\u003Eはこれ:\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003E{\n  \u003Cspan class=\"hljs-attr\"\u003Edescription\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;A modern SAT solver in Rust&quot;\u003C\u002Fspan\u003E;\n  inputs.flake-utils.\u003Cspan class=\"hljs-attr\"\u003Eurl\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;github:numtide\u002Fflake-utils&quot;\u003C\u002Fspan\u003E;\n  \u003Cspan class=\"hljs-attr\"\u003Eoutputs\u003C\u002Fspan\u003E = { self, nixpkgs, flake-utils }:\n    flake-utils.lib.eachDefaultSystem (system: {\n      \u003Cspan class=\"hljs-attr\"\u003EdefaultPackage\u003C\u002Fspan\u003E =\n        \u003Cspan class=\"hljs-keyword\"\u003Ewith\u003C\u002Fspan\u003E \u003Cspan class=\"hljs-built_in\"\u003Eimport\u003C\u002Fspan\u003E nixpkgs { \u003Cspan class=\"hljs-attr\"\u003Esystem\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;\u003Cspan class=\"hljs-subst\"\u003E${system}\u003C\u002Fspan\u003E&quot;\u003C\u002Fspan\u003E; };\n        stdenv.mkDerivation {\n          \u003Cspan class=\"hljs-attr\"\u003Ename\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;splr&quot;\u003C\u002Fspan\u003E;\n          \u003Cspan class=\"hljs-attr\"\u003Esrc\u003C\u002Fspan\u003E = self;\n          \u003Cspan class=\"hljs-attr\"\u003EbuildInputs\u003C\u002Fspan\u003E = [ cargo rustc ];\n          \u003Cspan class=\"hljs-attr\"\u003EbuildPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;cargo build --release&quot;\u003C\u002Fspan\u003E;\n          \u003Cspan class=\"hljs-attr\"\u003EinstallPhase\u003C\u002Fspan\u003E = \u003Cspan class=\"hljs-string\"\u003E&quot;mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsplr target\u002Frelease\u002Fdmcr&quot;\u003C\u002Fspan\u003E;\n        }\n      ;\n    })\n  ;\n}\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\u003Cp\u003Eこれでgit cloneしてnix buildでインストールできるようになりました。\nうむ。簡単。\nオーバレイでnixパッケージ化するよりもお手軽なので、\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fshnarazk\u002FSAT-bench\"\u003ESAT-bench\u003C\u002Fa\u003Eも乗り換えるかも。\u003C\u002Fp\u003E\n\u003Cp\u003E初めてFlakesを知ってから半年というか約1年。\n長い道のりでした。\u003C\u002Fp\u003E\n\u003Ch3\u003EMacOSでRustのプログラムがコンパイルできない\u003C\u002Fh3\u003E\n\u003Cp\u003E\u003Ccode\u003Eframework Security\u003C\u002Fcode\u003Eがないとか言われるなら、それはnixパッケージ化した時と同じような環境を作ってやらなければ。\nということでwebまわりの機能を使うSAT-benchの場合は以下の修正が必要だった。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E1 file changed, 1 insertion(+), 1 deletion(-)\nflake.nix | 2 +-\n\nmodified   flake.nix\n@@ -8,7 +8,7 @@\n         stdenv.mkDerivation {\n           name = &quot;SAT-bench&quot;;\n           src = self;\n-          buildInputs = [ cargo rustc ];\n+          buildInputs = rustc.buildInputs ++ [ cargo rustc libiconv openssl pkgconfig ];\n           buildPhase = &quot;cargo build --release&quot;;\n           installPhase = &quot;mkdir -p $out\u002Fbin; install -t $out\u002Fbin target\u002Frelease\u002Fsat-bench target\u002Frelease\u002Fbenchm&quot;;\n         }\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2021"},base:{writable:true,enumerable:true,value:"2021-03-14-nix-flakes.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2021-03-14-nix-flakes.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});