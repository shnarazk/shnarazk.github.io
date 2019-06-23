<template>
  <footer class="content">
    <nav id="bottombar" class="navbar is-fixed-bottom">
      <div class="navbar-brand">
        <a
          role="button"
          class="navbar-burger burger"
          :class="{ 'is-active': navbarBottomMenuOpen }"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarEntryMenu"
          @click="navbarBottomMenuOpen = !navbarBottomMenuOpen"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div
        id="navbarEntryMenu"
        class="navbar-menu "
        :class="{ 'is-active': navbarBottomMenuOpen }"
      >
        <div class="navbar-start">
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
          <div class="navbar-item">
            Copyright 2017-2019 Shuji Narazaki.
          </div>
          <div class="navbar-item">{{ timestamp }}.</div>
        </div>
      </div>
    </nav>
  </footer>
</template>
<script>
export default {
  data() {
    return {
      navbarBottomMenuOpen: false
    }
  },
  props: {
    timestamp: {
      type: String,
      default: ''
    },
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
