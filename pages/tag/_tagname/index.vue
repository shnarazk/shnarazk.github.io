<template>
  <section>
    <div class="title">{{ targets($route.params.tagname)[0] }}</div>
    <template v-for="(article, j) in targets($route.params.tagname)[1]">
      <div :key="j">
        <div class="aside">
          {{ article.date.substring(0, 10) }}
        </div>
        <nuxt-link class="entry-title" :to="entryname(article)" no-prefetch>{{
          article.title
        }}</nuxt-link>
        <span class="entry-subtitle" if-show="article.subtitle">{{
          article.subtitle
        }}</span>
      </div>
    </template>
  </section>
</template>
<script>
import path from 'path'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['articles', 'blogTags'])
  },
  methods: {
    targets: function(tag) {
      return this.blogTags.find(e => e[0] === tag)
    },
    entryname: function(art) {
      return (
        '/blog/' +
        path.basename(art.dir) +
        '/' +
        path.basename(art.sourceBase, '.md') +
        '/'
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
</style>
