(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{455:function(t,e,n){var content=n(458);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("da2fc3d8",content,!0,{sourceMap:!1})},457:function(t,e,n){"use strict";var o=n(455);n.n(o).a},458:function(t,e,n){(e=n(38)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,'body[data-v-53384e4a]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}#bottombar[data-v-53384e4a]{background-color:#eee}.tagword[data-v-53384e4a]{font-family:"Roboto Mono",monospace}',""]),t.exports=e},459:function(t,e,n){"use strict";var o={props:{tags:{type:Array,default:function(){return[]}}},data:function(){return{openBottomMenu:!1}}},r=(n(457),n(18)),component=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("footer",{staticClass:"content"},[n("nav",{staticClass:"navbar is-fixed-bottom",attrs:{id:"bottombar","aria-label":"navigation"}},[n("div",{staticClass:"navbar-brand"},t._l(t.tags,(function(e){return n("div",{key:e,staticClass:"navbar-item"},[n("nuxt-link",{staticClass:"tagword",attrs:{to:"/tag/"+e.toLowerCase()}},[t._v("#"+t._s(e.toLowerCase()))])],1)})),0)])])}),[],!1,null,"53384e4a",null);e.a=component.exports},470:function(t,e,n){var content=n(488);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("5364de04",content,!0,{sourceMap:!1})},487:function(t,e,n){"use strict";var o=n(470);n.n(o).a},488:function(t,e,n){(e=n(38)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,"@import url(https://cdn.jsdelivr.net/npm/@observablehq/inspector@3/dist/inspector.css);"]),e.push([t.i,'body[data-v-90277d62]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}.githubgist-content[data-v-90277d62]{font-family:"Noto Sans JP",sans-serif,"Livvic","Times New Roman";font-size:1rem;width:92%;margin-left:3%}.githubgist-content[data-v-90277d62] .render-viewer{display:block;width:98%;height:auto;background-color:#adf}.githubgist-content[data-v-90277d62] .Box-body{width:98%}.githubgist-content[data-v-90277d62] h1{font-size:1.8rem;font-weight:bolder;margin-top:2.4rem}.githubgist-content[data-v-90277d62] h2{font-size:1.7rem;font-weight:700;margin-top:2rem}.githubgist-content[data-v-90277d62] h3{font-size:1.6rem;font-weight:700;margin-top:1.6rem}.githubgist-content[data-v-90277d62] h4{font-size:1.5rem;font-weight:700;margin-top:1.2rem}.githubgist-content[data-v-90277d62] h5{font-size:1.4rem;font-weight:700;margin-top:1rem}.githubgist-content[data-v-90277d62] h6{font-size:1.3rem;margin-top:.8rem}.githubgist-content[data-v-90277d62] p{margin-top:1rem}.githubgist-content[data-v-90277d62] ul{margin:.8rem;list-style-position:outside;list-style-type:disc}.githubgist-content[data-v-90277d62] ol{margin:.8rem;list-style-position:outside;list-style-type:decimal}.githubgist-content[data-v-90277d62] li{margin:.5rem}.githubgist-content[data-v-90277d62] pre{margin-top:.5rem;margin-left:.2rem;padding:.1rem}.githubgist-content[data-v-90277d62] pre>code{font-family:"Roboto Mono",monospace;font-stretch:condensed}.githubgist-content[data-v-90277d62] img{max-width:95%}.githubgist-content[data-v-90277d62] table{border:1px solid #55c;border-collapse:collapse;margin:.8rem;max-width:95%}.githubgist-content[data-v-90277d62] table>thead{background-color:#bbf;border:1px solid #55c}.githubgist-content[data-v-90277d62] table>tbody>tr{background-color:#eee}.githubgist-content[data-v-90277d62] td,.githubgist-content[data-v-90277d62] th{margin:2px;padding:4px}',""]),t.exports=e},581:function(t,e,n){"use strict";n.r(e);n(138),n(19),n(10),n(139);var o=n(94),r=n(459),d=n(51),c=n.n(d),l={components:{Header:o.a,EntryFooter:r.a},asyncData:function(t){var e=t.store,n=t.params,o=Object.entries(e.state.articles).find((function(a){return a[1].gistid===n.slug}))[1],r="https://gist.github.com/"+o.owner+"/"+o.gistid;return c.a.get(r+".json").then((function(t){return o.body=t.data.div,o.url=r,o.css=t.data.stylesheet,{article:o}}))},validate:function(t){var e=t.params;t.query;return null!=t.store.state.articles[e.slug]}},m=(n(487),n(18)),component=Object(m.a)(l,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Header",{attrs:{title:t.article.title}}),t._v(" "),n("section",{staticClass:"section"},[n("h1",{staticClass:"title has-text-primary has-text-weight-semibold"},[t._v("\n      "+t._s(t.article.title)+"\n    ")]),t._v(" "),t.article.subtitle?n("h1",{staticClass:"subtitle has-text-info has-text-weight-semibold"},[t._v("\n      "+t._s(t.article.subtitle)+"\n    ")]):t._e(),t._v(" "),n("div",{staticClass:"githubgist-content",attrs:{id:t.$route.params.slug}},[n("span",{staticStyle:{".octospinner .render-viewer-error, .render-viewer-fatal":"hidden"},domProps:{innerHTML:t._s(t.article.body)}})]),t._v(" "),n("div",[t._v("\n      "+t._s("https://gist.github.com/"+t.article.owner+"/"+t.$route.params.slug)+"\n    ")]),t._v(" "),n("EntryFooter",{attrs:{tags:t.article.tags}})],1)],1)}),[],!1,null,"90277d62",null);e.default=component.exports}}]);