---
title: A visualization tool to analyze logic fomula
subtitle: I need better intuition
date: 2020-01-29
tags: ["SAT", "Pharo"]
---
CNF形式の論理式の特徴ををもっと視覚化できないものだろうか。

ベンチマークで使われている問題の中には3SATみたいに変数数が少ないのだが、どうやっても解けないものもある。
単に3SATなんだけも相転移点に近くて難しいのか、ランダムではあるが3SATではないのか、3SATではあるけどランダムではないのか（いやだったらむしろやさしくなりそう）、いったいどういう問題を相手にしているのか、ソルバーが何も考えずに取り組む前に人間が分析をしないことには進展はないのではないか？

さらに、SATソルバの中で与えられた論理式がどう変化していくかも可視化したいものだ。


というわけで何か統計量だけでなく色々と視覚的に表示してくれるツールが必要かなあという気がしてきた。
ググって出てくるのはこれくらい。

1. C. Dodaro and A. Previti, "Minipref: A tool for preferences in SAT," *CEUR Workshop Proc.*, pp. 1–9, 2019.
1. C. Sinz and E. M. Dieringer, "DPVIS - A tool to visualize the structure of SAT instances," *Lect. Notes Comput. Sci.*, vol. 3569, pp. 257–268, 2005.

どうもイマイチ。
JavaScript(Vue.js or Observable)で作るか、それともいっそのこと[Pharo](https://pharo.org)に手を出してみようか（これこそSmalltalk環境の出番のようだがGraphvisの上位互換程度のことはできているのだろうか？）。

ちょっと考え中。というか調査しなければ。


## 2020-01-28

数日Pharo 8.0で遊んでみたんだけど、

- *Icebergがファイル .project の状態を理解できてないのでいつまで経ってもdirtyになる*
  **これは~/.config/git/ignore でおそらくJava用に.projectを追加していたせいだった！**
- [Iceberg](https://github.com/pharo-vcs/iceberg)はコメントも付かずにほったらかしのissuesが多い、エラーへの対応がわからない
- Iceberg, Metacelloあたりのドキュメントが古い
- リリース8.0で何がどうなったのか情報なさすぎ
- wiki情報も古い
- Baselineが面倒くさそう

~~というあたりがどうにも我慢できなくて、やはり使うのはやめることにした。エラーの発生が多すぎて、やる気が削がれた。しょうがない、D3.jsで頑張るしかないか。~~

上の文は取り消して、もうしばらく遊んでみる。

## 2020-01-29

Pharo 8.0でSystem Browserでプロジェクトを選んでコンテキストメニューからcommitしようとするとエラーになる。

- https://github.com/pharo-project/pharo/pull/4423

なんか解決していることになっているようだが、以下のメソッドがないエラーなので、でっち上げた。

- `IceLibgitRepository`にvalidatingプロトコルを追加
- `IceLibgitRepository >> #isDetached`を定義
- `IceLibgitRepository >> #hasUnbornProject`を定義

```smalltalk
    IceLibgitRepository >> isDetached
	^workingCopy isDetached
```

```smalltalk
    IceLibgitRepository >> hasUnbornProject
	^false
```
