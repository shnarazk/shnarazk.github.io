---
title: Fluid Dynamics on Blender
updated: 2021-11-18
extra:
  banner: /2021/2021-11-18-fluid-dynamics/banner.jpg
  banner_caption: シミュレーションなげえ
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

泡の白っぽさを出すためには影を落とすの止めるのがいいかも。自己発光させるのがいいかも。ちょっと考え中。

