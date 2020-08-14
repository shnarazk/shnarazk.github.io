<template>
  <div>
    <Header :title="article.title" />
    <div class="article-banner" v-if="article.banner">
        <img v-bind:src="article.banner">
    </div>
    <section class="section">
      <h1 class="title has-text-primary has-text-weight-semibold" v-else>
        {{ article.description }}
      </h1>
      <h1
        v-if="article.subtitle"
        class="subtitle has-text-info has-text-weight-semibold"
      >
        {{ article.subtitle }}&nbsp;<i class="fab fa-github"></i>
      </h1>
      <div :id="$route.params.slug" class="githubgist-content" :class="{ 'githubgist-frame': article.frame }">
        <span v-html="article.content"></span>
      </div>
      <section class="section">
        <div class="is-size-7 is-family-code has-text-grey has-text-right">
          Last update: {{ article.date.substring(0, 10) }}.
        </div>
        <div class="is-size-7 is-family-code has-text-grey has-text-right" v-else>
          Created: {{ article.created }}.
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
    EntryFooter,
  },
  computed: {
    ...mapState(['articles']),
  },
  data() {
    return {
      gistFetched: {},
    }
  },
  asyncData({ store, params, $axios }) {
    const arr = Object.entries(store.state.articles)
    const articles = arr.find((a) => a[1].gistid === params.slug)
    const article = articles[1]
    article.source = `https://gist.github.com/${article.owner}/${article.gistid}.json`
    article.url = `/${params.year}/${params.slug}/ghg/`
    return { article }
  },
  async validate({ params, query, store }) {
    const arr = Object.entries(store.state.articles)
    return arr.find((a) => a[1].gistid === params.slug) !== undefined
  },
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
@import '~/assets/scss/githubgist.scss';
</style>
