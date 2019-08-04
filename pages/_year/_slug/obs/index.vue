<template>
  <div>
    <Header :title="article.title" />
    <section class="section">
      <h1 class="title has-text-primary has-text-weight-semibold">
        <a :href="'https://observablehq.com/d/' + $route.params.slug">
          Observable notebook: #_{{ $route.params.slug }}
        </a>
      </h1>
      <h1
        v-if="article.subtitle"
        class="subtitle has-text-info has-text-weight-semibold"
      >
        {{ article.subtitle }}
      </h1>
      <div :id="'_' + $route.params.slug" class="observable-content"></div>
      <EntryFooter :tags="article.tags" />
    </section>
    <script type="module">
      import {
        Runtime,
        Inspector
      } from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js'
      import notebook from 'https://api.observablehq.com/d/{{$route.params.slug}}.js?v=3'
      new Runtime().module(notebook, Inspector.into('{{'#_' + $route.params.slug}}'))
    </script>
  </div>
</template>
<script>
import Header from '~/components/TheHeader'
import EntryFooter from '~/components/EntryFooter'
export default {
  components: {
    Header,
    EntryFooter
  },
  asyncData({ store, params }) {
    const arr = Object.entries(store.state.articles)
    const art = arr.find(a => a[1].notebook === params.slug)
    return { article: art[1] }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
@import '~/assets/scss/observable.scss';
</style>
