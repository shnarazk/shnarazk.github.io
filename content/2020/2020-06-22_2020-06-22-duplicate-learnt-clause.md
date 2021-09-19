---
title: Duplicate Learnt Clauses
extra:
  subtitle: ECAI 2020
taxonomies:
  tags: ["SAT"]
---
Google Scholar alert 発令。今日のお題は「重複した学習節による速度向上」！？

* S. Kochemazov, O. Zaikin, A. Semenov, and V. Kondratiev, "Speeding Up CDCL Inference With Duplicate Learnt Clauses," *24th European Conference on Artificial Intelligence - ECAI2020*, 2020.

duplicateは複数持つのではなく何度でも現れるという意味だ。
そのような節を削除せずに保持することで求解数が向上する（そういう問題セットが存在する）とのこと。
論文ではHash表を使って再出現を検知しようとしているようだ。
LBDによる層化は必ずしも正しいとは限らないと。

変数に比べ節の尺度はそれほど注意が払われてなかったかもしれない。
LBDに依らない尺度を検討するなら、変数活性度の流用だろうか。
ちょっと試してみるとそれほど悪くないような。

あう、[vivification](/2020/2020-06-20-vivification/)前提か。うーん、実装を急がねば。。。


