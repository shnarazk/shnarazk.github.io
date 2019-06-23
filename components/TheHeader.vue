<template>
  <nav class="navbar is-fixed-top site-header" role="navigation">
    <div class="navbar-brand">
      <nuxt-link class="navbar-item " to="/">Just a Note</nuxt-link>
    </div>
    <div class="navbar-menu">
      <div class="navbar-end">
        <nuxt-link class="navbar-item" to="/about">about</nuxt-link>
        <a class="navbar-item" href="/feed.xml">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 28 28"
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
export default {}
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
