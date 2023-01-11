---
title: Matrix product in BQN
updated: 2021-01-01
extra:
  banner: /2023/learn-bqn.png
  banner_caption: Let's learn BQN
  subtitle: 今時の行列指向言語とは
taxonomies:
  tags: ["bqn"]
---
# What's this!?
advent of codeの問題を解くため、配列の乗算をBQNで定義した。

```apl
ProductIndices ← {d←𝕩⋄({(((⊑𝕩)⊸⋈)(⋈)(⋈⟜(1⊑𝕩)))¨↕d}⋈)⌜˜↕𝕩}
MyProduct ← {(+´((𝕩⊑˜1⊸⊑)×(𝕨⊑˜0⊸⊑))¨)⌜ ProductIndices ≠𝕨}
```

完成した後でBQNcrateで検索してみたらこうなった。

```apl
Product ← +˝∘×⎉1‿∞
```
なんじゃこりゃ？！

というのをgithubのリポジトリに書き始めてこりゃブログでやるこっちゃなと思ったのでこちらに引っ越し。
なんなんだよこのグリフ`⎉`は？

ふーむ、どうもtensor上に一般化されたtraverseのようだ。それも2引数版で𝕩と𝕨でそれぞれたどる単位を指定できるらしい。

- 0だとスカラー
- 1だとleading axisに沿ったセル単位
- 2だと対象が2次元配列なら配列全体
- ∞なら対象のrankによらず配列全体

となるので結局列ベクターと行列全体の乗算になる(この定義は自明なんだろうか？)。
これは3次元tensorになるので`+˝`で最後の軸でfoldしてしまえば全く素直に行列の乗算を定義通りに実行することになる。

なるほど。。。
大変感心した。
