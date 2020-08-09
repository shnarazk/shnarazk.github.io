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
        <span v-html="article.body"></span>
      </div>
      <EntryFooter :tags="article.tags" />
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import axios from 'axios'
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
  asyncData({ store, params }) {
    const arr = Object.entries(store.state.articles)
    const articles = arr.find((a) => a[1].gistid === params.slug)
    const art = articles[1]
    const url = 'https://gist.github.com/' + art.owner + '/' + art.gistid
    axios.defaults.withCredentials = true
    if (process.server) {
      return axios.get(url + '.json').then((res) => {
        art.body = res.data.div
        art.url = url
        art.css = res.data.stylesheet
        return { article: art }
      })
    } else {
      art.body =
        '<a href="/' +
        params.year +
        '/' +
        params.slug +
        '/ghg/">Please reload this page manually.</a>'
      return { article: art }
    }
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
