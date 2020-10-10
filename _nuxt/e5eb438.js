(window.webpackJsonp=window.webpackJsonp||[]).push([[56],{542:function(n){n.exports=JSON.parse('{"title":"Using Nix on Catalina","subtitle":"Catalina上でNixを使う","date":"2019-10-17T00:00:00.000Z","tags":["nixOS","macOS"],"bodyContent":"Catalinaでは\'/\'にディレクトリが作れなくなってしまったので\\n`/nix`がどうにもならんことになってしまった。\\n[Discourseのトピック](https://discourse.nixos.org/t/current-status-of-nix-on-macos-catalina/4286/2)によれば、\\nパーティションを作ってマウントすることが必要らしい（[参考](https://github.com/NixOS/nix/issues/2925)）。\\nうーむ、どうもこれしかなさそうなんだけど、\\nもうちょっとやり方が確定するまでメインマシンのアップグレードはしばらく待ってみようか。\\n\\nちなみに現在、Nixで（メインマシンに）インストールしているものは以下の通り。\\n\\n- **coreutils-8.31** -- あって当然のGNU系のオプションを使うために重要\\n- **emacs-26.3**\\n- **git-2.23.0**\\n- **gnupg-2.2.17**\\n- nix-2.3\\n- nodejs-12.5.0 -- 各種サイトの生成に使用中\\n- nss-cacert-3.46\\n- **parallel-20190722** -- `git catchup`が依存している\\n- pinentry-1.1.0\\n- R-3.6.1-wrapper -- Observableでcactus plotが描ければ捨ててもよくなった\\n- sat-bench-0.6.3 -- メインマシンでは重要\\n- source-highlight-3.1.8 -- なくてもいい\\n- **tmux-2.9a**\\n- **xz-5.2.4** -- benchmark結果の圧縮に使用\\n\\n特に重要なものはcoreutils, emacs, git, parallel, tmux, xzあたり。\\nsat-bench, R, source-highlightは多分捨てられる。\\ngunpg, nodejsは公式バイナリでもいいか。\\n\\nとすると、残念だけど、色々と設定が必要ならこの際Nixをやめられない訳ではないようだ。\\n\\n# 2019-10-08T19:00:00 STEPS THAT WORK\\n\\nなどと言いつつ、敷居が低い人柱を志願してしまった。\\n\\n1. synthetic.confを作る\\n\\n```sh\\nsudo echo nix > /System/Volumes/Data/private/etc/synthetic.conf\\n```\\n\\n（いや/usr/bin/vimを使うことになるのだけど。）\\n\\n2. `/nix`を有効にするためまずreboot\\n\\n3. ボリューム`Nix`を作る\\n\\n```sh\\nsudo /usr/sbin/diskutil apfs addVolume disk1 APFSX Nix -mountpoint /nix\\n```\\n\\n4. 色々attributeを設定\\n\\n```sh\\nsudo /usr/sbin/diskutil enableOwneship /nix\\nsudo /usr/sbin/diskutil apfs encrypt Nix -user disk\\nsudo /usr/sbin/chown -R <user> /nix\\n```\\n\\n5. nixをインストール\\n\\n```sh\\ncurl https://nixos.org/nix/install | sh\\n```\\n\\n移動されたディレクトリから復帰するのはownerなどが変わっていたのでやめたほうがいいだろう。\\nということでnix由来のプログラムも復活。メインマシンも更新しよう。\\n\\nしかしCatalinaはinteractive shellをzshに変えよとうるさい。色々設定を変えるはめんどいんじゃあ。\\n\\n\\n### 2019-10-17\\n\\nリブートしたらNixボリュームが/Volume/Nixにマウントされていた。/nixはあるけど空。\\nということで上記の方法で設定しても、毎回、\\n\\n```sh\\nsudo /usr/sbin/diskutil umount /Volume/Nix\\nsudo /usr/sbin/diskutil mount -mountPoint /nix Nix\\n```\\n\\nしないといけないっぽい。マウントポイントは永続的ではないのか。","bodyHtml":"<p>Catalinaでは\'/\'にディレクトリが作れなくなってしまったので\\n<code>/nix</code>がどうにもならんことになってしまった。\\n<a href=\\"https://discourse.nixos.org/t/current-status-of-nix-on-macos-catalina/4286/2\\">Discourseのトピック</a>によれば、\\nパーティションを作ってマウントすることが必要らしい（<a href=\\"https://github.com/NixOS/nix/issues/2925\\">参考</a>）。\\nうーむ、どうもこれしかなさそうなんだけど、\\nもうちょっとやり方が確定するまでメインマシンのアップグレードはしばらく待ってみようか。</p>\\n<p>ちなみに現在、Nixで（メインマシンに）インストールしているものは以下の通り。</p>\\n<ul>\\n<li><strong>coreutils-8.31</strong> -- あって当然のGNU系のオプションを使うために重要</li>\\n<li><strong>emacs-26.3</strong></li>\\n<li><strong>git-2.23.0</strong></li>\\n<li><strong>gnupg-2.2.17</strong></li>\\n<li>nix-2.3</li>\\n<li>nodejs-12.5.0 -- 各種サイトの生成に使用中</li>\\n<li>nss-cacert-3.46</li>\\n<li><strong>parallel-20190722</strong> -- <code>git catchup</code>が依存している</li>\\n<li>pinentry-1.1.0</li>\\n<li>R-3.6.1-wrapper -- Observableでcactus plotが描ければ捨ててもよくなった</li>\\n<li>sat-bench-0.6.3 -- メインマシンでは重要</li>\\n<li>source-highlight-3.1.8 -- なくてもいい</li>\\n<li><strong>tmux-2.9a</strong></li>\\n<li><strong>xz-5.2.4</strong> -- benchmark結果の圧縮に使用</li>\\n</ul>\\n<p>特に重要なものはcoreutils, emacs, git, parallel, tmux, xzあたり。\\nsat-bench, R, source-highlightは多分捨てられる。\\ngunpg, nodejsは公式バイナリでもいいか。</p>\\n<p>とすると、残念だけど、色々と設定が必要ならこの際Nixをやめられない訳ではないようだ。</p>\\n<h1>2019-10-08T19:00:00 STEPS THAT WORK</h1>\\n<p>などと言いつつ、敷居が低い人柱を志願してしまった。</p>\\n<ol>\\n<li>synthetic.confを作る</li>\\n</ol>\\n<pre><code class=\\"hljs\\">sudo <span class=\\"hljs-built_in\\">echo</span> nix &gt; /System/Volumes/Data/private/etc/synthetic.conf</code></pre><p>（いや/usr/bin/vimを使うことになるのだけど。）</p>\\n<ol start=\\"2\\">\\n<li>\\n<p><code>/nix</code>を有効にするためまずreboot</p>\\n</li>\\n<li>\\n<p>ボリューム<code>Nix</code>を作る</p>\\n</li>\\n</ol>\\n<pre><code class=\\"hljs\\">sudo /usr/sbin/diskutil apfs addVolume disk1 APFSX Nix -mountpoint /nix</code></pre><ol start=\\"4\\">\\n<li>色々attributeを設定</li>\\n</ol>\\n<pre><code class=\\"hljs\\">sudo /usr/sbin/diskutil enableOwneship /nix\\nsudo /usr/sbin/diskutil apfs encrypt Nix -user disk\\nsudo /usr/sbin/chown -R &lt;user&gt; /nix</code></pre><ol start=\\"5\\">\\n<li>nixをインストール</li>\\n</ol>\\n<pre><code class=\\"hljs\\">curl https://nixos.org/nix/install | sh</code></pre><p>移動されたディレクトリから復帰するのはownerなどが変わっていたのでやめたほうがいいだろう。\\nということでnix由来のプログラムも復活。メインマシンも更新しよう。</p>\\n<p>しかしCatalinaはinteractive shellをzshに変えよとうるさい。色々設定を変えるはめんどいんじゃあ。</p>\\n<h3>2019-10-17</h3>\\n<p>リブートしたらNixボリュームが/Volume/Nixにマウントされていた。/nixはあるけど空。\\nということで上記の方法で設定しても、毎回、</p>\\n<pre><code class=\\"hljs\\">sudo /usr/sbin/diskutil umount /Volume/Nix\\nsudo /usr/sbin/diskutil mount -mountPoint /nix Nix</code></pre><p>しないといけないっぽい。マウントポイントは永続的ではないのか。</p>\\n","dir":"article/.json/2019","base":"2019-10-08-nix-on-catalina.json","ext":".json","sourceBase":"2019-10-08-nix-on-catalina.md","sourceExt":".md"}')}}]);