<template>
  <div>
    <Header title="Just a note about this site and me" />
    <section class="section" style="width: 96%; margin-left: 2%;">
      <h2 class="section-title">About</h2>
      This site collects my notes on
      <nuxt-link to="/tag/">]various topics</nuxt-link>, in particular about:

      <ul style="padding-left: 20px;">
        <li>
          <a href="https://gitlab.com/satisfiability01/">Propositional logic</a>
          <nuxt-link to="/tag/sat">(#sat)</nuxt-link>
        </li>
        <li>NixOS <nuxt-link to="/tag/nixos/">(#nixos)</nuxt-link></li>
        <li>GNU Emacs <nuxt-link to="/tag/emacs/">(#emacs)</nuxt-link></li>
        <li>LaTeX <nuxt-link to="/tag/latex/">(#latex)</nuxt-link></li>
        <li>Linux <nuxt-link to="/tag/archlinux">(#archlinx))</nuxt-link></li>
        <li>Rust <nuxt-link to="/tag/rust">(#rust)</nuxt-link></li>
      </ul>
      <p>
        I won't publish my opinions here. I'll use
        <a href="https://medium.com/@shnarazk/">Medium</a> for them.
      </p>
    </section>
    <div>
      Copyright 2017-2019 Shuji Narazaki.
    </div>
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
