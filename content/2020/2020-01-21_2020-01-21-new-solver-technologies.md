---
title: New technologies for SAT solvers
extra:
  subtitle: from SR2019
taxonomies:
  tags: ["SAT"]
---
遅ればせながらSR2019のベンチマークを見てみた。

## CaDiCaL

デフォルト設定のみのエントリーで3位に位置するソルバ。作者を見たらBiere先生だった。

- chronological backtrack
- dual restart mode
- improving phase Saving

といったところが主に使っている新技術。

## Chronological Backtrack

まだチェックしてないがSC2018以降のトレンドみたい。こんな発想はなかった。
リスタートの抑制よりもさらに網羅的に探索するということか。原著は以下：

- A. Nadel and V. Ryvchin. Chronological backtracking. In *Theory and Applications of Satisfiability Testing - SAT 2018. Proceedings*, 2018.

大事なところだけ読んでみた。えー、それってコスト削減になるのか？
リスタートを掛けずに先まで行けるのなら、色々と特徴量に対する影響は少しはあると思うが。

ちょっと変更したものだったら簡単に実装できたが、散々crashに悩まされる。
数日かかりそう。で、実装してみたけどちゃんと論文読まねば。単なるレベル0へのバックトラックの
ショートカットでしかないので差が出ない（ひどい。。。）。

## Dual Restart Mode

リスタートしないモードがUNSAT問題に効くので、リスタート戦略を切り替える技術。
ということはdeep searchが正当化されるかもしれない。
インターリーブはうまくいかない印象なんだけど、実はその実験はやってなかったかも。

## Improving Phase Saving

一番よかったphaseセットを覚えておくという、VoPに似た感じの技術。
ただしこれまでのphaseと併用するとのこと。
またprefixという語が頻出している。なんだそりゃ？

これも重要らしいので、もう少しVoPを検討してみるか。
手っ取り早い導入としては、全ての割当てではなく、
割当量更新時のみFoCだかVoCのEMAを更新すると近い感じになるかもしれない。
リスタートの時にその値を利用するという方針なら試していないはず。

## Reason-Side Rate(Rewarding)

これはCaDiCaLとは関係ないけど、Conflict History Based Branching (CHB)の論文で出てきた考え。
依存グラフの学習節のその先にも報酬を与えようとするもの。
実際実装してみるとよくなることもある。なんでだろう？　簡単に書いてあるのでどうしてなのか考えないとい
けない。逆向きの伝播を促すのか？だったら逆向きにでパンパした場合にfirstUIPになる可能性が高い
束の上限節に当たるリテラルだけ報酬を与えてもよさそうだが、やってみたらむしろ何もしない時よりも悪くなった。
