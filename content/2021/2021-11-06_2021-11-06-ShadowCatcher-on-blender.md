---
title: Shadow catcher on Blender
updated: 2021-11-20
extra:
  banner: /2021/2021-11-06_banner.jpg
  subtitle: 影重要
taxonomies:
    tags: ["Blender"]
---
# 2021-11-20

3.0のShadow Catcherのコンポジションツリーがこのページのやり方と違うことに気がついた。

- [https://wiki.blender.org/wiki/Reference/Release_Notes/3.0/Cycles](https://wiki.blender.org/wiki/Reference/Release_Notes/3.0/Cycles)

![](https://wiki.blender.org/w/images/7/7a/Cycles_3.0_shadow_catcher_compositing.png)

> デフォルトでは、シャドウキャッチャーは結合パスのアルファチャンネルにのみ影響します。ただし、色付きの間接光と放出を完全に処理するには、新しいシャドウキャッチャーパスを使用する必要があります。背景にシャドウキャッチャーパスを掛ける必要があり、その後、結合パスをアルファオーバーで合成することができます。

試してみた。なるほど、コレクションは増やさず、Scene collectionをオフにした新規レイヤーで背景だけ描画したものに基レイヤーをOver alphaで合成するのか。確かによりリアルでしかも簡単そうだ（まあ、HDRIの中には異常に色被りするやつが出てきたけど）。

# 2021-11-09

### EEVEE version 2.1

> 否定を3回ならde Morganの出番のはずなんだが、うーむ、画像アプリの世界ではなんだか。。。

なんか[0, 1]への正規化という点で難があると思うのだが、clampとか意味のないはずのスケーリングとかで手当てをしよう。
Let's do it.

![](/2021/2021-11-06_eevee2.1.png)

### EEVEE version 2

EEVEEでも素直にマスクが使えるのでノード数は増えるけど、2021-11-07の前半部よりもこちらの方が直感的かも。

影を落とすメッシュを`shadow receiver`とする。surface materialは何も指定する必要はない。とにかくcollection `shadow catch`に入れておく。このオブジェクトに対して、Object Properties - Visibility - Mask -- holdoutを有効化する。

レイヤーの設定は以下の通り。

- 元からあったlayer -- `shadow catch`は非表示。layer passでCombinedをレンダリング。
- 追加したShadow Layer -- `shadow catch`は表示。Shadowをレンダリング。

composerで組み立て。

- Shadow LayerのAlphaはholdoutのところだけが真っ黒に抜けている。
- Shadow LayerのShadowは影のところだけが真っ暗。
- この二つから論理演算でholdoutに落ちた影のところだけが真っ黒なマスクを生成
- 適当にスケーリングして元からあったLayerのCombinedにMultiplyで重ねあわせ。

論理演算でInvertをおそらく3回使うのでノード数は増えるが便利そうでなんだかそうでもないOver Alphaを使わなくていいので、修正方法が理解しやすいんじゃなかろうか。
否定を3回ならde Morganの出番のはずなんだが、うーむ、画像アプリの世界ではなんだか。。。
あとCyclesでの設定との類似性。

![](/2021/2021-11-06_eevee2.png)

# 2021-11-07

### EEVEE version 1

いやもっと便利なのはcompositing treeだろう。
影を落とすメッシュを`shadow receiver`とする。surface materialはholdout。collection `shadow catch`に入れておく。

- 元からあったlayer改めCatching Layer -- `shadow catch`は表示。layer passでCombinedとShadowをレンダリング。
- No Catcher Layer -- `shadow receiver`は非表示。Combinedをレンダリング。

composerで組み立て。

Catching LayerのShadowをalphaに使って、No Catcher layerの画像の上にOver alphaでCatching Layerの画像を重ねる。holdoutが真っ黒なものとしてレンダリングされるのでcatcherに落ちた真っ黒な影がCombined画像の上に重ねられる。
この画像をNo Catcher Layerの上に重ねる。影の部分以外は同一の画像なので、alphaで影の濃さを調整。

![](/2021/2021-11-06_eevee.png)

EEVEEはこれでOK。

### Cycles version 0

Cyclesだと、holdoutはShadowの画像においても真っ黒なものとして表現されるので併用はできない。影だけでなくshadow catcherのあったところ全体が影になってしまう。

- なので、shadow catcherには通常のshaderを与えて
- Object Properties - Visibility - Mask -- Shadow Catcherを有効化

するとレンダリングされるべき濃さの影のマスクが生成されるので、
これを適当にスケーリングしてNo Catcher layerのレンダリング画像Combinedのvalueに流し込めばよいだろう。

![](/2021/2021-11-06_cycle.png)

ちょっと修正が必要なところが残念だが、とりあえず5分で質問に答える準備としてメモしておく。

# 2021-11-06, EEVEE version 1

[ここ](https://blenderartists.org/t/how-to-make-a-shadow-catcher-in-cycles-and-eevee-blender-tutorial/1332364)にEEVEEで使えるshadow catcherを作る方法が説明されている。
それには以下の三つが必要。

- 2つのDiffuse BSDFと1つのTransparent BSDF、変換ノードからなるshader tree
- オブジェクトは`Opacity Blend`モードで表示
- film transparentを有効化

この３番目を要求されると、環境マッピングしている時に背景が抜けてしまうのでやりたくない。

いろいろやっていたら以下でもできることがわかった。理屈はわからないし、微妙なパラメータ調整が要求される(三つのColor全部でバランスを取らないといけない)。

![](/2021/2021-11-06_shadow-catcher.png)
