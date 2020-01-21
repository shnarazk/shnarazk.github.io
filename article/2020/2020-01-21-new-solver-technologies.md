---
title: New technologies for SAT solvers
subtitle: from SR2019
date: 2020-01-21
tags: ["SAT"]
---
遅ればせながらSR2019のベンチマークを見てみた。

## CaDiCaL

デフォルト設定のみのエントリーで3位に位置するソルバ。Biere先生のソルバだった。

- chronological backtrack
- dual restart mode
- improving phase Saving

といったところが主に使っている技術。

## Chronological Backtrack

まだチェックしてないがSC2018以降のトレンドみたい。こんな発想はなかった。
リスタートの抑制よりもさらに網羅的に探索するということか。原著は以下：

A. Nadel and V. Ryvchin. Chronological backtracking.
In *Theory and Applications of Satisfiability Testing - SAT 2018. Proceedings*, 2018.

## Dual Restart Mode

リスタートしないモードがUNSAT問題に効くので、リスタート戦略を切り替える技術。
ということはdeep searchが正当化されるかもしれない。
インターリーブはうまくいかない印象なんだけど。

## Improving Phase Saving

一番よかったphaseセットを覚えておくという、VoPに似た感じの技術。ただしこれまでのものと併用。

全ての割当てではなく、割当量更新時のみEMAを更新すると近い感じになるかもしれない。
これは試していない。
