<template>
  <div>
    <Header title="All tags" />
    <section class="section">
      <div v-for="(tag, i) in blogTags" :key="i">
        <h1 class="title has-text-info has-text-weight-semibold">
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
  }
}
</script>
