<template>
  <div>
    <Header :title="'All notes about #' + $route.params.tagname" />
    <section style="width: 96%; margin-left: 2%;">
      <div class="title">#{{ targets($route.params.tagname)[0] }}</div>
      <template v-for="(article, j) in targets($route.params.tagname)[1]">
        <ArticleBox :key="j" :article="article" />
      </template>
    </section>
  </div>
</template>
<script>
import Header from '~/components/TheHeader'
import ArticleBox from '~/components/ArticleBox'
import { mapState } from 'vuex'
export default {
  components: {
    Header,
    ArticleBox
  },
  computed: {
    ...mapState(['articles', 'blogTags'])
  },
  methods: {
    targets: function(tag) {
      return this.blogTags.find(e => e[0] === tag)
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
</style>
