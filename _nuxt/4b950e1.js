(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{472:function(t,e,r){var content=r(475);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(47).default)("da2fc3d8",content,!0,{sourceMap:!1})},474:function(t,e,r){"use strict";r(472)},475:function(t,e,r){(e=r(46)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,'body[data-v-53384e4a]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}#bottombar[data-v-53384e4a]{background-color:#eee}.tagword[data-v-53384e4a]{font-family:"Roboto Mono",monospace}',""]),t.exports=e},476:function(t,e,r){"use strict";var n={props:{tags:{type:Array,default:function(){return[]}}},data:function(){return{openBottomMenu:!1}}},o=(r(474),r(23)),component=Object(o.a)(n,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("footer",{staticClass:"content"},[r("nav",{staticClass:"navbar is-fixed-bottom",attrs:{id:"bottombar","aria-label":"navigation"}},[r("div",{staticClass:"navbar-brand"},t._l(t.tags,(function(e){return r("div",{key:e,staticClass:"navbar-item"},[r("nuxt-link",{staticClass:"tagword",attrs:{to:"/tag/"+e.toLowerCase()}},[t._v("#"+t._s(e.toLowerCase()))])],1)})),0)])])}),[],!1,null,"53384e4a",null);e.a=component.exports},486:function(t,e,r){var content=r(502);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(47).default)("06b6bea9",content,!0,{sourceMap:!1})},501:function(t,e,r){"use strict";r(486)},502:function(t,e,r){(e=r(46)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,'body[data-v-480e2850]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}.githubgist-content[data-v-480e2850]{display:block;font-family:"Noto Sans JP",sans-serif,"Livvic","Times New Roman";font-size:1rem;width:92%;margin-left:3%}.githubgist-content[data-v-480e2850] .octospinner,.githubgist-content[data-v-480e2850] .render-viewer-error,.githubgist-content[data-v-480e2850] .render-viewer-fatal,.githubgist-content[data-v-480e2850] .render-viewer-invalid{height:0;visibility:hidden}.githubgist-content[data-v-480e2850] .Box-body{width:98%}.githubgist-content[data-v-480e2850] h1{font-size:1.8rem;font-weight:bolder;margin-top:2.4rem}.githubgist-content[data-v-480e2850] h2{font-size:1.7rem;font-weight:700;margin-top:2rem}.githubgist-content[data-v-480e2850] h3{font-size:1.6rem;font-weight:700;margin-top:1.6rem}.githubgist-content[data-v-480e2850] h4{font-size:1.5rem;font-weight:700;margin-top:1.2rem}.githubgist-content[data-v-480e2850] h5{font-size:1.4rem;font-weight:700;margin-top:1rem}.githubgist-content[data-v-480e2850] h6{font-size:1.3rem;margin-top:.8rem}.githubgist-content[data-v-480e2850] p{margin-top:1rem}.githubgist-content[data-v-480e2850] ul{margin:.8rem;list-style-position:outside;list-style-type:disc}.githubgist-content[data-v-480e2850] ol{margin:.8rem;list-style-position:outside;list-style-type:decimal}.githubgist-content[data-v-480e2850] li{margin:.5rem}.githubgist-content[data-v-480e2850] pre{margin-top:.5rem;margin-left:.2rem;padding:.1rem}.githubgist-content[data-v-480e2850] pre>code{font-family:"Roboto Mono",monospace;font-stretch:condensed}.githubgist-content[data-v-480e2850] img{max-width:95%}.githubgist-content[data-v-480e2850] table{border:1px solid #55c;border-collapse:collapse;margin:.8rem;max-width:95%}.githubgist-content[data-v-480e2850] table>thead{background-color:#bbf;border:1px solid #55c}.githubgist-content[data-v-480e2850] table>tbody>tr{background-color:#eee}.githubgist-content[data-v-480e2850] td,.githubgist-content[data-v-480e2850] th{margin:2px;padding:4px}.githubgist-frame[data-v-480e2850]{border:1px solid #36f;height:1500px}.githubgist-frame[data-v-480e2850] .render-viewer{display:block;width:98%;min-height:1480px;height:98%;overflow:visible;background-color:#adf;margin-left:2px}',""]),t.exports=e},611:function(t,e,r){"use strict";r.r(e);r(42),r(16),r(31),r(24);var n=r(3),o=(r(99),r(15),r(8),r(98),r(12)),c=r(32),l=r(97),d=r(476);function f(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var m={components:{Header:l.a,EntryFooter:d.a},computed:function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({},Object(c.b)(["articles"])),data:function(){return{gistFetched:{}}},asyncData:function(t){var e=t.store,r=t.params,article=(t.$axios,Object.entries(e.state.articles).find((function(a){return a[1].gistid===r.slug}))[1]);return article.source="https://gist.github.com/".concat(article.owner,"/").concat(article.gistid,".json"),article.url="/".concat(r.year,"/").concat(r.slug,"/ghg/"),{article:article}},validate:function(t){return Object(n.a)(regeneratorRuntime.mark((function e(){var r,n,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=t.params,t.query,n=t.store,o=Object.entries(n.state.articles),e.abrupt("return",void 0!==o.find((function(a){return a[1].gistid===r.slug})));case 3:case"end":return e.stop()}}),e)})))()}},h=(r(501),r(23)),component=Object(h.a)(m,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("Header",{attrs:{title:t.article.title}}),t._v(" "),t.article.banner?r("div",{staticClass:"article-banner"},[r("img",{attrs:{src:t.article.banner}})]):t._e(),t._v(" "),r("section",{staticClass:"section"},[t.article.subtitle?r("h1",{staticClass:"subtitle has-text-info has-text-weight-semibold"},[t._v("\n      "+t._s(t.article.subtitle)+" "),r("i",{staticClass:"fab fa-github"})]):t._e(),t._v(" "),r("div",{staticClass:"githubgist-content",class:{"githubgist-frame":t.article.frame},attrs:{id:t.$route.params.slug}},[r("span",{domProps:{innerHTML:t._s(t.article.content)}})]),t._v(" "),r("section",{staticClass:"section"},[r("div",{staticClass:"is-size-7 is-family-code has-text-grey has-text-right"},[t._v("\n        Last update: "+t._s(t.article.date.substring(0,10))+".\n      ")])]),t._v(" "),r("EntryFooter",{attrs:{tags:t.article.tags}})],1)],1)}),[],!1,null,"480e2850",null);e.default=component.exports}}]);