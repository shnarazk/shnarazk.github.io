<template>
  <div>
    <Header :title="'All notes about #' + $route.params.tagname" />
    <section
      v-if="targets($route.params.tagname) !== undefined"
      class="section"
    >
      <h1 class="title has-text-info has-text-weight-semibold">
        <i class="fas fa-tag"></i>&thinsp;#{{
          targets($route.params.tagname)[0]
        }}
      </h1>
      <template v-for="(article, j) in targets($route.params.tagname)[1]">
        <ArticleBox :key="j" :article="article" />
      </template>
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Header from '~/components/TheHeader'
import ArticleBox from '~/components/ArticleBox'
export default {
  components: {
    Header,
    ArticleBox,
  },
  computed: {
    ...mapState(['articles', 'blogTags']),
  },
  methods: {
    targets(tag) {
      return this.blogTags.find((e) => e[0] === tag)
    },
  },
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
</style>
