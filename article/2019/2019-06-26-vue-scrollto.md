---
title: bind an expression to vue-scrollto
subtitle: vue-scrolltoのモンダイ
date: 2019-06-26
tags: ['nuxtjs', 'vuejs']
---

[vue.js](https://vuejs.org) + [nuxt](https://nuxtjs.org/)で作った
このblogのtagページでタグ一覧からそのセクションへの
ページ内ジャンプを実現するために
[vue-schrollto](https://www.npmjs.com/package/vue-scrollto)
を入れてみた。

もともとのタグ一覧コードはこんな感じ：

```javascript
<div v-for="tag in tags" :key="tag">
#{{ tag }},
</div>
```

これを `v-scroll-to` でジャンプできるように変えてみた：

```javascript
<template v-for="tag in tags">
  <nuxt-link :key="tag" :v-scroll-to="'\#' + tag + '\''" to>
    #{{ tag }}
  </nuxt-link>
  ,
</template>
```

よさそうなんだけどは動かないことが判明。
どうも`v-scroll-to` は真にリテラルしか受け付けないようだ。
bindもできない。ということで、正解はこうだった。

```javascript
<template v-for="tag in tags">
  <nuxt-link :key="tag" v-scroll-to="`#${tag}`" to>
    #{{ tag }}
  </nuxt-link>
  ,
</template>
```

これでスルスル動くようになった。
