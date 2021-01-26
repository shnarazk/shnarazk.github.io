(window.webpackJsonp=window.webpackJsonp||[]).push([[95],{582:function(n){n.exports=JSON.parse('{"title":"JaNG version 1.0.2","subtitle":"import from GitHub Gist","date":"2020-08-14T00:00:00.000Z","tags":["jang","vuejs","nuxtjs"],"bodyContent":"このブログの静的サイトジェネレータ（名前はまだない。とりあえず\'JaNG\', *Just-A-Note Generator* にしておきます）をバージョン1.0.2に更新しました。変更点はgithub.comに作ったgistが取り込めるようになったこと。\\n\\n[Observable](https://observablehq.com/)が（結構）簡単に取り込めたので、1時間程度でできるかと思ったら数日がかりになってしまいました。ChangeLog代わりに苦労した点を残しておきます。\\n\\n* githubが埋め込み用に提供するのはjavascriptまたはjson形式。ちょっとjavascriptは置いといてjsonを使う方向で計画。\\n* ところがjsonを読み込もうとすると `Cross-Access-Allow-Origin` の制約に引っかかってデータがとって来れない。手動でリロードを掛けて、サーバー側のレンダリングされたページを持ってくれば表示はできるようにしてみたけど、それはどう考えてもかっこ悪い。\\n* サーバに最初にデータを揃えて静的サイトの生成を始めるというのがどう考えても自然なので、asyncDataなのかfetchなのか、どこに書けばベストなのか、他（下）の問題も解決しながら、調べて実験して、結局 `nuxtServerInit`　をストアに追加しました。（追加するのも一苦労。actionsの中に書くのね。）この関数は最終的にcommitでstoreのデータを更新すればよいと。\\n\\n```js\\n// store/index.js\\nexport const actions = {\\n  async nuxtServerInit({ commit }) {\\n    ...\\n    commit(\'mutations\', ...)\\n  },\\n```\\n\\n* `forEach` で呼び出す関数が `async` にできないことを理解するのに一苦労（まあ、`nuxtServerInit`の先頭に`async`を置きながら、forEachの無名関数にもおかなくていいのか **うっすらと** 疑問は感じてた）。\\nfor文に書き直して、レンダリングが始まる前に全てのエントリーのデータを持って来れるようになったのでデータ取得問題がやっと解決。\\n\\n```js\\n// store/index.js\\nexport const actions = {\\n  async nuxtServerInit({ commit }) {\\n    const arr = Object.entries(gist)\\n    for(let val of arr) {\\n      const art = val[1]\\n      if (art.gistid !== undefined) {\\n        art.url = `https://gist.github.com/${art.owner}/${art.gistid}`\\n        const j = await axios.get(`${art.url}.json`)\\n        if (j.data === undefined)\\n          art.content = `could not load ${art.url}.json`\\n        else {\\n          art.content = j.data.div\\n          art.description = j.data.description\\n          art.created_at = j.data.created_at.substring(0, 10)\\n        }\\n      }\\n    }\\n    commit(\'mutations\', arr)\\n  },\\n```\\n\\n* 取ってきたjsonの中のhtmlセグメント中の `iframe` の大きさの取り扱いにも一苦労。\\njupyter notebookを貼り付けたgistだけは`height: auto`が効かない（コンテンツの高さがデフォルトの150pxに固定されてしまう）。しょうがないので、設定ファイル中でipynbかどうかを指定するフラグを用意して、そのフラグが立っていたら、`height: 2000px;`にしてしまうクラスを使うようにしました。（青い枠線が表示される場合があるのはデバッグ中の設定の名残りです。）\\n\\n```js\\n// pages/_year/_slug/ghc/index.vue > template\\n\\n      <div :id=\\"$route.params.slug\\" class=\\"githubgist-content\\" :class=\\"{ \'githubgist-frame\': article.frame }\\">\\n        <span v-html=\\"article.content\\"></span>\\n      </div>\\n\\n```\\n\\n* 後は`axios.get` ではデータそのものではなくレスポンスが返ってくるので\\n\\n```js\\nconst json = axios.get(url).then((res) => { return res.data })\\n```\\n\\nでなければいけない問題。これもちょっとはまりました。\\n\\n一個一個の問題は大したことないのだけど、切り分けができない多数の問題が降ってきたので、あああ、疲れた。\\n\\nさて、なんでgithubの返す埋め込み用javascriptをそのまま使うのをやめたんだっけ？ 最初に何も考えずにObservableのコードを流用したら動かなかったのは確かなんだけど。。。","bodyHtml":"<p>このブログの静的サイトジェネレータ（名前はまだない。とりあえず\'JaNG\', <em>Just-A-Note Generator</em> にしておきます）をバージョン1.0.2に更新しました。変更点はgithub.comに作ったgistが取り込めるようになったこと。</p>\\n<p><a href=\\"https://observablehq.com/\\">Observable</a>が（結構）簡単に取り込めたので、1時間程度でできるかと思ったら数日がかりになってしまいました。ChangeLog代わりに苦労した点を残しておきます。</p>\\n<ul>\\n<li>githubが埋め込み用に提供するのはjavascriptまたはjson形式。ちょっとjavascriptは置いといてjsonを使う方向で計画。</li>\\n<li>ところがjsonを読み込もうとすると <code>Cross-Access-Allow-Origin</code> の制約に引っかかってデータがとって来れない。手動でリロードを掛けて、サーバー側のレンダリングされたページを持ってくれば表示はできるようにしてみたけど、それはどう考えてもかっこ悪い。</li>\\n<li>サーバに最初にデータを揃えて静的サイトの生成を始めるというのがどう考えても自然なので、asyncDataなのかfetchなのか、どこに書けばベストなのか、他（下）の問題も解決しながら、調べて実験して、結局 <code>nuxtServerInit</code>　をストアに追加しました。（追加するのも一苦労。actionsの中に書くのね。）この関数は最終的にcommitでstoreのデータを更新すればよいと。</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">// store/index.js</span>\\n<span class=\\"hljs-keyword\\">export</span> <span class=\\"hljs-keyword\\">const</span> actions = {\\n  <span class=\\"hljs-keyword\\">async</span> <span class=\\"hljs-function\\"><span class=\\"hljs-title\\">nuxtServerInit</span>(<span class=\\"hljs-params\\">{ commit }</span>)</span> {\\n    ...\\n    commit(<span class=\\"hljs-string\\">&#x27;mutations&#x27;</span>, ...)\\n  },</code></pre><ul>\\n<li><code>forEach</code> で呼び出す関数が <code>async</code> にできないことを理解するのに一苦労（まあ、<code>nuxtServerInit</code>の先頭に<code>async</code>を置きながら、forEachの無名関数にもおかなくていいのか <strong>うっすらと</strong> 疑問は感じてた）。\\nfor文に書き直して、レンダリングが始まる前に全てのエントリーのデータを持って来れるようになったのでデータ取得問題がやっと解決。</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">// store/index.js</span>\\n<span class=\\"hljs-keyword\\">export</span> <span class=\\"hljs-keyword\\">const</span> actions = {\\n  <span class=\\"hljs-keyword\\">async</span> <span class=\\"hljs-function\\"><span class=\\"hljs-title\\">nuxtServerInit</span>(<span class=\\"hljs-params\\">{ commit }</span>)</span> {\\n    <span class=\\"hljs-keyword\\">const</span> arr = <span class=\\"hljs-built_in\\">Object</span>.entries(gist)\\n    <span class=\\"hljs-keyword\\">for</span>(<span class=\\"hljs-keyword\\">let</span> val <span class=\\"hljs-keyword\\">of</span> arr) {\\n      <span class=\\"hljs-keyword\\">const</span> art = val[<span class=\\"hljs-number\\">1</span>]\\n      <span class=\\"hljs-keyword\\">if</span> (art.gistid !== <span class=\\"hljs-literal\\">undefined</span>) {\\n        art.url = <span class=\\"hljs-string\\">`https://gist.github.com/<span class=\\"hljs-subst\\">${art.owner}</span>/<span class=\\"hljs-subst\\">${art.gistid}</span>`</span>\\n        <span class=\\"hljs-keyword\\">const</span> j = <span class=\\"hljs-keyword\\">await</span> axios.get(<span class=\\"hljs-string\\">`<span class=\\"hljs-subst\\">${art.url}</span>.json`</span>)\\n        <span class=\\"hljs-keyword\\">if</span> (j.data === <span class=\\"hljs-literal\\">undefined</span>)\\n          art.content = <span class=\\"hljs-string\\">`could not load <span class=\\"hljs-subst\\">${art.url}</span>.json`</span>\\n        <span class=\\"hljs-keyword\\">else</span> {\\n          art.content = j.data.div\\n          art.description = j.data.description\\n          art.created_at = j.data.created_at.substring(<span class=\\"hljs-number\\">0</span>, <span class=\\"hljs-number\\">10</span>)\\n        }\\n      }\\n    }\\n    commit(<span class=\\"hljs-string\\">&#x27;mutations&#x27;</span>, arr)\\n  },</code></pre><ul>\\n<li>取ってきたjsonの中のhtmlセグメント中の <code>iframe</code> の大きさの取り扱いにも一苦労。\\njupyter notebookを貼り付けたgistだけは<code>height: auto</code>が効かない（コンテンツの高さがデフォルトの150pxに固定されてしまう）。しょうがないので、設定ファイル中でipynbかどうかを指定するフラグを用意して、そのフラグが立っていたら、<code>height: 2000px;</code>にしてしまうクラスを使うようにしました。（青い枠線が表示される場合があるのはデバッグ中の設定の名残りです。）</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">// pages/_year/_slug/ghc/index.vue &gt; template</span>\\n\\n      &lt;div :id=<span class=\\"hljs-string\\">&quot;$route.params.slug&quot;</span> <span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">class</span></span>=<span class=\\"hljs-string\\">&quot;githubgist-content&quot;</span> :<span class=\\"hljs-class\\"><span class=\\"hljs-keyword\\">class</span></span>=<span class=\\"hljs-string\\">&quot;{ &#x27;githubgist-frame&#x27;: article.frame }&quot;</span>&gt;\\n        <span class=\\"xml\\"><span class=\\"hljs-tag\\">&lt;<span class=\\"hljs-name\\">span</span> <span class=\\"hljs-attr\\">v-html</span>=<span class=\\"hljs-string\\">&quot;article.content&quot;</span>&gt;</span><span class=\\"hljs-tag\\">&lt;/<span class=\\"hljs-name\\">span</span>&gt;</span></span>\\n      &lt;/div&gt;</code></pre><ul>\\n<li>後は<code>axios.get</code> ではデータそのものではなくレスポンスが返ってくるので</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-keyword\\">const</span> json = axios.get(url).then(<span class=\\"hljs-function\\">(<span class=\\"hljs-params\\">res</span>) =&gt;</span> { <span class=\\"hljs-keyword\\">return</span> res.data })</code></pre><p>でなければいけない問題。これもちょっとはまりました。</p>\\n<p>一個一個の問題は大したことないのだけど、切り分けができない多数の問題が降ってきたので、あああ、疲れた。</p>\\n<p>さて、なんでgithubの返す埋め込み用javascriptをそのまま使うのをやめたんだっけ？ 最初に何も考えずにObservableのコードを流用したら動かなかったのは確かなんだけど。。。</p>\\n","dir":"article/.json/2020","base":"2020-08-14-justanote-102.json","ext":".json","sourceBase":"2020-08-14-justanote-102.md","sourceExt":".md"}')}}]);