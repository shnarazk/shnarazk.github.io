<template>
  <div class="blog-entry">
    <div class="aside has-text-grey">
      <i class="fas fa-file-alt"></i>&thinsp;{{ article.date.substring(0, 10) }}
    </div>
    <nuxt-link
      class="subtitle entry-title"
      :to="article | endPoint"
      no-prefetch
      >{{ article.title }}</nuxt-link
    >
    <span
      class="entry-subtitle is-pulled-right has-text-grey-dark"
      if-show="article.subtitle"
      >{{ article.subtitle }}</span
    >
  </div>
</template>
<script>
export default {
  props: {
    article: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
.blog-entry {
  padding-bottom: 0.9rem;
}
.entry-title {
  text-shadow: 0px 1px 1px #aaf;
}
</style>
