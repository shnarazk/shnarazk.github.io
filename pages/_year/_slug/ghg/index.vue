<template>
  <div>
    <Header :title="article.title" />
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
      <div :id="$route.params.slug" class="githubgist-content">
        <div v-if="$fetchState.pending">
          Fetching gist from github.com...<br />
          If you want, just <a v-bind:href="article.url">reload</a> imediately.
        </div>
        <div v-else-if="$fetchState.error">
          Failed to fetch gist: {{ $fetchState.error.message }}.<br />
          Try again by <a v-bind:href="article.url">reloading.</a>
        </div>
        <span v-else v-html="gistFetched"></span>
      </div>
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
  async fetch() {
    this.gistFetched = await this.$axios
      .$get(this.article.source)
      .then((res) => {
        return res.div
      })
  },
  //  async fetch() {
  //    this.$axios
  //      .$get(this.article.source)
  //      .then((res) => {
  //        this.article.content = res.div
  //      })
  //      .catch((e) => {
  //        this.article.content = `<a href="${this.article.url}">Please reload this page manually.</a>; ${e}: ${this.article.source}`
  //      })
  //  },
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
