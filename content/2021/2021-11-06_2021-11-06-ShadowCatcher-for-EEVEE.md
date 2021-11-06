---
title: Shadow catcher for EEVEE
extra:
  banner: /2021/2021-11-06_banner.jpg
taxonomies:
    tags: ["Blender"]
---
[ここ](https://blenderartists.org/t/how-to-make-a-shadow-catcher-in-cycles-and-eevee-blender-tutorial/1332364)にEEVEEでshadow catcherを作る方法が説明されている。
以下の三つが必要。

- shader tree
- オブジェクトは`Opacity Blend`モードで表示。
- file transparentを有効化

３番目を要求されると、環境マッピングしている時に背景が抜けてしまうのでやりたくない。

いろいろやっていたら以下でもできることがわかった。理屈はわからないし、微妙なパラメータ調整が要求される。

![](/2021/2021-11-06_shadow-catcher.png)
