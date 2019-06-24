<template>
  <div>
    <Header :title="article.title" />
    <section class="section">
      <h1 class="title has-text-info has-text-weight-semibold">
        {{ article.title }}
      </h1>
      <h1
        v-if="article.subtitle"
        class="subtitle has-text-info has-text-weight-semibold"
      >
        {{ article.subtitle }}
      </h1>
      <div class="entry-content" v-html="$md.render(article.bodyContent)" />
      <hr />
      <div>Written on {{ article.date }}.</div>
      <EntryFooter :tags="article.tags" />
    </section>
  </div>
</template>
<script>
import Header from '~/components/TheHeader'
import EntryFooter from '~/components/EntryFooter'
import { mapState } from 'vuex'

export default {
  components: {
    Header,
    EntryFooter
  },
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
</style>
