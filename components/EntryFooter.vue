<template>
  <footer class="content">
    <nav class="navbar is-fixed-bottom" id="bottombar">
      <div class="navbar-brand">
        <div class="navbar-item">
          Copyright 2017-2019 Shuji Narazaki.
        </div>
        <div class="navbar-item">{{ timestamp }}.</div>
      </div>
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
      <div class="navbar-end">
        <div class="navbar-item">
          <nuxt-link to="/">HOME</nuxt-link>
        </div>
      </div>
    </nav>
  </footer>
</template>
<script>
export default {
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
