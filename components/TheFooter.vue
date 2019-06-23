<template>
  <footer class="content">
    Copyright 2019 Shuji Narazaki. {{ timestamp }}
  </footer>
</template>
<script>
export default {
  props: {
    timestamp: {
      type: String,
      default: '2019'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
</style>
