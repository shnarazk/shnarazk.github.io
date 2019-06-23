<template>
  <section>
    <div v-for="(tag, i) in blogTags" :key="i">
      <div class="title">{{ tag[0] }}</div>
      <template v-for="(article, j) in tag[1]">
        <div :key="j">
          <div class="aside">
            {{ article.date.substring(0, 10) }}
          </div>
          <nuxt-link class="entry-title" :to="article | endPoint" no-prefetch>{{
            article.title
          }}</nuxt-link>
          <span class="entry-subtitle" if-show="article.subtitle">{{
            article.subtitle
          }}</span>
        </div>
      </template>
    </div>
  </section>
</template>
<script>
import path from 'path'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['articles', 'blogTags'])
  }
}
</script>
