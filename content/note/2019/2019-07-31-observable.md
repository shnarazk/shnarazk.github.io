---
title: About Observable
subtitle: 強力な可視化機能を手に入れた
date: 2019-08-04
tags: ['javascript', 'Observable', 'Nuxtjs', 'jang']
---

Javascript版jupyterのようなものの一つの[Observable](https://observablehq.com/)。
可視化の結果を貼り付けられるように、Nuxtベースのこのブログに組み込めないか現在考え中。
とりあえず[こういうこと](https://observablehq.com/d/1cbb7a450b192e69)ができるなら、
やる価値はありそうだ。

まず、以下のコードでObservableのノートは一つのJavascriptにexportできるらしい。

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

## 2019-08-01T21:05 上手くいったversion 0.1

まずインデックスページにJSONおよびエントリをでっち上げて
nuxt-linkで振ってみる。このようなObservable由来のページは

- pages/_year/_slug/obs/index.vue

に処理させることにした。index.vueの中身は以下の通り。
template中のscriptはObservableのマニュアルにあったものをそのまま流用。

```js
<template>
  <div>
    <Header title="Embedded Observable" />
    <section class="section">
      <div id="Observed"></div>
      <EntryFooter tags="['Observable']" />
    </section>
    <script type="module">
      import {
        Runtime,
        Inspector
      } from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js'
      import notebook from 'https://api.observablehq.com/d/1cbb7a450b192e69.js?v=3'
      new Runtime().module(notebook, Inspector.into('#Observed'))
    </script>
  </div>
</template>
<script>
import Header from '~/components/TheHeader'
import EntryFooter from '~/components/EntryFooter'
export default {
  components: {
    Header,
    EntryFooter
  }
}
</script>
```

仮想DOMとの協調は不安定だが中身は`#Obesarbable`な要素に取り込まれ、
他のエントリと同じ体裁で表示できるようになった。
DOMの上書き問題は適切なidを作成してやればいいだろう。
あとはvuexにうまく取り込めばいい。

## 2019-08-03T21:05 上手くいったversion 0.9

先日の方法を延長するだけでうまくいきそうだ。

- mdから作ったjsonファイルにObservable用の手書きJSONを混ぜてvuexに登録
- Observableのnotebookに対するend pointは先に書いた通り
  - pages/_year/_slug/obs/index.vue
  に対応させる。
- canvasの埋め込み先はObservableでのnotebook idを`_sulg`としたユニークな`dvi`要素にすることで、
  仮想DOMによる干渉を極力避ける。
- `\deep\`対応したCSSを用意してあげる。
  ただしcanvasのサイズがピクセルで固定なのはどう対応したものか見当つかない。

まあ、これくらいで最低限のことはできるようになった。

```js
<template>
  <div>
    <Header title="Embedded Observable Notebook" />
    <section class="section">
      <h1 class="title has-text-primary has-text-weight-semibold">
        <a :href="'https://observablehq.com/d/' + $route.params.slug">
          Id #_{{ $route.params.slug }}
        </a>
      </h1>
      <div :id="'_' + $route.params.slug" class="observable-content"></div>
      <EntryFooter :tags="['Observable']" />
    </section>
    <script type="module">
      import {
        Runtime,
        Inspector
      } from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js'
      import notebook from 'https://api.observablehq.com/d/{{$route.params.slug}}.js?v=3'
      new Runtime().module(notebook, Inspector.into('{{'#_' + $route.params.slug}}'))
    </script>
  </div>
</template>
<script>
import Header from '~/components/TheHeader'
import EntryFooter from '~/components/EntryFooter'
export default {
  components: {
    Header,
    EntryFooter
  }
}
</script>
```
