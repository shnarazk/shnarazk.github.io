---
title: The difference of depth-first search and width-first search in BQN
extra:
  subtitle: another beautiful (a)symmetry
taxonomies:
  tags: ["BQN", "APL"]
---
[https://www.youtube.com/watch?v=DmT80OseAGs](https://www.youtube.com/watch?v=DmT80OseAGs) を見ながらAPL版Sudoku solverをBQNに[移植](https://github.com/shnarazk/learn-bqn/blob/main/TIL/sudoku.bqn)していった。
ほぼ10行のプログラムで、前半はセル毎の関連セルインデックスマスクを生成し、後半はそれを使って穴を順に埋めていくというプログラムである。
探索は部分解の集合から次状態集合への遷移関数`N`を使って1ステップ進んだ状態集合を求めていく過程になる。
こんな感じ。

```apl
{ 𝕊N¨𝕨}
```

次に[https://www.youtube.com/watch?v=YnJ1Yy6gpmA](https://www.youtube.com/watch?v=YnJ1Yy6gpmA) を見ながら深さ優先探索版も作ったのだが、
基本的に両者の違いは展開と再帰の順番の問題なのでそんなに大きくは変わらないだろうと想像できる。
実際に理解して書き換えたものはこちら(なんだが書いているうちに興奮してきた)。

```apl
{𝕊¨N𝕩}
```

実に類似性を見て取れるじゃないか。なんと文字数まで一緒とは！ 
すいません、嘘つきました。

`N`はもともと「部分解集合から次状態の部分解集合への遷移関数」だったのをこっそり「部分解から部分解集合への関数」に拡大解釈していました。
ので、Nは「部分解から次状態の部分解集合への遷移関数」という方向で定義しなおしてみましょう。

すると幅優先探索で部分解集合から次の部分解集合を得るためには`S¨𝕩`ではダメで（集合の集合になってしまうので）、Haskellのmonadでいうところの`join`, Rustでの`flatmap`が必要になるけれども、それはBQNでは`∾`。ということで以下のコードが正しい。

```apl
{ 𝕊∾N¨𝕨}
```

これで深さ優先探索まであと1文字。
ところで、Nが部分解というスカラー（正確にはatom）を受け付けるなら、rank polymorphismにより部分解の集合(リスト)も受け付けるはずなので、こう書き換えることができる。

```apl
{ 𝕊∾N𝕨}
```

これで6文字！

ということで、二つの探索アルゴリズムを並べるとご覧の通り。

| algorithm   |     code | point-free |
|-------------|----------|------------|
| width-first | `{𝕊∾N𝕩}` |      `𝕊∾N` |
| depth-first | `{𝕊¨N𝕩}` |      `𝕊¨N` |

くそ美しいな！
BQNプログラマにとって幅優先はニョロ、深さ優先はチョンチョンなのだ！
(point-free版も追加してみたのだが、ここで`𝕊`が使えるかどうかちょっと疑問ではある。)