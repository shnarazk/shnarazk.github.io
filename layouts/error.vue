<template>
  <div class="layout-error">
    <Header title="404 note" />
    <section class="section error">
      <h1 class="subtitle has-text-info has-text-weight-semibold">
        <i class="fas fa-exclamation-circle"></i>&thinsp;404
      </h1>
      <div class="has-text-error">
        アクセスされたページ{{ $route.params.slug }}は存在しないか、すでに削除されています。
      </div>
    </section>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Header from '~/components/TheHeader'
export default {
  components: {
    Header
  },
  computed: {
    ...mapState(['articles', 'sourceFiles'])
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
</style>
