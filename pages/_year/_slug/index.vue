<template>
  <div>
    <EntryHeader :title="article.title" />
    <div style="width: 96%; margin-left: 2%;">
      <div class="container">
        <h1
          class="subtitle has-text-info has-text-weight-semibold has-text-right"
        >
          {{ article.subtitle }}
        </h1>
        <div class="entry-content" v-html="$md.render(article.bodyContent)" />
      </div>
      <hr />
      <div>Written on {{ article.date }}.</div>
      <EntryFooter :tags="article.tags" />
    </div>
  </div>
</template>
<script>
import EntryHeader from '~/components/EntryHeader'
import EntryFooter from '~/components/EntryFooter'
import { mapState } from 'vuex'

export default {
  components: {
    EntryHeader,
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
