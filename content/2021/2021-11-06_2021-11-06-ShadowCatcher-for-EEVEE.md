---
title: Shadow catcher for EEVEE
extra:
  banner: /2021/2021-11-06_banner.jpg
  subtitle: 影重要
taxonomies:
    tags: ["Blender"]
---
# 2021-11-07

いやもっと便利なのはcompositing treeだろう。
影を落とすメッシュを`shadow receiver`とする。surface materialはholdout。collection `shadow catch`に入れておく。

- 元からあったlayer改めCatching Layer -- `shadow catch`は表示。layer passでCombinedとShadowをレンダリング。
- No Catcher Layer -- `shadow catch`は非表示。Combinedをレンダリング。

composerで組み立て。

Catching LayerのShadowをalphaに使って、No Catcher layerの画像の上にOver alphaでCatching Layerの画像を重ねる。holdoutが真っ黒なものとしてレンダリングされるのでcatcherに落ちた真っ黒な影がCombined画像の上に重ねられる。
この画像をNo Catcher Layerの上に重ねる。影の部分以外は同一の画像なので、alphaで影の濃さを調整。

![](/2021/2021-11-07_eevee.png)

EEVEEはこれでOK。

Cycle(X)だと、holdoutはShadowの画像においても真っ黒なものとして表現されるので併用はできない。影だけでなくshadow catcherのあったところ全体が影になってしまう。

- なので、shadow catcherには通常のshaderを与えて
- Object Properties - Visibility - Mask -- Shadow Catcherを有効化

するとレンダリングされるべき濃さの影のマスクが生成されるので、
これをNo Catcher layerのレンダリング画像Combinedのvalueに流し込めばよい。

![](/2021/2021-11-07_cycle.png)

ちょっと修正が必要なところが残念だが、とりあえず5分で質問に答える準備としてメモしておく。



# 2021-11-06

[ここ](https://blenderartists.org/t/how-to-make-a-shadow-catcher-in-cycles-and-eevee-blender-tutorial/1332364)にEEVEEで使えるshadow catcherを作る方法が説明されている。
それには以下の三つが必要。

- 2つのDiffuse BSDFと1つのTransparent BSDF、変換ノードからなるshader tree
- オブジェクトは`Opacity Blend`モードで表示
- film transparentを有効化

この３番目を要求されると、環境マッピングしている時に背景が抜けてしまうのでやりたくない。

いろいろやっていたら以下でもできることがわかった。理屈はわからないし、微妙なパラメータ調整が要求される(三つのColor全部でバランスを取らないといけない)。

![](/2021/2021-11-06_shadow-catcher.png)
