<template>
  <div>
    <Header :title="article.title" />
    <div class="article-banner" v-if="article.banner">
        <img v-bind:src="article.banner">
        <div class="article-banner-caption" v-if="article.banner_caption">
          <i>{{ article.banner_caption }}</i>
        </div>
    </div>
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
    if (store.state.sourceFiles.find(a => a.includes(params.slug)) != undefined)
      return true
    const arr = Object.entries(store.state.articles)
    return arr.find(a => a[1].gistid === params.slug) != undefined
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
@import '~/assets/scss/blog.scss';
</style>
