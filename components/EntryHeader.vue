<template>
  <nav
    class="navbar is-fixed-top site-header"
    role="navigation"
    aria-label="main navigation"
  >
    <div class="navbar-brand">
      <a class="navbar-item ">
        <nuxt-link to="/">{{ title }}</nuxt-link>
      </a>
      <a
        role="button"
        class="navbar-burger burger"
        :class="{ 'is-active': navbarEntryMenuOpen }"
        aria-label="menu"
        aria-expanded="false"
        data-target="navbarEntryHeaderMenu"
        @click="navbarEntryMenuOpen = !navbarEntryMenuOpen"
      >
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
        <span aria-hidden="true"></span>
      </a>
    </div>
    <div
      id="navbarEntryHeaderMenu"
      class="navbar-menu"
      :class="{ 'is-active': navbarEntryMenuOpen }"
    >
      <div class="navbar-start">
        <nuxt-link class="navbar-item" to="/">Back to top</nuxt-link>
        <nuxt-link class="navbar-item" to="/about">About</nuxt-link>
        <a class="navbar-item" href="/feed.xml">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="26"
            height="26"
            viewBox="0 -0 28 28"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-rss"
          >
            <path d="M4 11a9 9 0 0 1 9 9"></path>
            <path d="M4 4a16 16 0 0 1 16 16"></path>
            <circle cx="5" cy="19" r="1"></circle>
          </svg>
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
      default: () => '???'
    }
  },
  data() {
    return {
      navbarEntryMenuOpen: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
.site-header {
  background-color: $color-bg;
  font-size: 1.3rem;
  font-weight: bold;
  font-family: sans-serif;
  color: #777;
}
.header-link {
  color: #777;
}
.about {
  float: right;
  padding-right: 10pt;
}
.rss {
  float: right;
}
</style>
