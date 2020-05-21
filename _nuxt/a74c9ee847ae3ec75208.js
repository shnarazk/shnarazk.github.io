(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{493:function(n){n.exports=JSON.parse('{"title":"Lingeling on NixOS","subtitle":"NixOSにLingelingをインストール","date":"2018-06-21T00:00:00.000Z","tags":["Lingeling","NixOS","SAT"],"bodyContent":"### lingeling.nix\\n\\n```nix\\n{ pkgs ? import <nixpkgs>{} } :\\nlet\\n  stdenv = pkgs.stdenv;\\n  fetchurl = pkgs.fetchurl;\\n  zlib = pkgs.zlib;\\nin\\nstdenv.mkDerivation rec {\\n  name = \\"lingeling\\";\\n  version = \\"1.0\\";\\n\\n  src = fetchurl {\\n   url = \\"http://fmv.jku.at/lingeling/lingeling-bbc-9230380-160707.tar.gz\\";\\n   sha256 = \\"7960c69ebd3da1400b0f3135fa08d71abd405c180fc52f785b35ad8a58585126\\";\\n  };\\n\\n  sourceRoot = \\"lingeling-bbc-9230380-160707\\";\\n  configureScript=\\"./configure.sh\\";\\n  dontAddPrefix=true;\\n  makeFlags = [ \\"\\" ];\\n  installPhase = \'\'\\n    install -Dm0755 lingeling $out/bin/lingeling\\n    mkdir -p \\"$out/share/doc/${name}/\\"\\n    install -Dm0755 {COPYING,NEWS,README,VERSION} \\"$out/share/doc/${name}/\\"\\n  \'\';\\n\\n  meta = with stdenv.lib; {\\n\\n    description = \\"A Modern and parallel SAT solver. Copyright (c) 2010 - 2016 Armin Biere, Johannes Kepler University, Linz, Austria. http://fmv.jku.at/lingeling/\\";\\n#    license = licenses.mit;\\n    platforms = platforms.unix;\\n  };\\n}\\n```\\n\\nRun: \\n```bash\\n$ nix-build lingeling.nix\\n```","bodyHtml":"<h3>lingeling.nix</h3>\\n<pre><code class=\\"hljs\\">{ pkgs ? <span class=\\"hljs-built_in\\">import</span> &lt;nixpkgs&gt;{} } :\\n<span class=\\"hljs-keyword\\">let</span>\\n  <span class=\\"hljs-attr\\">stdenv</span> = pkgs.stdenv;\\n  <span class=\\"hljs-attr\\">fetchurl</span> = pkgs.fetchurl;\\n  <span class=\\"hljs-attr\\">zlib</span> = pkgs.zlib;\\n<span class=\\"hljs-keyword\\">in</span>\\nstdenv.mkDerivation <span class=\\"hljs-keyword\\">rec</span> {\\n  <span class=\\"hljs-attr\\">name</span> = <span class=\\"hljs-string\\">\\"lingeling\\"</span>;\\n  <span class=\\"hljs-attr\\">version</span> = <span class=\\"hljs-string\\">\\"1.0\\"</span>;\\n\\n  <span class=\\"hljs-attr\\">src</span> = fetchurl {\\n   <span class=\\"hljs-attr\\">url</span> = <span class=\\"hljs-string\\">\\"http://fmv.jku.at/lingeling/lingeling-bbc-9230380-160707.tar.gz\\"</span>;\\n   <span class=\\"hljs-attr\\">sha256</span> = <span class=\\"hljs-string\\">\\"7960c69ebd3da1400b0f3135fa08d71abd405c180fc52f785b35ad8a58585126\\"</span>;\\n  };\\n\\n  <span class=\\"hljs-attr\\">sourceRoot</span> = <span class=\\"hljs-string\\">\\"lingeling-bbc-9230380-160707\\"</span>;\\n  <span class=\\"hljs-attr\\">configureScript=\\"./configure.sh\\";</span>\\n  <span class=\\"hljs-attr\\">dontAddPrefix=true;</span>\\n  <span class=\\"hljs-attr\\">makeFlags</span> = [ <span class=\\"hljs-string\\">\\"\\"</span> ];\\n  <span class=\\"hljs-attr\\">installPhase</span> = <span class=\\"hljs-string\\">\'\'\\n    install -Dm0755 lingeling $out/bin/lingeling\\n    mkdir -p \\"$out/share/doc/<span class=\\"hljs-subst\\">${name}</span>/\\"\\n    install -Dm0755 {COPYING,NEWS,README,VERSION} \\"$out/share/doc/<span class=\\"hljs-subst\\">${name}</span>/\\"\\n  \'\'</span>;\\n\\n  <span class=\\"hljs-attr\\">meta</span> = <span class=\\"hljs-keyword\\">with</span> stdenv.lib; {\\n\\n    <span class=\\"hljs-attr\\">description</span> = <span class=\\"hljs-string\\">\\"A Modern and parallel SAT solver. Copyright (c) 2010 - 2016 Armin Biere, Johannes Kepler University, Linz, Austria. http://fmv.jku.at/lingeling/\\"</span>;\\n<span class=\\"hljs-comment\\">#    license = licenses.mit;</span>\\n    <span class=\\"hljs-attr\\">platforms</span> = platforms.unix;\\n  };\\n}</code></pre><p>Run:</p>\\n<pre><code class=\\"hljs\\">$ nix-build lingeling.nix</code></pre>","dir":"article/.json/2018","base":"2018-06-21-lingeling-on-nixos.json","ext":".json","sourceBase":"2018-06-21-lingeling-on-nixos.md","sourceExt":".md"}')}}]);