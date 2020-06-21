(window.webpackJsonp=window.webpackJsonp||[]).push([[80],{552:function(n){n.exports=JSON.parse('{"title":"How to compile cargo-instruments","subtitle":"on NixOS on MacOS","date":"2020-06-07T00:00:00.000Z","tags":["Rust","macOS","nixOS"],"banner":"/img/2020/06-07/banner.jpg","bodyContent":"## Rustでプロファイリングしたいんじゃあ\\n\\nvalgrindは動くけど、perfはない、massive-visualizerもない。\\nLinuxに比べてmacOSはRustのプロファイリングが不自由だなあ。\\nそれでも、まともなLinuxマシンが手元にないのでなんとかmac上でプロファイリングしなければならない。\\n何かインストールしなければ。\\nいくつか調べてみて（そもそも検索でヒットするページが意外なほど少ないのだけど）[cargo-instruments](https://crates.io/crates/cargo-instruments)というのがよさそうだということがわかりました。\\n残念だけど、opensshのバージョン問題で単に`cargo install`とするだけではコンパイルできないようです。\\nbrewを使っているのが前提になっているのだろうか。\\nうーん、これはいつものパターンだな。\\n\\n## nix-shellでコンパイルしよう\\n\\nsat-benchでの経験を基に、nix-shellで環境作ってcargoを呼び出す方法で、一つ一つ問題を潰していくと、こうなった。\\n\\n```shell\\n$ nix-shell -p openssl pkg-config libiconv darwin.apple_sdk.frameworks.Security libcurl\\n$ cargo install cargo-instruments\\n```\\n\\nこれはコンパイルは最後まで走るのだけど、最後の最後のリンクフェーズで`_CFURLSetResourcePropertyForKey`が見つからないエラーで失敗する。\\nどうもこれはnixOS上のrustのコンパイルでよく知られた問題のようで、とあるrust関連のnix expressionにはコメントで出てきて、dirty hackで対応だ、みたいなことが書いてある。\\n-- `/pkgs/development/tools/rust/cargo-geiger/`\\n\\n```nix\\n  # FIXME: Use impure version of CoreFoundation because of missing symbols.\\n  # CFURLSetResourcePropertyForKey is defined in the headers but there\'s no\\n  # corresponding implementation in the sources from opensource.apple.com.\\n  preConfigure = stdenv.lib.optionalString stdenv.isDarwin \'\'\\n    export NIX_CFLAGS_COMPILE=\\"-F${CoreFoundation}/Library/Frameworks $NIX_CFLAGS_COMPILE\\"\\n  \'\';\\n```\\n\\nだったら、derivation を作るしかないか。\\n\\n# That works!\\n\\nということで色々nix expressionを見ながら作ったのがこちら。\\n\\n### 1. /pkgs/development/tools/rust/cargo-instruments/default.nix\\n\\n```nix\\n{ stdenv, runCommand, fetchFromGitHub, rustPlatform, Security, CoreFoundation, openssl, pkg-config, libiconv, curl }:\\n\\nrustPlatform.buildRustPackage rec {\\n  pname = \\"cargo-instruments\\";\\n  version = \\"0.3.1\\";\\n\\n  src = fetchFromGitHub {\\n    owner = \\"cmyr\\";\\n    repo = \\"cargo-instruments\\";\\n    rev = \\"7201328c3556b9d2872308869ac917b4b9d9b352\\";\\n    hash = \\"sha256:1dgp38bgdk4pnrph21zygi4xjcmj449h0m4shapy0nabqwd5l3yz\\";\\n  };\\n\\n  nativeBuildInputs = [ pkg-config ];\\n  buildInputs = [ openssl libiconv curl Security ];\\n  cargoSha256 = \\"sha256:18m9gk2i798vbj48gv60f19fpd6qvk3jrpljp5ai4mzjirhbscxs\\";\\n  doCheck = false;\\n  preConfigure = stdenv.lib.optionalString stdenv.isDarwin \'\'\\n    export NIX_CFLAGS_COMPILE=\\"-F${CoreFoundation}/Library/Frameworks $NIX_CFLAGS_COMPILE\\"\\n  \'\';\\n\\n  meta = with stdenv.lib; {\\n    descriptin = \\"A cargo plugin to generate Xcode Instruments trace files\\";\\n    homepage = \\"https://github.com/cmyr/cargo-instruments\\";\\n    license = licenses.mit;\\n    maintainers = with maintainers; [ shnarazk ];\\n    platforms = platforms.darwin;\\n  };\\n}\\n```\\n\\n### 2. /pkgs/top-level/all-packages.nix\\n\\n```diff\\nmodified   pkgs/top-level/all-packages.nix\\n@@ -9205,6 +9205,10 @@ in\\n   cargo-inspect = callPackage ../development/tools/rust/cargo-inspect {\\n     inherit (darwin.apple_sdk.frameworks) Security;\\n   };\\n+  cargo-instruments = callPackage ../development/tools/rust/cargo-instruments {\\n+    inherit (darwin) libiconv;\\n+    inherit (darwin.apple_sdk.frameworks) Security CoreFoundation;\\n+  };\\n   cargo-make = callPackage ../development/tools/rust/cargo-make {\\n     inherit (darwin.apple_sdk.frameworks) Security;\\n   };\\n```\\n\\nちゃんと動いているので、nixpkgs に入れてもらおうかな。","bodyHtml":"<h2>Rustでプロファイリングしたいんじゃあ</h2>\\n<p>valgrindは動くけど、perfはない、massive-visualizerもない。\\nLinuxに比べてmacOSはRustのプロファイリングが不自由だなあ。\\nそれでも、まともなLinuxマシンが手元にないのでなんとかmac上でプロファイリングしなければならない。\\n何かインストールしなければ。\\nいくつか調べてみて（そもそも検索でヒットするページが意外なほど少ないのだけど）<a href=\\"https://crates.io/crates/cargo-instruments\\">cargo-instruments</a>というのがよさそうだということがわかりました。\\n残念だけど、opensshのバージョン問題で単に<code>cargo install</code>とするだけではコンパイルできないようです。\\nbrewを使っているのが前提になっているのだろうか。\\nうーん、これはいつものパターンだな。</p>\\n<h2>nix-shellでコンパイルしよう</h2>\\n<p>sat-benchでの経験を基に、nix-shellで環境作ってcargoを呼び出す方法で、一つ一つ問題を潰していくと、こうなった。</p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-meta\\">$</span><span class=\\"bash\\"> nix-shell -p openssl pkg-config libiconv darwin.apple_sdk.frameworks.Security libcurl</span>\\n<span class=\\"hljs-meta\\">$</span><span class=\\"bash\\"> cargo install cargo-instruments</span></code></pre><p>これはコンパイルは最後まで走るのだけど、最後の最後のリンクフェーズで<code>_CFURLSetResourcePropertyForKey</code>が見つからないエラーで失敗する。\\nどうもこれはnixOS上のrustのコンパイルでよく知られた問題のようで、とあるrust関連のnix expressionにはコメントで出てきて、dirty hackで対応だ、みたいなことが書いてある。\\n-- <code>/pkgs/development/tools/rust/cargo-geiger/</code></p>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\"># <span class=\\"hljs-doctag\\">FIXME:</span> Use impure version of CoreFoundation because of missing symbols.</span>\\n  <span class=\\"hljs-comment\\"># CFURLSetResourcePropertyForKey is defined in the headers but there\'s no</span>\\n  <span class=\\"hljs-comment\\"># corresponding implementation in the sources from opensource.apple.com.</span>\\n  <span class=\\"hljs-attr\\">preConfigure</span> = stdenv.lib.optionalString stdenv.isDarwin <span class=\\"hljs-string\\">\'\'\\n    export NIX_CFLAGS_COMPILE=\\"-F<span class=\\"hljs-subst\\">${CoreFoundation}</span>/Library/Frameworks $NIX_CFLAGS_COMPILE\\"\\n  \'\'</span>;</code></pre><p>だったら、derivation を作るしかないか。</p>\\n<h1>That works!</h1>\\n<p>ということで色々nix expressionを見ながら作ったのがこちら。</p>\\n<h3>1. /pkgs/development/tools/rust/cargo-instruments/default.nix</h3>\\n<pre><code class=\\"hljs\\">{ stdenv, runCommand, fetchFromGitHub, rustPlatform, Security, CoreFoundation, openssl, pkg-config, libiconv, curl }:\\n\\nrustPlatform.buildRustPackage <span class=\\"hljs-keyword\\">rec</span> {\\n  <span class=\\"hljs-attr\\">pname</span> = <span class=\\"hljs-string\\">\\"cargo-instruments\\"</span>;\\n  <span class=\\"hljs-attr\\">version</span> = <span class=\\"hljs-string\\">\\"0.3.1\\"</span>;\\n\\n  <span class=\\"hljs-attr\\">src</span> = fetchFromGitHub {\\n    <span class=\\"hljs-attr\\">owner</span> = <span class=\\"hljs-string\\">\\"cmyr\\"</span>;\\n    <span class=\\"hljs-attr\\">repo</span> = <span class=\\"hljs-string\\">\\"cargo-instruments\\"</span>;\\n    <span class=\\"hljs-attr\\">rev</span> = <span class=\\"hljs-string\\">\\"7201328c3556b9d2872308869ac917b4b9d9b352\\"</span>;\\n    <span class=\\"hljs-attr\\">hash</span> = <span class=\\"hljs-string\\">\\"sha256:1dgp38bgdk4pnrph21zygi4xjcmj449h0m4shapy0nabqwd5l3yz\\"</span>;\\n  };\\n\\n  <span class=\\"hljs-attr\\">nativeBuildInputs</span> = [ pkg-config ];\\n  <span class=\\"hljs-attr\\">buildInputs</span> = [ openssl libiconv curl Security ];\\n  <span class=\\"hljs-attr\\">cargoSha256</span> = <span class=\\"hljs-string\\">\\"sha256:18m9gk2i798vbj48gv60f19fpd6qvk3jrpljp5ai4mzjirhbscxs\\"</span>;\\n  <span class=\\"hljs-attr\\">doCheck</span> = <span class=\\"hljs-literal\\">false</span>;\\n  <span class=\\"hljs-attr\\">preConfigure</span> = stdenv.lib.optionalString stdenv.isDarwin <span class=\\"hljs-string\\">\'\'\\n    export NIX_CFLAGS_COMPILE=\\"-F<span class=\\"hljs-subst\\">${CoreFoundation}</span>/Library/Frameworks $NIX_CFLAGS_COMPILE\\"\\n  \'\'</span>;\\n\\n  <span class=\\"hljs-attr\\">meta</span> = <span class=\\"hljs-keyword\\">with</span> stdenv.lib; {\\n    <span class=\\"hljs-attr\\">descriptin</span> = <span class=\\"hljs-string\\">\\"A cargo plugin to generate Xcode Instruments trace files\\"</span>;\\n    <span class=\\"hljs-attr\\">homepage</span> = <span class=\\"hljs-string\\">\\"https://github.com/cmyr/cargo-instruments\\"</span>;\\n    <span class=\\"hljs-attr\\">license</span> = licenses.mit;\\n    <span class=\\"hljs-attr\\">maintainers</span> = <span class=\\"hljs-keyword\\">with</span> maintainers; [ shnarazk ];\\n    <span class=\\"hljs-attr\\">platforms</span> = platforms.darwin;\\n  };\\n}</code></pre><h3>2. /pkgs/top-level/all-packages.nix</h3>\\n<pre><code class=\\"hljs\\">modified   pkgs/top-level/all-packages.nix\\n@@ -9205,6 +9205,10 @@ in\\n   cargo-inspect = callPackage ../development/tools/rust/cargo-inspect {\\n     inherit (darwin.apple_sdk.frameworks) Security;\\n   };\\n<span class=\\"hljs-addition\\">+  cargo-instruments = callPackage ../development/tools/rust/cargo-instruments {</span>\\n<span class=\\"hljs-addition\\">+    inherit (darwin) libiconv;</span>\\n<span class=\\"hljs-addition\\">+    inherit (darwin.apple_sdk.frameworks) Security CoreFoundation;</span>\\n<span class=\\"hljs-addition\\">+  };</span>\\n   cargo-make = callPackage ../development/tools/rust/cargo-make {\\n     inherit (darwin.apple_sdk.frameworks) Security;\\n   };</code></pre><p>ちゃんと動いているので、nixpkgs に入れてもらおうかな。</p>\\n","dir":"article/.json/2020","base":"2020-06-07-cargo-instruments.json","ext":".json","sourceBase":"2020-06-07-cargo-instruments.md","sourceExt":".md"}')}}]);