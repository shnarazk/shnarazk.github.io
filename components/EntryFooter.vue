<template>
  <footer class="content">
    <nav id="bottombar" class="navbar is-fixed-bottom" aria-label="navigation">
      <div class="navbar-brand">
        <div v-for="tag in tags" :key="tag" class="navbar-item">
          <nuxt-link :to="'/tag/' + tag.toLowerCase()" class="tagword"
            >#{{ tag.toLowerCase() }}</nuxt-link
          >
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
  },
  data() {
    return {
      openBottomMenu: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
#bottombar {
  background-color: $color-bg;
}
.tagword {
  font-family: 'Roboto Mono', monospace;
}
</style>
