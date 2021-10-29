---
title: MacOSでのNix2.4に対応した/nixの作り方
extra:
  subtitle: No more synthetic approach
  banner: /2021/2021-10-29_banner.jpg
  banner_caption: Geometory node + fluid
taxonomies:
  tags: ["NixOS"]
---
Nix 2.4のalphaリリースがnixpkgs unstableに入った当初の頃は2.4に切り替えると`nix-channel --update`に失敗するので、手を出さずにいたのだけど、Nix 2.4のリリース(release.mdによれば2021-11-01のようだ)直前になってnix-2.4pre版へ自動更新されるようになっても、相変わらずそのエラーが出てしまう。そしてネットで調べても同じ症状に困っている人が見つからない。

どうも本格的に個人的な問題がありそうなので、ソースからbuildしたりして調べた結果、/nixがシンボリックリンク経由なのが原因ということになった。（丹念に探せば実は最初からそういうエラーメッセージを見つけられたかもしれないのだが。）

あれ、`NIX_IGNORE_SYMLINK_STORE`で対応できるでのは？
Nixのマニュアルを読み返してみると、一番お手軽だった/etc/synthetic.confで/nixにmountしている方法は全く推奨されていなかった。
実装が変わって2.4ではとうとうこの方法はサポート外になってしまったようだ。

ということで1台目のmacではpartitionぶっ飛ばして再インストールが必要になったりしたけど、全部のmacで/etc/fstabを編集する1番おすすめの方法で/nixを用意することになりました。（セキュリティ的な脆弱性も問題ないようだ。）
これでやっとflakeが使えるようになった。
