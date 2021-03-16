__NUXT_JSONP__("/2020/2020-08-07-NixOS-on-BigSur", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"NixOS on Big Sur",subtitle:"毎年右往左往",date:"2020-08-17T00:00:00.000Z",tags:["NixOS","macOS"],banner:"\u002Fimg\u002F2020\u002F08-07\u002Fbanner.jpg",bodyContent:"### Big Sur以前\n\n\u002Fetc\u002Fsynthetic.conf　に\n\n```\nnix\n```\n\nを追加してmountしていた。\n\n### Big Sur\n\nなんだかmountしてくれないので `\u002Fnix` をシンボリックリンクに変更して対応することにした。\nそのため、\u002Fetc\u002Fsynthetic.conf を\n\n```\nnix\t\u002FVolumes\u002FNix\n```\nに編集。さらにどこかで\n\n```\nexport NIX_IGNORE_SYMLINK_STORE=1\n```\n\nを実行して、リンクを辿ってくれるようにすればいいようだ。\n\nそれにしても結構Gnomeな見かけだなぁ。。。\n\n### 2020-08-09\n\n\u002Fusr\u002Flib\u002Fsystem\u002Flibcache.dylib がないのでrustプログラムがコンパイルできなくなっている。\n\nCコンパイラも動かないのでemacs27も作れない。\n\n### 2020-08-11\n\n結果としてリンクにするのがNixOSをインストールするためのベストプラクティスみたいだ。\n以前は\u002FVolumes\u002FNix をリブートするたびに手で\u002Fnixにマウントしなおしていたのが、その必要がなくなった。\n\n### 2020-08-17\n\nコンパイルできない問題はお手上げ状態みたいです。\nhttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F91748",bodyHtml:"\u003Ch3\u003EBig Sur以前\u003C\u002Fh3\u003E\n\u003Cp\u003E\u002Fetc\u002Fsynthetic.conf　に\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Enix\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eを追加してmountしていた。\u003C\u002Fp\u003E\n\u003Ch3\u003EBig Sur\u003C\u002Fh3\u003E\n\u003Cp\u003Eなんだかmountしてくれないので \u003Ccode\u003E\u002Fnix\u003C\u002Fcode\u003E をシンボリックリンクに変更して対応することにした。\nそのため、\u002Fetc\u002Fsynthetic.conf を\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Enix\t\u002FVolumes\u002FNix\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eに編集。さらにどこかで\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eexport NIX_IGNORE_SYMLINK_STORE=1\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eを実行して、リンクを辿ってくれるようにすればいいようだ。\u003C\u002Fp\u003E\n\u003Cp\u003Eそれにしても結構Gnomeな見かけだなぁ。。。\u003C\u002Fp\u003E\n\u003Ch3\u003E2020-08-09\u003C\u002Fh3\u003E\n\u003Cp\u003E\u002Fusr\u002Flib\u002Fsystem\u002Flibcache.dylib がないのでrustプログラムがコンパイルできなくなっている。\u003C\u002Fp\u003E\n\u003Cp\u003ECコンパイラも動かないのでemacs27も作れない。\u003C\u002Fp\u003E\n\u003Ch3\u003E2020-08-11\u003C\u002Fh3\u003E\n\u003Cp\u003E結果としてリンクにするのがNixOSをインストールするためのベストプラクティスみたいだ。\n以前は\u002FVolumes\u002FNix をリブートするたびに手で\u002Fnixにマウントしなおしていたのが、その必要がなくなった。\u003C\u002Fp\u003E\n\u003Ch3\u003E2020-08-17\u003C\u002Fh3\u003E\n\u003Cp\u003Eコンパイルできない問題はお手上げ状態みたいです。\nhttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F91748\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2020",base:"2020-08-07-NixOS-on-BigSur.json",ext:".json",sourceBase:"2020-08-07-NixOS-on-BigSur.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"NixOS on Big Sur"},subtitle:{writable:true,enumerable:true,value:"毎年右往左往"},date:{writable:true,enumerable:true,value:"2020-08-17T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["NixOS","macOS"]},banner:{writable:true,enumerable:true,value:"\u002Fimg\u002F2020\u002F08-07\u002Fbanner.jpg"},bodyContent:{writable:true,enumerable:true,value:"### Big Sur以前\n\n\u002Fetc\u002Fsynthetic.conf　に\n\n```\nnix\n```\n\nを追加してmountしていた。\n\n### Big Sur\n\nなんだかmountしてくれないので `\u002Fnix` をシンボリックリンクに変更して対応することにした。\nそのため、\u002Fetc\u002Fsynthetic.conf を\n\n```\nnix\t\u002FVolumes\u002FNix\n```\nに編集。さらにどこかで\n\n```\nexport NIX_IGNORE_SYMLINK_STORE=1\n```\n\nを実行して、リンクを辿ってくれるようにすればいいようだ。\n\nそれにしても結構Gnomeな見かけだなぁ。。。\n\n### 2020-08-09\n\n\u002Fusr\u002Flib\u002Fsystem\u002Flibcache.dylib がないのでrustプログラムがコンパイルできなくなっている。\n\nCコンパイラも動かないのでemacs27も作れない。\n\n### 2020-08-11\n\n結果としてリンクにするのがNixOSをインストールするためのベストプラクティスみたいだ。\n以前は\u002FVolumes\u002FNix をリブートするたびに手で\u002Fnixにマウントしなおしていたのが、その必要がなくなった。\n\n### 2020-08-17\n\nコンパイルできない問題はお手上げ状態みたいです。\nhttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F91748"},bodyHtml:{writable:true,enumerable:true,value:"\u003Ch3\u003EBig Sur以前\u003C\u002Fh3\u003E\n\u003Cp\u003E\u002Fetc\u002Fsynthetic.conf　に\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Enix\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eを追加してmountしていた。\u003C\u002Fp\u003E\n\u003Ch3\u003EBig Sur\u003C\u002Fh3\u003E\n\u003Cp\u003Eなんだかmountしてくれないので \u003Ccode\u003E\u002Fnix\u003C\u002Fcode\u003E をシンボリックリンクに変更して対応することにした。\nそのため、\u002Fetc\u002Fsynthetic.conf を\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Enix\t\u002FVolumes\u002FNix\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eに編集。さらにどこかで\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Eexport NIX_IGNORE_SYMLINK_STORE=1\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eを実行して、リンクを辿ってくれるようにすればいいようだ。\u003C\u002Fp\u003E\n\u003Cp\u003Eそれにしても結構Gnomeな見かけだなぁ。。。\u003C\u002Fp\u003E\n\u003Ch3\u003E2020-08-09\u003C\u002Fh3\u003E\n\u003Cp\u003E\u002Fusr\u002Flib\u002Fsystem\u002Flibcache.dylib がないのでrustプログラムがコンパイルできなくなっている。\u003C\u002Fp\u003E\n\u003Cp\u003ECコンパイラも動かないのでemacs27も作れない。\u003C\u002Fp\u003E\n\u003Ch3\u003E2020-08-11\u003C\u002Fh3\u003E\n\u003Cp\u003E結果としてリンクにするのがNixOSをインストールするためのベストプラクティスみたいだ。\n以前は\u002FVolumes\u002FNix をリブートするたびに手で\u002Fnixにマウントしなおしていたのが、その必要がなくなった。\u003C\u002Fp\u003E\n\u003Ch3\u003E2020-08-17\u003C\u002Fh3\u003E\n\u003Cp\u003Eコンパイルできない問題はお手上げ状態みたいです。\nhttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F91748\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2020"},base:{writable:true,enumerable:true,value:"2020-08-07-NixOS-on-BigSur.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2020-08-07-NixOS-on-BigSur.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});