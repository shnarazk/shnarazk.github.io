<template>
  <div class="layout-error">
    <section class="error">
      <h2>404</h2>
      <ArticleBody>
        <div>
          アクセスされたページは存在しないか、すでに削除されています。
        </div>
        <div>slug: {{ $route.params.slug }}</div>
        <div>store: {{ sourceFiles }}</div>
        <ul>
          <li v-for="(f, i) in sourceFiles" :key="i">
            -- {{ f }}; {{ f.includes($route.params.slug) }}
          </li>
        </ul>
        <div>
          {{ sourceFiles.find(a => a.contains($route.params.slug)) }}
        </div>
        <div>
          articles.find(a => a.contains($route.params.slug))
        </div>
      </ArticleBody>
    </section>
  </div>
</template>
<script>
import ArticleBody from '~/components/ArticleBody'
import { mapState } from 'vuex'
export default {
  components: {
    ArticleBody
  },
  computed: {
    ...mapState(['articles', 'sourceFiles'])
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
</style>
