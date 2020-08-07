(window.webpackJsonp=window.webpackJsonp||[]).push([[93],{566:function(n){n.exports=JSON.parse('{"title":"NixOS on Big Sur","subtitle":null,"date":"2020-08-07T00:00:00.000Z","tags":["NixOS","macOS"],"banner":"/img/2020/08-07/banner.jpg","bodyContent":"# NixOS on Big Sur\\n\\n### それ以前\\n\\n/etc/synthetic.conf　に\\n\\n```\\nnix\\n```\\n\\nを追加してmountしていた。\\n\\n### Big Sur\\n\\nなんかmountしてくれないので `/nix` をシンボリックリンクに変更して対応。\\nそのため、/etc/synthetic.conf を\\n\\n```\\nnix\\t/Volumes/Nix\\n```\\nに編集。さらにどこかで\\n\\n```\\nexport NIX_IGNORE_SYMLINK_STORE=1\\n```\\n\\nを実行して、リンクを辿ってくれるようにすればいいようだ。\\n\\nそれにしてもGnomeだなぁ。。。","bodyHtml":"<h1>NixOS on Big Sur</h1>\\n<h3>それ以前</h3>\\n<p>/etc/synthetic.conf　に</p>\\n<pre><code>nix\\n</code></pre>\\n<p>を追加してmountしていた。</p>\\n<h3>Big Sur</h3>\\n<p>なんかmountしてくれないので <code>/nix</code> をシンボリックリンクに変更して対応。\\nそのため、/etc/synthetic.conf を</p>\\n<pre><code>nix\\t/Volumes/Nix\\n</code></pre>\\n<p>に編集。さらにどこかで</p>\\n<pre><code>export NIX_IGNORE_SYMLINK_STORE=1\\n</code></pre>\\n<p>を実行して、リンクを辿ってくれるようにすればいいようだ。</p>\\n<p>それにしてもGnomeだなぁ。。。</p>\\n","dir":"article/.json/2020","base":"2020-08-07-NixOS-on-BigSur.json","ext":".json","sourceBase":"2020-08-07-NixOS-on-BigSur.md","sourceExt":".md"}')}}]);