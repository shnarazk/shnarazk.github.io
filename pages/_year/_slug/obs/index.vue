<template>
  <div>
    <Header title="Embedded Observable Notebook" />
    <section class="section">
      <h1 class="title has-text-primary has-text-weight-semibold">
        Id #_{{ $route.params.slug }}
      </h1>
      <div :id="'_' + $route.params.slug" class="observablenotebook"></div>
      <EntryFooter :tags="['Observable']" />
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
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
@import '~/assets/scss/blog.scss';
</style>
