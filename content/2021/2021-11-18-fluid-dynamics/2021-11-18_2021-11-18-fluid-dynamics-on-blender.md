---
title: Fluid Dynamics on Blender
updated: 2021-11-18
extra:
  banner: /2021/2021-11-18-fluid-dynamics/banner.jpg
  banner_caption: シミュレーションなげえ
  subtitle: dynamics研究
taxonomies:
    tags: ["Blender"]
---
# 2021-11-18

### 水飛沫立てたい

fluid domainオブジェクトのsettingでResolution Divisionsを大きくすべし。
最低100は欲しい。
メッシュが荒ければそりゃ局所的な変形は掬えないわな。
シミュレーションに時間がかかってもしょうがない。

### 飛沫や泡がレンダリングできない

particleもそうだが、rendering typeをobjectにしないとどちらのレンダラーを選んでも描画されない。
この設定はfluid domainオブジェクトのParticlesタブの中にある。

### 暗くなってしまう

泡を飛ばすと、大量に出てくるので、おそらくレイトレースの上限に簡単に達しているんだろう。
泡を別のsceneに持っていってcompositeするか、影を落とさないようにするか、自己発光させるか、どうすべきだろうか。

まず、泡多すぎる感じがしたので、を徹底的に大きな値にしてみた。なかなか減らない。
ついでにresolution scaleを1にしてみた。飛び跳ね方が倍違う気がするけど(そういうこと？)、元気があっていい感じ。
暗さはだいぶ解消した。

![](/2021/2021-11-18-fluid-dynamics/test2.jpg)

fuild domainオブジェクトのparticle properties からLiquidなるparticleのrederingをやめてみるとこうなった。
なんぞそれ？ これらのparticleを全部消してもちゃんと波面は変形しているけど？

![](/2021/2021-11-18-fluid-dynamics/test3.jpg)

だいぶわかってきたのでテストレンダリングしてみた。

![](/2021/2021-11-18-fluid-dynamics/jumping-owl.jpg)

