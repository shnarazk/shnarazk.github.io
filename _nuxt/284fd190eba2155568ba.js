(window.webpackJsonp=window.webpackJsonp||[]).push([[6],{453:function(t,e,n){var content=n(456);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("da2fc3d8",content,!0,{sourceMap:!1})},455:function(t,e,n){"use strict";var o=n(453);n.n(o).a},456:function(t,e,n){(e=n(38)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,"body[data-v-53384e4a]{width:96%;margin-left:1%;font-family:Merriweather,sans-serif,Lora,Times New Roman;font-size:18px}#bottombar[data-v-53384e4a]{background-color:#eee}.tagword[data-v-53384e4a]{font-family:Roboto Mono,monospace}",""]),t.exports=e},459:function(t,e,n){"use strict";var o={props:{tags:{type:Array,default:function(){return[]}}},data:function(){return{openBottomMenu:!1}}},r=(n(455),n(17)),component=Object(r.a)(o,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("footer",{staticClass:"content"},[n("nav",{staticClass:"navbar is-fixed-bottom",attrs:{id:"bottombar","aria-label":"navigation"}},[n("div",{staticClass:"navbar-brand"},t._l(t.tags,(function(e){return n("div",{key:e,staticClass:"navbar-item"},[n("nuxt-link",{staticClass:"tagword",attrs:{to:"/tag/"+e.toLowerCase()}},[t._v("#"+t._s(e.toLowerCase()))])],1)})),0)])])}),[],!1,null,"53384e4a",null);e.a=component.exports},462:function(t,e,n){var content=n(471);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(39).default)("76c0b124",content,!0,{sourceMap:!1})},470:function(t,e,n){"use strict";var o=n(462);n.n(o).a},471:function(t,e,n){(e=n(38)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),e.push([t.i,"body[data-v-0244cb06]{width:96%;margin-left:1%;font-family:Merriweather,sans-serif,Lora,Times New Roman;font-size:18px}.entry-content[data-v-0244cb06]{font-family:Noto Sans JP,sans-serif,Livvic,Times New Roman;font-size:1rem;width:92%;margin-left:3%}.entry-content[data-v-0244cb06] .article-banner{width:100%;max-height:60vh}.entry-content[data-v-0244cb06] h1{font-size:1.8rem;font-weight:bolder;margin-top:2.4rem}.entry-content[data-v-0244cb06] h2{font-size:1.7rem;font-weight:700;margin-top:2rem}.entry-content[data-v-0244cb06] h3{font-size:1.6rem;font-weight:700;margin-top:1.6rem}.entry-content[data-v-0244cb06] h4{font-size:1.5rem;font-weight:700;margin-top:1.2rem}.entry-content[data-v-0244cb06] h5{font-size:1.4rem;font-weight:700;margin-top:1rem}.entry-content[data-v-0244cb06] h6{font-size:1.3rem;margin-top:.8rem}.entry-content[data-v-0244cb06] p{margin-top:1rem}.entry-content[data-v-0244cb06] ul{margin:.8rem;list-style-position:outside;list-style-type:disc}.entry-content[data-v-0244cb06] ol{margin:.8rem;list-style-position:outside;list-style-type:decimal}.entry-content[data-v-0244cb06] li{margin:.5rem}.entry-content[data-v-0244cb06] img{max-width:95%}.entry-content[data-v-0244cb06] pre{margin-top:.5rem;margin-left:.2rem;padding:.1rem}.entry-content[data-v-0244cb06] pre>code{font-family:Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,NotoSansCJKjp,Roboto Mono,monospace;font-stretch:condensed}.entry-content[data-v-0244cb06] blockquote{margin:.4rem 0 .5rem;border:1px solid #e0e0e0;border-left-width:16px;padding:0 .6rem .4rem;background-color:#f4f4f4}.entry-content[data-v-0244cb06] table{border:1px solid #55c;border-collapse:collapse;margin:.8rem;max-width:95%}.entry-content[data-v-0244cb06] table>thead{background-color:#bbf;border:1px solid #55c}.entry-content[data-v-0244cb06] table>tbody>tr{background-color:#eee}.entry-content[data-v-0244cb06] td,.entry-content[data-v-0244cb06] th{margin:2px;padding:4px 20px}",""]),t.exports=e},552:function(t,e,n){"use strict";n.r(e);var o=n(91),r=n(459),c={components:{Header:o.a,EntryFooter:r.a}},d=(n(470),n(17)),component=Object(d.a)(c,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("Header",{attrs:{title:"Embedded Observable"}}),this._v(" "),e("section",{staticClass:"section"},[e("div",{attrs:{id:"Observed"}}),this._v(" "),e("EntryFooter",{attrs:{tags:"['Observable']"}})],1),this._v(" "),e("script",{attrs:{type:"module"}},[this._v("\n    import {\n      Runtime,\n      Inspector\n    } from 'https://cdn.jsdelivr.net/npm/@observablehq/runtime@4/dist/runtime.js'\n    import notebook from 'https://api.observablehq.com/d/1cbb7a450b192e69.js?v=3'\n    new Runtime().module(notebook, Inspector.into('#Observed'))\n  ")])],1)}),[],!1,null,"0244cb06",null);e.default=component.exports}}]);