(window.webpackJsonp=window.webpackJsonp||[]).push([[3],{455:function(t,n,e){var content=e(458);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(40).default)("da2fc3d8",content,!0,{sourceMap:!1})},457:function(t,n,e){"use strict";var o=e(455);e.n(o).a},458:function(t,n,e){(n=e(39)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),n.push([t.i,'body[data-v-53384e4a]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}#bottombar[data-v-53384e4a]{background-color:#eee}.tagword[data-v-53384e4a]{font-family:"Roboto Mono",monospace}',""]),t.exports=n},459:function(t,n,e){"use strict";var o={props:{tags:{type:Array,default:function(){return[]}}},data:function(){return{openBottomMenu:!1}}},r=(e(457),e(18)),component=Object(r.a)(o,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("footer",{staticClass:"content"},[e("nav",{staticClass:"navbar is-fixed-bottom",attrs:{id:"bottombar","aria-label":"navigation"}},[e("div",{staticClass:"navbar-brand"},t._l(t.tags,(function(n){return e("div",{key:n,staticClass:"navbar-item"},[e("nuxt-link",{staticClass:"tagword",attrs:{to:"/tag/"+n.toLowerCase()}},[t._v("#"+t._s(n.toLowerCase()))])],1)})),0)])])}),[],!1,null,"53384e4a",null);n.a=component.exports},468:function(t,n,e){var content=e(483);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,e(40).default)("1256c885",content,!0,{sourceMap:!1})},481:function(t,n,e){var map={"./2016/2016-03-08-code-sample.json":[488,11],"./2017/2017-03-05-math-sample.json":[489,12],"./2017/2017-10-20-emacs-tex-print.json":[490,13],"./2018/2018-02-03-Evil-keybindings.json":[491,14],"./2018/2018-02-04-upgrade-postgresql.json":[492,15],"./2018/2018-05-20-ghc-options.json":[493,16],"./2018/2018-05-31-flymake-Haskell.json":[494,17],"./2018/2018-06-20-KDE-in-R.json":[495,18],"./2018/2018-06-21-Reading-CSV-in-R.json":[496,19],"./2018/2018-06-21-glucose-on-nixos.json":[497,20],"./2018/2018-06-21-lingeling-on-nixos.json":[498,21],"./2018/2018-06-22-lualatex-on-archlinux.json":[499,22],"./2018/2018-06-24-haskell-on-heroku.json":[500,23],"./2018/2018-06-30-luajitlatex.json":[501,24],"./2018/2018-07-06-broken-intero.json":[502,25],"./2018/2018-07-10-unlock-files-on-nextcloud.json":[503,26],"./2018/2018-07-15-edit-personal-info-on-nextcloud.json":[504,27],"./2018/2018-07-18-compiling-haskell-on-nixos-on-darwin.json":[505,28],"./2018/2018-08-10-rustup.json":[506,29],"./2018/2018-09-27-nixos-on-majave.json":[507,30],"./2018/2018-11-16-gdm-autosuspend.json":[508,31],"./2018/2018-11-30-build-emacs-mozc-with-yay.json":[509,32],"./2019/2019-01-06-texlive-install.json":[510,33],"./2019/2019-02-16-sat-solvers-on-crates_io.json":[511,34],"./2019/2019-02-20-hashmap-to-vec.json":[512,35],"./2019/2019-02-27-memo-on-nix.json":[513,36],"./2019/2019-03-04-benchmarking-glucose.json":[514,37],"./2019/2019-03-06-nixos-administration.json":[515,38],"./2019/2019-03-07-post-to-discord.json":[516,39],"./2019/2019-03-10-source-highlight-Rust.json":[517,40],"./2019/2019-03-14-gtk-development-on-nix.json":[518,41],"./2019/2019-03-17-now.json":[519,42],"./2019/2019-03-22-rust-program-with-resources-on-nixos.json":[520,43],"./2019/2019-03-28-rust-programs-using-openssl.json":[521,44],"./2019/2019-05-31-connect-mongodb-atlas-from-rust.json":[522,45],"./2019/2019-06-26-vue-scrollto.json":[523,46],"./2019/2019-07-11-varact-distribution.json":[524,47],"./2019/2019-07-15-splr.json":[525,48],"./2019/2019-07-21-first-UIP-distribution.json":[526,49],"./2019/2019-07-31-observable.json":[527,50],"./2019/2019-07-31-restart.json":[528,51],"./2019/2019-08-08-rust-lifetime.json":[529,52],"./2019/2019-09-14-splr014.json":[530,53],"./2019/2019-09-20-splr015.json":[531,54],"./2019/2019-10-08-nix-on-catalina.json":[532,55],"./2019/2019-12-17-blog.json":[533,56],"./2019/2019-12-17-end-of-rust-on-now.json":[534,57],"./2020/2020-01-15-SplrDL.json":[535,58],"./2020/2020-01-21-new-solver-technologies.json":[536,59],"./2020/2020-01-26-CNF-visualization.json":[537,60],"./2020/2020-02-02-add-to-list.json":[538,61],"./2020/2020-02-04-function-name-as-closure.json":[539,62],"./2020/2020-02-11-UNSATlog.json":[540,63],"./2020/2020-03-01-rust-error.json":[541,64],"./2020/2020-03-07-rustc-on-nixos.json":[542,65],"./2020/2020-03-08-rename-in-dired-mode.json":[543,66],"./2020/2020-03-16-Profile-Guided-Optimization-on-Rust.json":[544,67],"./2020/2020-03-19-structopt.json":[545,68],"./2020/2020-03-21-UNSATlog.json":[546,69],"./2020/2020-03-27-commit-hook.json":[547,70],"./2020/2020-04-05-nix-liveness.json":[548,71],"./2020/2020-04-08-modern-techniques-of-SAT-solver.json":[549,72],"./2020/2020-04-11-emacs27-on-nix.json":[550,73],"./2020/2020-04-22-UNSATlog.json":[551,74],"./2020/2020-05-09-Emacs-keybind-s-l.json":[552,75],"./2020/2020-05-19-two-heuristics.json":[553,76],"./2020/2020-05-20-LR-needs-something.json":[554,77],"./2020/2020-05-26-MiracleSudoku.json":[555,78],"./2020/2020-05-29-UNSATlog.json":[556,79],"./2020/2020-06-07-cargo-instruments.json":[557,80],"./2020/2020-06-13-clap3.json":[558,81],"./2020/2020-06-19-40M-steps.json":[559,82],"./2020/2020-06-20-vivification.json":[560,83],"./2020/2020-06-22-duplicate-learnt-clause.json":[561,84],"./2020/2020-07-05-UNSATlog.json":[562,85],"./2020/2020-07-05-vivification2.json":[563,86],"./2020/2020-07-18-summer-homework.json":[564,87],"./2020/2020-07-21-what-is-kissat.json":[565,88],"./2020/2020-07-25-lifetime-of-trait-object-type.json":[566,89],"./2020/2020-07-28-fallthrough-in-swift.json":[567,90],"./2020/2020-07-28-whats-new-in-cryptmitsat580.json":[568,91],"./2020/2020-07-31-UNSATlog.json":[569,92],"./2020/2020-08-07-NixOS-on-BigSur.json":[570,93],"./2020/2020-08-14-justanote-102.json":[571,94],"./2020/2020-08-15-Cow.json":[572,95],"./db.json":[66]};function o(t){if(!e.o(map,t))return Promise.resolve().then((function(){var n=new Error("Cannot find module '"+t+"'");throw n.code="MODULE_NOT_FOUND",n}));var n=map[t],o=n[0];return Promise.all(n.slice(1).map(e.e)).then((function(){return e.t(o,3)}))}o.keys=function(){return Object.keys(map)},o.id=481,t.exports=o},482:function(t,n,e){"use strict";var o=e(468);e.n(o).a},483:function(t,n,e){(n=e(39)(!1)).push([t.i,"@import url(https://fonts.googleapis.com/css?family=Merriweather);"]),n.push([t.i,'body[data-v-2acfc650]{width:96%;margin-left:1%;font-family:"Merriweather",sans-serif,"Lora","Times New Roman";font-size:18px}.article-banner[data-v-2acfc650]{display:block;min-width:100%;width:100%;max-height:60vh;overflow:hidden}.entry-content[data-v-2acfc650]{font-family:"Noto Sans JP",sans-serif,"Livvic","Times New Roman";font-size:1rem;width:92%;margin-left:3%}.entry-content[data-v-2acfc650] h1{font-size:1.8rem;font-weight:bolder;margin-top:2.4rem}.entry-content[data-v-2acfc650] h2{font-size:1.7rem;font-weight:700;margin-top:2rem}.entry-content[data-v-2acfc650] h3{font-size:1.6rem;font-weight:700;margin-top:1.6rem}.entry-content[data-v-2acfc650] h4{font-size:1.5rem;font-weight:700;margin-top:1.2rem}.entry-content[data-v-2acfc650] h5{font-size:1.4rem;font-weight:700;margin-top:1rem}.entry-content[data-v-2acfc650] h6{font-size:1.3rem;margin-top:.8rem}.entry-content[data-v-2acfc650] p{margin-top:1rem}.entry-content[data-v-2acfc650] ul{margin:.8rem;list-style-position:outside;list-style-type:disc}.entry-content[data-v-2acfc650] ol{margin:.8rem;list-style-position:outside;list-style-type:decimal}.entry-content[data-v-2acfc650] li{margin:.5rem}.entry-content[data-v-2acfc650] img{max-width:95%}.entry-content[data-v-2acfc650] code{font-family:Consolas,Menlo,Monaco,Lucida Console,Liberation Mono,DejaVu Sans Mono,Bitstream Vera Sans Mono,Courier New,NotoSansCJKjp,"Roboto Mono",monospace;font-stretch:condensed;color:#124;background-color:#fefdf9;white-space:pre}.entry-content[data-v-2acfc650] pre{margin-top:.5rem;margin-left:.2rem;padding:.1rem .1rem 0;border:1px solid #e0e0e0;position:relative;overflow-y:hidden;overflow-x:scroll}.entry-content[data-v-2acfc650] pre>code{padding-left:36px;margin-bottom:-4px}.entry-content[data-v-2acfc650] blockquote{margin:.4rem 0 .5rem;border:1px solid #e0e0e0;border-left-width:16px;padding:0 .6rem .4rem;background-color:#f4f4f4}.entry-content[data-v-2acfc650] table{border:1px solid #55c;border-collapse:collapse;margin:.8rem;max-width:95%}.entry-content[data-v-2acfc650] table>thead{background-color:#bbf;border:1px solid #55c}.entry-content[data-v-2acfc650] table>tbody>tr{background-color:#eee}.entry-content[data-v-2acfc650] td,.entry-content[data-v-2acfc650] th{margin:2px;padding:4px 20px}.entry-content[data-v-2acfc650] pre>code :before{position:absolute;top:0;left:0;width:32px;padding-right:4px;padding-top:.54rem;display:block;text-align:right;font-stretch:condensed;font-style:italic;color:#aaa;background-color:#e0e0e0;content:"1\\A 2\\A 3\\A 4\\A 5\\A 6\\A 7\\A 8\\A 9\\A 10\\A 11\\A 12\\A 13\\A 14\\A 15\\A 16\\A 17\\A 18\\A 19\\A 20\\A 21\\A 22\\A 23\\A 24\\A 25\\A 26\\A 27\\A 28\\A 29\\A 30\\A 31\\A 32\\A 33\\A 34\\A 35\\A 36\\A 37\\A 38\\A 39\\A 40\\A 41\\A 42\\A 43\\A 44\\A 45\\A 46\\A 47\\A 48\\A 49\\A 50\\A 51\\A 52\\A 53\\A 54\\A 55\\A 56\\A 57\\A 58\\A 59\\A 60\\A 61\\A 62\\A 63\\A 64\\A 65\\A 66\\A 67\\A 68\\A 69\\A 70\\A 71\\A 72\\A 73\\A 74\\A 75\\A 76\\A 77\\A 78\\A 79\\A 80\\A"}',""]),t.exports=n},578:function(t,n,e){"use strict";e.r(n);e(41),e(20),e(31),e(19),e(10),e(139),e(69),e(70),e(138),e(24);var o=e(3),r=e(15),c=e(42),l=e(94),d=e(459);function f(object,t){var n=Object.keys(object);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(object);t&&(e=e.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),n.push.apply(n,e)}return n}var m={components:{Header:l.a,EntryFooter:d.a},computed:function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(n){Object(r.a)(t,n,source[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(source,n))}))}return t}({},Object(c.b)(["articles"])),asyncData:function(t){return Object(o.a)(regeneratorRuntime.mark((function n(){var o,r;return regeneratorRuntime.wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return t.store,o=t.params,n.next=3,e(481)("./".concat(o.year,"/").concat(o.slug,".json"));case 3:return r=n.sent,n.abrupt("return",{article:r});case 5:case"end":return n.stop()}}),n)})))()},validate:function(t){var n=t.params,e=(t.query,t.store);return null!=e.state.sourceFiles.find((function(a){return a.includes(n.slug)}))||null!=Object.entries(e.state.articles).find((function(a){return a[1].gistid===n.slug}))}},j=(e(482),e(18)),component=Object(j.a)(m,(function(){var t=this,n=t.$createElement,e=t._self._c||n;return e("div",[e("Header",{attrs:{title:t.article.title}}),t._v(" "),t.article.banner?e("div",{staticClass:"article-banner"},[e("img",{attrs:{src:t.article.banner}})]):t._e(),t._v(" "),e("section",{staticClass:"section"},[e("h1",{staticClass:"title has-text-primary has-text-weight-semibold"},[t._v("\n      "+t._s(t.article.title)+"\n    ")]),t._v(" "),t.article.subtitle?e("h1",{staticClass:"subtitle has-text-info has-text-weight-semibold"},[t._v("\n      "+t._s(t.article.subtitle)+"\n    ")]):t._e(),t._v(" "),e("div",{staticClass:"entry-content",domProps:{innerHTML:t._s(t.$md.render(t.article.bodyContent))}}),t._v(" "),e("section",{staticClass:"section"},[e("div",{staticClass:"is-size-7 is-family-code has-text-grey has-text-right"},[t._v("\n        Last update: "+t._s(t.article.date.substring(0,10))+".\n      ")])]),t._v(" "),e("EntryFooter",{attrs:{tags:t.article.tags}})],1)],1)}),[],!1,null,"2acfc650",null);n.default=component.exports}}]);