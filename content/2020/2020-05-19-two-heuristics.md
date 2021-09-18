---
title: What's the difference between EVSIDS and LR?
date: 2020-05-19
extra:
  subtitle: a tentative thought
taxonomies:
  tags: ["SAT"]
---
よくわかってない人の意見ですが。

最近のSATソルバの注目すべきアイデアの一つにLearning Rate (+ Reason-Side) Rewardingがある。
長らく続いてきたEVSIDS一強時代に対抗できる成果を残している。と言っても完全に上回るのではなく
「タイムアウトを長くした」場合という限定詞付きではあるが、それでも注目すべき技術だろう。
というわけで最近のSplrでもfeatureで切り替えられるようにした。

LRのよさはなんとなくわかる。LRのアイデアは学習率の最適化により矛盾発生頻度を最大化しようとするものである[1]。

> In particular, we model the variable selection optimization problem as an online multi-armed bandit, a special-case of reinforcement learning, to learn branching variables such that the learning rate of the solver is maximized. 

> Since producing learnt clauses is a direct indication of progress, we define our metric to be the variable’s propensity to produce learnt clauses.

これによってSAT問題であれば矛盾を全て解決していけば解に到達するし、UNSAT問題であればUNSATなコアに到達できるのだろう。

で自然な考えに思えるのだが、だとすると、これとは違うEVSIDSは一体何をしていて、
なぜ10年以上も君臨できるほどいい結果が出せているのかが、また疑問に思えてきた。

LRが出てくるまでは漠然と矛盾発生率の最大化だと思っていたのだけど、もはやこれとは違う説明を思いつかなければならない。
一体なんなんだろうかと考えていて一つの仮説を思いついた。
と言ってもそれほど大したものではないのだが。

それは、矛盾回避率の最大化ではないだろうか。そもそも矛盾が解決したはずなのにそれに関与するリテラルに対して（後付けで）報酬を与えて意味があるのかが疑問だったのだが、矛盾が解決したことによって、同じリテラル集合に対して割り当てをした場合、少なくとも先の矛盾を再び起こすことはないのだから、より割り当てを進ませることができる可能性は改善しているのではなかろうか。
つまり、わずかではあるがこの方向で探索を進めて矛盾しない可能性が改善している。
従ってこれは探索のよい枝刈り（あるいは方向付け）になっているのではなかろうか。

こうするとこの二つを対比させることができる。

* EVSIDSは矛盾回避率の最大化を目指す。
* LRは矛盾発生率の最大化を目指す。

従ってこの二つは最大化の対象は全く逆ではないだろうか。
全く逆だからこそどちらでもそこそこうまく行くと。。。

で、探索に関して少しは考えてきた人間としてはbi-directional searchなんてのを思い出すわけですよ。
この両者は併存、併用できるのではないだろうか。なぜなら（ここが一番根拠の薄い所だけども）

* EVSIDSは矛盾を避けることでSAT解に到達しようとしている。UNSAT解はその副作用。
* LRは矛盾のコアを見つけることでUNSAT解に到達しようとしている。SAT解はその副作用。

ということで一つの問題を全く逆の方向から解こうとしているのだからまさにbi-directional searchに見える。
デメリットはおそらく線形時間の速度低下。
bi-directional searchはうまくいかないということで決着したようだけども、今回は探索空間が本当に組合せ爆発してしているため、同じ結論にはならないように思える。

ということでSplr-0.4.0でブランチ切ってやってみた。
少なくとも1例しかやってないけども、そのT56ではえらい効果があった。
さて、本番のベンチマークではどうなるだろうか。。。ちょっと本腰を入れてコミットしてみよう。

さらにこう考えていくと、LRにとってリスタートは必要なのだろうか？
EVSIDSにとってリスタートは必要なのだろうか？
という疑問も出てくるのだがそれはまた別の話ということで。

## 別の考え

あるいは、もちろんどちらも共通の尺度であって単に計算式が違うだけということもあるかもしれない。

* EVSIDSは直近に矛盾を解消したリテラルに重きを置く
* LRは平均的に矛盾を導出したリテラルに重きを置く
* どちらも同じことだから、ウィンドウサイズを制御する変数によって両者を連続的に結合せよ。次に探索状況から制御変数を制御せよ。

実行時間の増加につれてEVSIDSからLRに移行する試みは既にやっているのだが。。。

## References

[1] J. H. Liang, V. Ganesh, P. Poupart, and K. Czarnecki, “Learning Rate Based Branching Heuristic for SAT Solvers,” Lect. Notes Comput. Sci. (including Subser. Lect. Notes Artif. Intell. Lect. Notes Bioinformatics), vol. 9710, pp. 123–140, 2016.
