(window.webpackJsonp=window.webpackJsonp||[]).push([[2],{455:function(t,e,n){var content=n(458);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("da2fc3d8",content,!0,{sourceMap:!1})},457:function(t,e,n){"use strict";var r=n(455);n.n(r).a},458:function(t,e,n){(e=n(38)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,'body[data-v-53384e4a]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}#bottombar[data-v-53384e4a]{background-color:#eee}.tagword[data-v-53384e4a]{font-family:"Roboto Mono",monospace}',""]),t.exports=e},459:function(t,e,n){"use strict";var r={props:{tags:{type:Array,default:function(){return[]}}},data:function(){return{openBottomMenu:!1}}},o=(n(457),n(18)),component=Object(o.a)(r,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("footer",{staticClass:"content"},[n("nav",{staticClass:"navbar is-fixed-bottom",attrs:{id:"bottombar","aria-label":"navigation"}},[n("div",{staticClass:"navbar-brand"},t._l(t.tags,(function(e){return n("div",{key:e,staticClass:"navbar-item"},[n("nuxt-link",{staticClass:"tagword",attrs:{to:"/tag/"+e.toLowerCase()}},[t._v("#"+t._s(e.toLowerCase()))])],1)})),0)])])}),[],!1,null,"53384e4a",null);e.a=component.exports},469:function(t,e,n){var content=n(485);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("2d72a5f4",content,!0,{sourceMap:!1})},484:function(t,e,n){"use strict";var r=n(469);n.n(r).a},485:function(t,e,n){(e=n(38)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,'body[data-v-96338060]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}.render-viewer[data-v-96338060]{display:block;width:98%;height:1000px;background-color:#adf}.githubgist-content[data-v-96338060]{font-family:"Noto Sans JP",sans-serif,"Livvic","Times New Roman";font-size:1rem;width:92%;min-height:80%;height:80%;margin-left:3%}.githubgist-content[data-v-96338060] .octospinner,.githubgist-content[data-v-96338060] .render-viewer-error,.githubgist-content[data-v-96338060] .render-viewer-fatal,.githubgist-content[data-v-96338060] .render-viewer-invalid{height:0;visibility:hidden}.githubgist-content[data-v-96338060] .render-viewer{display:block;width:98%;height:1000px;background-color:#adf}.githubgist-content[data-v-96338060] .Box-body{width:98%}.githubgist-content[data-v-96338060] h1{font-size:1.8rem;font-weight:bolder;margin-top:2.4rem}.githubgist-content[data-v-96338060] h2{font-size:1.7rem;font-weight:700;margin-top:2rem}.githubgist-content[data-v-96338060] h3{font-size:1.6rem;font-weight:700;margin-top:1.6rem}.githubgist-content[data-v-96338060] h4{font-size:1.5rem;font-weight:700;margin-top:1.2rem}.githubgist-content[data-v-96338060] h5{font-size:1.4rem;font-weight:700;margin-top:1rem}.githubgist-content[data-v-96338060] h6{font-size:1.3rem;margin-top:.8rem}.githubgist-content[data-v-96338060] p{margin-top:1rem}.githubgist-content[data-v-96338060] ul{margin:.8rem;list-style-position:outside;list-style-type:disc}.githubgist-content[data-v-96338060] ol{margin:.8rem;list-style-position:outside;list-style-type:decimal}.githubgist-content[data-v-96338060] li{margin:.5rem}.githubgist-content[data-v-96338060] pre{margin-top:.5rem;margin-left:.2rem;padding:.1rem}.githubgist-content[data-v-96338060] pre>code{font-family:"Roboto Mono",monospace;font-stretch:condensed}.githubgist-content[data-v-96338060] img{max-width:95%}.githubgist-content[data-v-96338060] table{border:1px solid #55c;border-collapse:collapse;margin:.8rem;max-width:95%}.githubgist-content[data-v-96338060] table>thead{background-color:#bbf;border:1px solid #55c}.githubgist-content[data-v-96338060] table>tbody>tr{background-color:#eee}.githubgist-content[data-v-96338060] td,.githubgist-content[data-v-96338060] th{margin:2px;padding:4px}',""]),t.exports=e},577:function(t,e,n){"use strict";n.r(e);n(40),n(20),n(29),n(30);var r=n(4),o=(n(138),n(19),n(10),n(139),n(15)),c=n(41),l=n(94),d=n(459),f=n(51),h=n.n(f);function m(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(object);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,n)}return e}var v={components:{Header:l.a,EntryFooter:d.a},computed:function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?m(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):m(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({},Object(c.b)(["articles"])),asyncData:function(t){var e=t.store,n=t.params,r=Object.entries(e.state.articles).find((function(a){return a[1].gistid===n.slug}))[1],o="https://gist.github.com/"+r.owner+"/"+r.gistid;return h.a.defaults.withCredentials=!0,h.a.get(o+".json").then((function(t){return r.body=t.data.div,r.url=o,r.css=t.data.stylesheet,{article:r}})).catch((function(t){error({statusCode:404,message:"Post not found"})}))},validate:function(t){return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.params,t.query,r=t.store,o=Object.entries(r.state.articles),e.abrupt("return",null!=o.find((function(a){return a[1].gistid===n.slug})));case 3:case"end":return e.stop()}}),e)})))()}},w=(n(484),n(18)),component=Object(w.a)(v,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Header",{attrs:{title:t.article.title}}),t._v(" "),n("section",{staticClass:"section"},[n("h1",{staticClass:"title has-text-primary has-text-weight-semibold"},[t._v("\n      "+t._s(t.article.title)+"\n    ")]),t._v(" "),t.article.subtitle?n("h1",{staticClass:"subtitle has-text-info has-text-weight-semibold"},[t._v("\n      "+t._s(t.article.subtitle)+"\n    ")]):t._e(),t._v(" "),n("div",{staticClass:"githubgist-content",attrs:{id:t.$route.params.slug}},[n("span",{domProps:{innerHTML:t._s(t.article.body)}})]),t._v(" "),n("EntryFooter",{attrs:{tags:t.article.tags}})],1)],1)}),[],!1,null,"96338060",null);e.default=component.exports}}]);