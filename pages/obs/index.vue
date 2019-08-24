<template>
  <div>
    <Header title="Embedded Observable" />
    <section class="section">
      <div id="Observed"></div>
      <EntryFooter tags="['Observable']" />
    </section>
    <script type="module">
      import {
        Runtime,
        Inspector
      } from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js'
      import notebook from 'https://api.observablehq.com/d/1cbb7a450b192e69.js?v=3'
      new Runtime().module(notebook, Inspector.into('#Observed'))
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
