<template>
  <div class="blog-entry">
    <div class="aside">
      {{ article.date.substring(0, 10) }}
    </div>
    <nuxt-link
      class="subtitle entry-title"
      :to="article | endPoint"
      no-prefetch
      >{{ article.title }}</nuxt-link
    >
    <span class="entry-subtitle" if-show="article.subtitle">{{
      article.subtitle
    }}</span>
  </div>
</template>
<script>
export default {
  props: {
    article: {
      type: Object
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
.aside {
  font-size: 0.84rem;
  line-height: 1.4;
  color: #667;
}
.blog-entry {
  padding-bottom: 0.9rem;
}
.aside em {
  font-size: 0.7rem;
}
.a-entry-title {
  font-size: 1.95rem;
  color: black;
}
.entry-subtitle {
  font-size: 90%;
  color: #888;
  float: right;
}
</style>
