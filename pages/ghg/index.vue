<template>
  <div>
    <Header title="Embedded GitHubGist" />
    <section class="section">
      <div id="Gist"></div>
      <EntryFooter tags="['GitHubGist']" />
    </section>
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
