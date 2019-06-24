<template>
  <div>
    <Header title="All tags" />
    <section style="width: 96%; margin-left: 2%;">
      <div v-for="(tag, i) in blogTags" :key="i">
        <div class="title">{{ tag[0] }}</div>
        <template v-for="(article, j) in tag[1]">
          <ArticleBox :article="article" :key="j" />
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
