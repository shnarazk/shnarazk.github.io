import path from 'path';
const generateDynamicRoutes = callback => {
  const { sourceFileArray } = require('./article/.json/db.json');
  const md_urls = sourceFileArray.map(e => {
    const year = e.substring(8, 12);
    const target = path.basename(e, '.md');
    return '/' + year + '/' + target + '/';
  });
  const gist_entries = require('./article/githubgist.json');
  const gist_urls = Object.keys(gist_entries).map(k => {
    const e = gist_entries[k];
    return '/' + e.year + '/' + e.gistid + '/ghg/';
  });
  const ob_entries = require('./article/obs.json');
  const ob_urls = Object.keys(ob_entries).map(k => {
    const e = ob_entries[k];
    return '/' + e.year + '/' + e.notebook + '/obs/';
  });
  callback(null, [...md_urls, ...gist_urls, ...ob_urls]);
};

export default {
  generate: {
    fallback: true,
    routes: generateDynamicRoutes
  },
  target: 'static',
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
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.8.2/css/all.min.css'
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
  plugins: [
    { src: '~/plugins/filters.js' },
    { src: '~/plugins/vue-scrollto.js' }
  ],
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
    // 'vue-scrollto/nuxt',
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
    breaks: false, // 改行コードを<br>に変換する
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
