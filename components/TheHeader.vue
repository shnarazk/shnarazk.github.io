<template>
  <nav
    class="navbar is-fixed-top is-light"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <div class="navbar-item">
        <nuxt-link to="/" class="title">{{ title }}</nuxt-link>
      </div>
      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': navbarMenuOpen }"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarBasicExample"
        @click="navbarMenuOpen = !navbarMenuOpen"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div
      id="navbarBasicExample"
      class="navbar-menu"
      :class="{ 'is-active': navbarMenuOpen }"
    >
      <div class="navbar-start">
        <nuxt-link class="navbar-item" to="/tag/"
          ><i class="fas fa-tags"></i>&thinsp;Tags</nuxt-link
        >
        <nuxt-link class="navbar-item" to="/about"
          ><i class="fas fa-question-circle"></i>&thinsp;About</nuxt-link
        >
        <a class="navbar-item" href="/feed.xml">
          <i class="fas fa-rss-square"></i>
          &thinsp;RSS
        </a>
      </div>
    </div>
  </nav>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      default: () => 'Just a Note'
    }
  },
  data() {
    return {
      navbarMenuOpen: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
</style>
