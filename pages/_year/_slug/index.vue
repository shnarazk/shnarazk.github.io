<template>
  <div>
    <Header :title="article.title" />
    <img v-if="article.banner" v-bind:src="article.banner" class="article-banner">
    <section class="section">
      <h1 class="title has-text-primary has-text-weight-semibold">
        {{ article.title }}
      </h1>
      <h1
        v-if="article.subtitle"
        class="subtitle has-text-info has-text-weight-semibold"
      >
        {{ article.subtitle }}
      </h1>
      <div class="entry-content" v-html="$md.render(article.bodyContent)" />
      <section class="section">
        <div class="is-size-7 is-family-code has-text-grey has-text-right">
          Last update: {{ article.date.substring(0, 10) }}.
        </div>
      </section>
      <EntryFooter :tags="article.tags" />
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Header from '~/components/TheHeader'
import EntryFooter from '~/components/EntryFooter'
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
