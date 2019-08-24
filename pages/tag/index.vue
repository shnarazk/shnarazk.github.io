<template>
  <div>
    <Header title="All tags" />
    <section class="section">
      <h1 id="start-test" class="title has-text-info">
        List of tags
      </h1>
      <template v-for="tag in blogTags">
        <nuxt-link :key="tag[0]" v-scroll-to="`#${tag[0]}`" to>
          #{{ tag[0] }}
        </nuxt-link>
        ,&ensp;
      </template>
      <br />
      <div v-for="(tag, i) in blogTags" :key="i">
        <h1 :id="tag[0]" class="title has-text-info has-text-weight-semibold">
          <i class="fas fa-tag"></i>&thinsp;#{{ tag[0] }}
        </h1>
        <template v-for="(article, j) in tag[1]">
          <ArticleBox :key="j" :article="article" />
        </template>
      </div>
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
    ArticleBox
  },
  computed: {
    ...mapState(['articles', 'blogTags'])
  }
}
</script>
<style lang="scss" scoped>
h1 {
  margin-top: 0.8rem;
}
</style>
