---
title: About Observable
subtitle: 
date: 2019-08-01
tags: ['javascript', 'observable']
---

Javascript版jupyterのようなものの一つの[Observable](https://observablehq.com/)。
Nuxtベースのこのブログに組み込めないか現在考え中。
とりあえず[こういうこと](https://observablehq.com/d/1cbb7a450b192e69)ができるなら、
やる価値はありそうだ。

以下のコードでObservableのノートは一つのJavascriptにexportできるらしい。

```js
<script type="module">
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/d/1cbb7a450b192e69.js?v=3";
new Runtime().module(notebook, Inspector.into(document.body));
</script>
```

なので、それをfetchするような専用のテンプレートを用意すれば埋め込めるはず。

- pages/_year/_slug/index.vue
- pages/_year/_slug/observable/index.vue

みたいにすればいいのでは。でその中身は、

```js
<script>
await fetch()
<script>
```

はて？ templateの中に書けるのかしらん？
さっきのコードをちゃんと読んで、だんだんわかってきた。
jquery的なDOM mountが前提だ。vueの仮想DOMとは相性悪そう。。。

<script type="module">
import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js";
import notebook from "https://api.observablehq.com/d/1cbb7a450b192e69.js?v=3";
new Runtime().module(notebook, Inspector.into(document.body));
</script>

とりあえずでっち上げたもの： 

- https://shnarazk.now.sh/obs/
- https://shnarazk.now.sh/obs/index.html

routerを設定しないといけない？？
