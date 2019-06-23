<template>
  <div>
    <div class="container">
      <template v-for="(art, i) in slicedEntries">
        <div :key="i" class="blog-entry">
          <div class="aside">
            {{ art[1].date.substring(0, 10) }}
          </div>
          <nuxt-link
            class="subtitle entry-title"
            :to="entryname(art[1])"
            no-prefetch
            >{{ art[1].title }}</nuxt-link
          >
          <span class="entry-subtitle" if-show="art.subtitle">{{
            art[1].subtitle
          }}</span>
        </div>
      </template>
    </div>
    <footer>
      <nav id="bottombar" class="navbar is-fixed-bottom is-lighter">
        <div class="navbar-brand">
          <div class="navbar-item">
            <nav
              class="pagination is-centered is-fixed-bottom"
              role="navigation"
              aria-label="pagination"
              style="padding-top: 8px;"
            >
              <template v-if="page == 1">
                <a class="pagination-previous" disabled>Previous</a>
              </template>
              <template v-else>
                <a class="pagination-previous" @click="setPage(page - 1)"
                  >Previous</a
                >
              </template>
              <template v-if="page == last">
                <a class="pagination-next" disabled>Next page</a>
              </template>
              <template v-else>
                <a class="pagination-next" @click="setPage(page + 1)"
                  >Next page</a
                >
              </template>
              <ul class="pagination-list">
                <li>
                  <a class="pagination-link" @click="setPage(1)">
                    1
                  </a>
                </li>
                <li><span class="pagination-ellipsis">&hellip;</span></li>
                <template v-if="2 < page">
                  <li>
                    <a class="pagination-link" @click="setPage(page - 2)">
                      {{ page - 2 }}
                    </a>
                  </li>
                </template>
                <template v-if="1 < page">
                  <li>
                    <a class="pagination-link" @click="setPage(page - 1)">
                      {{ page - 1 }}
                    </a>
                  </li>
                </template>
                <li>
                  <a
                    class="pagination-link is-current"
                    aria-current="page"
                    aria-lable="the current page"
                  >
                    {{ page }}
                  </a>
                </li>
                <template v-if="page < last">
                  <li>
                    <a class="pagination-link" @click="setPage(page + 1)">
                      {{ page + 1 }}
                    </a>
                  </li>
                </template>
                <template v-if="page + 1 < last">
                  <li>
                    <a class="pagination-link" @click="setPage(page + 2)">
                      {{ page + 2 }}
                    </a>
                  </li>
                </template>
                <li><span class="pagination-ellipsis">&hellip;</span></li>
                <li>
                  <a
                    class="pagination-link"
                    aria-label="Goto the page"
                    @click="setPage(last)"
                    >{{ last }}</a
                  >
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </nav>
    </footer>
  </div>
</template>

<script>
import path from 'path'
import { mapState } from 'vuex'
export default {
  data() {
    return {
      entries: Object.entries(this.$store.state.articles)
        .sort()
        .reverse(),
      page: 1,
      len: 10,
      last: Math.floor(Object.keys(this.$store.state.articles).length / 10)
    }
  },
  computed: {
    slicedEntries: function() {
      return this.entries.slice(
        (this.page - 1) * this.len,
        this.page * this.len
      )
    },
    ...mapState(['articles', 'blogTags'])
  },
  methods: {
    setPage: function(p) {
      this.page = Math.floor(Math.min(this.last, Math.max(1, p)))
    },
    entryname: function(art) {
      return (
        '/blog/' +
        path.basename(art.dir) +
        '/' +
        path.basename(art.sourceBase, '.md') +
        '/'
      )
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
#bottombar {
  background-color: $color-bg;
}
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
