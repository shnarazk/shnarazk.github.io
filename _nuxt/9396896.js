(window.webpackJsonp=window.webpackJsonp||[]).push([[72],{557:function(e){e.exports=JSON.parse('{"title":"Liveness of nix-store created by \'nix-build\'","subtitle":"No \'nix-store --delete --ignore-liveness\'","date":"2020-04-05T00:00:00.000Z","tags":["NixOS"],"bodyContent":"昨日、[nixOS](https://nixos.org) に [cadical](https://github.com/arminbiere/cadical) が追加されたけど、それに至るまでは[nixpkgsリポジトリ](https://github.com/NixOS/nixpkgs)のクローンを作って、自分でnix-buildを繰り返していた。\\n一旦 `nix-build -A cadical` でパッケージを作成するとnix expressionを変更してもartifactのstoreが更新されないことが多い。\\n調べて nix-storeのdeleteオプションで消せることがわかったけど、実行すると死んでないから削除できないというエラーが出る。`nix-env -e cadical` で削除しても同じエラーになる。\\n\\ndeleteオプションには`--ignore-liveness`という強力なフラグがあるのだけどこれを使っていたらnixの環境がgcされてnixでインストールしたものが一瞬全てなくなる羽目になってしまった。\\nこれは結局 `/nix-profile/bin から辿れるシンボリックリンクを貼り直すことで回復できたけど、もうこのオプションは使いたくない。一体なぜパッケージを自分の環境から削除したのゴミにならないのか？\\n\\n調べてみたら（いや、適当に見当つけて見たら）、nixpkgsワーキングツリーのトップにnix-buildで生成されたstoreへのシンボリックリンク result というのが自動的にできるのだけど、これがGCのrootになっていた。\\n\\nということで result をrmで消すと（そして nix-env -e すると）、 nix-store --delete で素直に消えてくれるようになりました。","bodyHtml":"<p>昨日、<a href=\\"https://nixos.org\\">nixOS</a> に <a href=\\"https://github.com/arminbiere/cadical\\">cadical</a> が追加されたけど、それに至るまでは<a href=\\"https://github.com/NixOS/nixpkgs\\">nixpkgsリポジトリ</a>のクローンを作って、自分でnix-buildを繰り返していた。\\n一旦 <code>nix-build -A cadical</code> でパッケージを作成するとnix expressionを変更してもartifactのstoreが更新されないことが多い。\\n調べて nix-storeのdeleteオプションで消せることがわかったけど、実行すると死んでないから削除できないというエラーが出る。<code>nix-env -e cadical</code> で削除しても同じエラーになる。</p>\\n<p>deleteオプションには<code>--ignore-liveness</code>という強力なフラグがあるのだけどこれを使っていたらnixの環境がgcされてnixでインストールしたものが一瞬全てなくなる羽目になってしまった。\\nこれは結局 `/nix-profile/bin から辿れるシンボリックリンクを貼り直すことで回復できたけど、もうこのオプションは使いたくない。一体なぜパッケージを自分の環境から削除したのゴミにならないのか？</p>\\n<p>調べてみたら（いや、適当に見当つけて見たら）、nixpkgsワーキングツリーのトップにnix-buildで生成されたstoreへのシンボリックリンク result というのが自動的にできるのだけど、これがGCのrootになっていた。</p>\\n<p>ということで result をrmで消すと（そして nix-env -e すると）、 nix-store --delete で素直に消えてくれるようになりました。</p>\\n","dir":"article/.json/2020","base":"2020-04-05-nix-liveness.json","ext":".json","sourceBase":"2020-04-05-nix-liveness.md","sourceExt":".md"}')}}]);