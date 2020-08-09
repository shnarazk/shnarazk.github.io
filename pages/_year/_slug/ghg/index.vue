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
        <span v-html=article.body></span>
      </div>
      <EntryFooter :tags="article.tags" />
    </section>
  </div>
</template>
<script>
import Header from '~/components/TheHeader'
import EntryFooter from '~/components/EntryFooter'
import axios from "axios"

export default {
  components: {
    Header,
    EntryFooter
  },
  asyncData({ store, params }) {
    const arr = Object.entries(store.state.articles)
    const articles = arr.find(a => a[1].gistid === params.slug)
    let art = articles[1]
    let url = 'https://gist.github.com/' + art.owner + '/' + art.gistid
    return axios
      .get(url + '.json')
      .then(res => {
        art["body"] = res.data.div
        art["url"] = url
        art["css"] = res.data.stylesheet
        return { article: art }
      })
      .catch(e => {
        error({ statusCode: 404, message: 'Post not found' })
      })
  },
  async validate({ params, query, store }) {
    const arr = Object.entries(store.state.articles)
    return arr.find(a => a[1].gistid === params.slug) != undefined
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
@import '~/assets/scss/githubgist.scss';
</style>
