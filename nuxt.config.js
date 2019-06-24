export default {
  generate: {
    fallback: true
  },
  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    title: 'Just a note',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.10.0/katex.min.css'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap'
      }
    ],
    htmlAttrs: {
      lang: 'ja',
      class: 'has-navbar-fixed-top has-navbar-fixed-bottom'
    }
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: [
    // '~/assets/scss/style.scss',
    { src: '~/node_modules/highlight.js/styles/github.css', lang: 'css' }
  ],
  styleResources: {
    sass: [
      // 'bulma/bulma.sass'
      // '~/assets/scss/style.scss' // 読みませたいscssファイルを指定します。
    ]
  },
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [{ src: '~/plugins/filters.js' }],
  /*
   ** Nuxt.js modules
   */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/markdownit',
    '@nuxtjs/pwa',
    '@nuxtjs/eslint-module',
    '@nuxtjs/bulma',
    '@nuxtjs/style-resources',
    '~/modules/feed'
  ],
  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {},
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, { isDev }) {
      if (isDev && process.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  markdownit: {
    injected: true, // $mdを利用してmarkdownをhtmlにレンダリングする
    breaks: true, // 改行コードを<br>に変換する
    html: true, // HTML タグを有効にする
    linkify: true, // URLに似たテキストをリンクに自動変換する
    typography: true, // 言語に依存しないきれいな 置換 + 引用符 を有効にします。
    use: [
      //      'markdown-it-toc' // 目次を作るためのライブラリ。別途インストールが必要
      'markdown-it-highlightjs',
      '@iktakahiro/markdown-it-katex'
    ]
  },
  feed: [
    // A default feed configuration object
    {
      path: '/feed.xml', // The route to your feed.
      cacheTime: 1000 * 60 * 15, // How long should the feed be cached
      type: 'rss2', // Can be: rss2, atom1, json1
      data: ['Some additional data'] // Will be passed as 2nd argument to `create` function
    }
  ]
}
