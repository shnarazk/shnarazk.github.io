<template>
  <div>
    <div class="container">
      <h1 class="title is-large">{{ article.title }}</h1>
      <div class="subtitle">
        {{ article.subtitle }}
      </div>
      <div class="entry-content" v-html="$md.render(article.bodyContent)" />
    </div>
    <EntryFooter
      :tags="article.tags"
      :timestamp="article.date.substring(0, 10)"
    />
  </div>
</template>
<script>
import EntryFooter from '~/components/EntryFooter'
import { mapState } from 'vuex'

export default {
  components: {
    EntryFooter
  },
  layout: 'entry',
  computed: {
    ...mapState(['articles'])
  },
  async asyncData({ store, params }) {
    const json = await import(
      `~/article/.json/${params.year}/${params.slug}.json`
    )
    return { article: json }
  },
  validate({ params, query, store }) {
    return store.state.sourceFiles.find(a => a.includes(params.slug))
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
@import '~/assets/scss/blog.scss';
.entry-title {
  font-size: 24pt;
}
.entry-tag {
  font-family: 'Courier New', Courier, monospace;
}
</style>
