---
title: Clause Vivification updated 2020
subtitle: vivification part 2
date: 2020-08-15
tags: ["SAT", "vivification", "splr"]
banner: "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
---
**cover image: https://unsplash.com/photos/-IMlv9Jlb24**

Version 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。
SAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。
vivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。

## 1. gratgenのこういうメッセージがどうやっても解消できない

```text
c Ignoring deletion of non-existent clause (pos 30441)
c Ignoring deletion of non-existent clause (pos 30441)
c Ignoring deletion of non-existent clause (pos 30441)
```

うーん、そんなはずはないのだが。。。

答え：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。

## 2. なぜかAssignStack中に未割り当てリテラルが出現する



