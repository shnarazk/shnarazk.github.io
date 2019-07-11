<template>
  <div>
    <Header title="Just a note about this site and me" />
    <section class="section">
      <h1 class="title has-text-primary has-text-weight-semibold">
        About
      </h1>
      This site collects my notes on
      <nuxt-link to="/tag/">various topics</nuxt-link>, in particular about:
      <ul>
        <li>
          <a href="https://gitlab.com/satisfiability01/">Propositional logic</a>
          <nuxt-link to="/tag/sat/">(#sat)</nuxt-link>
        </li>
        <li>NixOS <nuxt-link to="/tag/nixos/">(#nixos)</nuxt-link></li>
        <li>GNU Emacs <nuxt-link to="/tag/emacs/">(#emacs)</nuxt-link></li>
        <li>LaTeX <nuxt-link to="/tag/latex/">(#latex)</nuxt-link></li>
        <li>Linux <nuxt-link to="/tag/archlinux/">(#archlinx))</nuxt-link></li>
        <li>Rust <nuxt-link to="/tag/rust/">(#rust)</nuxt-link></li>
      </ul>
      <p>
        I won't publish my opinions here. I'll use
        <a href="https://medium.com/@shnarazk/">Medium</a> for them. And this
        site is powered by nuxt.js.
      </p>
      <h1 class="title has-text-primary has-text-weight-semibold">
        Profile
      </h1>
      <ul class="desc is-italic">
        <li>A programmer using Nuxt.js, Vue.js, NixOS, Rust, MongoDB, GCP.</li>
        <li>
          A researcher on the satisfiability problem (SAT solvers), studying
          logic, category theory.
        </li>
        <li>A user of Emacs, Haskell, Latex, Linux, R, macOS, Mendeley.</li>
        <li>A bicycle rider (bicycle deliverer).</li>
      </ul>
      <ul>
        <li>
          <i class="fab fa-github"></i
          ><a href="https://github.com/shnarazk">@github</a>
        </li>
        <li>
          <i class="fab fa-gitlab"></i
          ><a href="https://gitlab.com/shujinarazaki/">@gitlab</a>
        </li>
        <li>
          <i class="fab fa-medium"></i
          ><a href="https://medium.com/@shnarazk/">@Medium</a>
        </li>
        <li><a href="https://pdp11.herokuapp.com">Online PDP11 demo</a></li>
        <li>
          <a href="https://check-qiita.shujinarazaki.now.sh/"
            >Online Qiita checker</a
          >
        </li>
        <li><a href="https://github.com/shnarazk/splr">Splr</a></li>
        <li><a href="https://github.com/shnarazk/mios">Mios</a></li>
      </ul>
      <h1 class="subtitle has-text-info has-text-weight-semibold">
        Copyright
      </h1>
      Copyright 2017-2019 Shuji Narazaki.
    </section>
  </div>
</template>
<script>
import Header from '~/components/TheHeader'
export default {
  components: {
    Header
  }
}
</script>
<style lang="scss" scoped>
@import '~/assets/scss/style.scss';
h1 {
  margin-top: 1.4rem;
}
ul {
  list-style-position: inside;
  list-style-type: disc;
  margin: 8pt;
}
.desc {
  list-style-type: none;
}
</style>
