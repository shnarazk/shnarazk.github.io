---
title: Difference fo depth-first and width-first searches in BQN
extra:
  subtitle: another beautiful (a)symmetry
taxonomies:
  tags: ["BQN", "APL"]
---
https://www.youtube.com/watch?v=DmT80OseAGs を見ながらAPL版Sudoku solverをBQNに移植していった。
ほぼ10行のプログラムで、前半はセル毎の関連セルインデックスマスクを生成し、後半はそれを使って穴を順に埋めていくというプログラムである。
探索は部分解の集合から次状態への遷移関数`N`を使って1ステップ進んだ状態集合を求めていく過程になる。
こんな感じ。

```apl
{ 𝕊N¨𝕨}
```

正確には、ある状態から生成される次状態は1つとは限らないので、状態集合となり、単純に遷移関数をmapするだけだと生成されるものは状態集合の集合になってしまう。そこでHaskellのmonadでいうところの`join`, Rustでの`flatmap`が必要になる。それを踏まえると正しい形は以下の通り。

```apl
{𝕊∾N¨𝕩}
```

次にhttps://www.youtube.com/watch?v=YnJ1Yy6gpmA を見ながら深さ優先探索版も作ったのだが、
基本的両者の違いは展開と再帰の順番の問題なのでそんなに大きくは変わらないだろうと想像できる。
実際に理解して書き換えたものはこちら(なんだが書いているうちに興奮してきた)。

```apl
{(𝕊N)¨𝕩}
```

実に類似性を見て取れるじゃないか。
再帰を優先するために導入した括弧()はmodifierが左優先であることから以下のように書き換えられる。

```apl
{𝕊∘N¨𝕩}
```

ということで、二つの探索アルゴリズムを並べるとご覧の通り。

| algorithm   |      code |
|-------------|-----------|
| width-first | `{𝕊∾N¨𝕩}` |
| depth-first | `{𝕊∘N¨𝕩}` |

くそ美しいな！
 