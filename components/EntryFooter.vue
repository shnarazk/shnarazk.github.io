<template>
  <footer class="content">
    <nav id="bottombar" class="navbar is-fixed-bottom">
      <div class="navbar-brand">
        <nuxt-link class="navbar-item" to="/tag/">TAGS</nuxt-link>
        <div v-if="tags.length" class="navbar-item">
          <template v-for="tag in tags">
            <span :key="tag">
              #<nuxt-link :to="'/tag/' + tag.toLowerCase()">{{
                tag.toLowerCase()
              }}</nuxt-link
              >,
            </span>
          </template>
        </div>
      </div>
    </nav>
  </footer>
</template>
<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
#bottombar {
  background-color: $color-bg;
}
</style>
