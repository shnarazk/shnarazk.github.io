(window.webpackJsonp=window.webpackJsonp||[]).push([[93],{566:function(n){n.exports=JSON.parse('{"title":"NixOS on Big Sur","subtitle":null,"date":"2020-08-07T00:00:00.000Z","tags":["NixOS","macOS"],"banner":"/img/2020/08-07/banner.jpg","bodyContent":"### Big Sur以前\\n\\n/etc/synthetic.conf　に\\n\\n```\\nnix\\n```\\n\\nを追加してmountしていた。\\n\\n### Big Sur\\n\\nなんだかmountしてくれないので `/nix` をシンボリックリンクに変更して対応することにした。\\nそのため、/etc/synthetic.conf を\\n\\n```\\nnix\\t/Volumes/Nix\\n```\\nに編集。さらにどこかで\\n\\n```\\nexport NIX_IGNORE_SYMLINK_STORE=1\\n```\\n\\nを実行して、リンクを辿ってくれるようにすればいいようだ。\\n\\nそれにしてもGnomeだなぁ。。。\\n\\n### 2020-08-09\\n\\n/usr/lib/system/libcache.dylib がないのでrustプログラムがコンパイルできなくなっている。","bodyHtml":"<h3>Big Sur以前</h3>\\n<p>/etc/synthetic.conf　に</p>\\n<pre><code>nix\\n</code></pre>\\n<p>を追加してmountしていた。</p>\\n<h3>Big Sur</h3>\\n<p>なんだかmountしてくれないので <code>/nix</code> をシンボリックリンクに変更して対応することにした。\\nそのため、/etc/synthetic.conf を</p>\\n<pre><code>nix\\t/Volumes/Nix\\n</code></pre>\\n<p>に編集。さらにどこかで</p>\\n<pre><code>export NIX_IGNORE_SYMLINK_STORE=1\\n</code></pre>\\n<p>を実行して、リンクを辿ってくれるようにすればいいようだ。</p>\\n<p>それにしてもGnomeだなぁ。。。</p>\\n<h3>2020-08-09</h3>\\n<p>/usr/lib/system/libcache.dylib がないのでrustプログラムがコンパイルできなくなっている。</p>\\n","dir":"article/.json/2020","base":"2020-08-07-NixOS-on-BigSur.json","ext":".json","sourceBase":"2020-08-07-NixOS-on-BigSur.md","sourceExt":".md"}')}}]);