<template>
  <div>
    <Header title="Just a Note" />
    <section class="section">
      <h1 class="title has-text-info has-text-weight-semibold">
        <i class="fas fa-book-open"></i>&thinsp;Table of Contents
      </h1>
      <template v-for="(art, i) in slicedEntries">
        <ArticleBox :key="i" :article="art[1]" />
      </template>
    </section>
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
                <a class="pagination-next" disabled>Next</a>
              </template>
              <template v-else>
                <a class="pagination-next" @click="setPage(page + 1)"
                  >Next</a
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
import { mapState } from 'vuex'
import Header from '~/components/TheHeader'
import ArticleBox from '~/components/ArticleBox'
export default {
  components: {
    Header,
    ArticleBox
  },
  data() {
    const ents = Object.entries(this.$store.state.articles)
    ents.sort((a, b) => (a[1].date < b[1].date ? 1 : -1))
    return {
      entries: ents,
      page: 1,
      len: 12,
      last: Math.ceil(Object.keys(this.$store.state.articles).length / 12)
    }
  },
  computed: {
    slicedEntries() {
      return this.entries.slice(
        (this.page - 1) * this.len,
        this.page * this.len
      )
    },
    ...mapState(['articles', 'blogTags'])
  },
  methods: {
    setPage(p) {
      this.page = Math.floor(Math.min(this.last, Math.max(1, p)))
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
