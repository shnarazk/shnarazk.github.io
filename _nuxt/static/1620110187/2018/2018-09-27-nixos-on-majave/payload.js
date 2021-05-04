__NUXT_JSONP__("/2018/2018-09-27-nixos-on-majave", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"NixOS on MacOS Mojave",date:"2018-09-27T00:00:00.000Z",tags:["nixOS","macOS"],bodyContent:"Mojaveへのアップグレードでまた共有ライブラリがなくなってnix由来のプログラムが動かなくなった。\n\n```\ndyld: Library not loaded: \u002Fusr\u002Flib\u002Fsystem\u002Flibsystem_network.dylib\n  Referenced from: \u002Fnix\u002Fstore\u002Fzk0kw320dn3dq56lpk7rgmf4pgk06g4f-Libsystem-osx-10.11.6\u002Flib\u002FlibSystem.B.dylib\n  Reason: image not found\n```\n\n関連するissueは色々立っているけどどれもよくわからない。\n\n- https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F42719\n\n多くの回答は再インストールを勧めているけど、それでも問題がある人もいるようだ。\n結局以下の方法で対応できた。\n\n```\n# 問題を起こしている（存在しなくなったライブラリを読もうとしている）パッケージを全て削除：\nsudo rm -fr \u002Fnix\u002Fstore\u002F*-Libsystem-osx-10.11.6\n\n# macOSの元環境でnix-2.1.2を再インストール\n\u002Fbin\u002Fbash\nexport PATH=\u002Fusr\u002Fbin:\u002Fbin\ncurl https:\u002F\u002Fnixos.org\u002Fnix\u002Finstall \u003E install\nbash install\n```\n\nこれでよくなった。nixOSが動くようになったのでTexLive2018の更新もまたできるようになった。",bodyHtml:"\u003Cp\u003EMojaveへのアップグレードでまた共有ライブラリがなくなってnix由来のプログラムが動かなくなった。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Edyld: Library not loaded: \u002Fusr\u002Flib\u002Fsystem\u002Flibsystem_network.dylib\n  Referenced from: \u002Fnix\u002Fstore\u002Fzk0kw320dn3dq56lpk7rgmf4pgk06g4f-Libsystem-osx-10.11.6\u002Flib\u002FlibSystem.B.dylib\n  Reason: image not found\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E関連するissueは色々立っているけどどれもよくわからない。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F42719\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003E多くの回答は再インストールを勧めているけど、それでも問題がある人もいるようだ。\n結局以下の方法で対応できた。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E# 問題を起こしている（存在しなくなったライブラリを読もうとしている）パッケージを全て削除：\nsudo rm -fr \u002Fnix\u002Fstore\u002F*-Libsystem-osx-10.11.6\n\n# macOSの元環境でnix-2.1.2を再インストール\n\u002Fbin\u002Fbash\nexport PATH=\u002Fusr\u002Fbin:\u002Fbin\ncurl https:\u002F\u002Fnixos.org\u002Fnix\u002Finstall &gt; install\nbash install\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eこれでよくなった。nixOSが動くようになったのでTexLive2018の更新もまたできるようになった。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2018",base:"2018-09-27-nixos-on-majave.json",ext:".json",sourceBase:"2018-09-27-nixos-on-majave.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"NixOS on MacOS Mojave"},date:{writable:true,enumerable:true,value:"2018-09-27T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["nixOS","macOS"]},bodyContent:{writable:true,enumerable:true,value:"Mojaveへのアップグレードでまた共有ライブラリがなくなってnix由来のプログラムが動かなくなった。\n\n```\ndyld: Library not loaded: \u002Fusr\u002Flib\u002Fsystem\u002Flibsystem_network.dylib\n  Referenced from: \u002Fnix\u002Fstore\u002Fzk0kw320dn3dq56lpk7rgmf4pgk06g4f-Libsystem-osx-10.11.6\u002Flib\u002FlibSystem.B.dylib\n  Reason: image not found\n```\n\n関連するissueは色々立っているけどどれもよくわからない。\n\n- https:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F42719\n\n多くの回答は再インストールを勧めているけど、それでも問題がある人もいるようだ。\n結局以下の方法で対応できた。\n\n```\n# 問題を起こしている（存在しなくなったライブラリを読もうとしている）パッケージを全て削除：\nsudo rm -fr \u002Fnix\u002Fstore\u002F*-Libsystem-osx-10.11.6\n\n# macOSの元環境でnix-2.1.2を再インストール\n\u002Fbin\u002Fbash\nexport PATH=\u002Fusr\u002Fbin:\u002Fbin\ncurl https:\u002F\u002Fnixos.org\u002Fnix\u002Finstall \u003E install\nbash install\n```\n\nこれでよくなった。nixOSが動くようになったのでTexLive2018の更新もまたできるようになった。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003EMojaveへのアップグレードでまた共有ライブラリがなくなってnix由来のプログラムが動かなくなった。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Edyld: Library not loaded: \u002Fusr\u002Flib\u002Fsystem\u002Flibsystem_network.dylib\n  Referenced from: \u002Fnix\u002Fstore\u002Fzk0kw320dn3dq56lpk7rgmf4pgk06g4f-Libsystem-osx-10.11.6\u002Flib\u002FlibSystem.B.dylib\n  Reason: image not found\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E関連するissueは色々立っているけどどれもよくわからない。\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fgithub.com\u002FNixOS\u002Fnixpkgs\u002Fissues\u002F42719\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003E多くの回答は再インストールを勧めているけど、それでも問題がある人もいるようだ。\n結局以下の方法で対応できた。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E# 問題を起こしている（存在しなくなったライブラリを読もうとしている）パッケージを全て削除：\nsudo rm -fr \u002Fnix\u002Fstore\u002F*-Libsystem-osx-10.11.6\n\n# macOSの元環境でnix-2.1.2を再インストール\n\u002Fbin\u002Fbash\nexport PATH=\u002Fusr\u002Fbin:\u002Fbin\ncurl https:\u002F\u002Fnixos.org\u002Fnix\u002Finstall &gt; install\nbash install\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eこれでよくなった。nixOSが動くようになったのでTexLive2018の更新もまたできるようになった。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2018"},base:{writable:true,enumerable:true,value:"2018-09-27-nixos-on-majave.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2018-09-27-nixos-on-majave.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});