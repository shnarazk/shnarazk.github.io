(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{514:function(n){n.exports=JSON.parse('{"title":"Glucose on NixOS","subtitle":"nix-shellを使ってglucoseをインストール","date":"2018-06-21T00:00:00.000Z","tags":["NixOS","Glucose","SAT"],"bodyContent":"<script src=\\"https://gitlab.com/satisfiability01/satisfiability01.gitlab.io/snippets/1726649.js\\"><\/script>\\n\\n\\nbuilder.sh\\n\\n```\\ncd simp\\nmake clean\\nmake\\nmv glucose glucose3\\n```\\n\\n### build\\n\\n```\\n$ nix-shell -p zlib\\n$ cd simp; make clean; make;\\n$ cp glucose3 ~/.local/bin\\n```","bodyHtml":"<p>&lt;script src=&quot;https://gitlab.com/satisfiability01/satisfiability01.gitlab.io/snippets/1726649.js&quot;&gt;&lt;/script&gt;</p>\\n<p>builder.sh</p>\\n<pre><code>cd simp\\nmake clean\\nmake\\nmv glucose glucose3\\n</code></pre>\\n<h3>build</h3>\\n<pre><code>$ nix-shell -p zlib\\n$ cd simp; make clean; make;\\n$ cp glucose3 ~/.local/bin\\n</code></pre>\\n","dir":"article/.json/2018","base":"2018-06-21-glucose-on-nixos.json","ext":".json","sourceBase":"2018-06-21-glucose-on-nixos.md","sourceExt":".md"}')}}]);