---
title: New Implementation of vivification on Splr
subtitle: vivification part 4
date: 2021-04-10
tags: ["SAT", "vivification", "splr"]
banner: https://unsplash.com/photos/GWtOJTUyDfc/download?force=true&w=2400
banner_caption: https://unsplash.com/photos/GWtOJTUyDfc
---

Splr-0.7.1で発見された決定性誤りバグの一因がどうもvivificationにあるようなので、徹底的に見直してみた。
その結果、バグ修正の副産物として大変更に至りました。

これまではひたすら論文のオリジナル疑似コードに忠実な実装を心がけていた。

![](/img/2020/07-05/vivi-algo3.jpg)

見ての通り、節を追加して伝播させて、節を削除して、ということを繰り返している。
そのためsandboxなんてものをサブモジュールに追加したりしていたのだけど、この"clause vivification"とは

- 節に含まれるリテラルを順に否定して行った時に、いくつ目のリテラルで（この節ひいては式が）矛盾するかを考え、それ以上のリテラルはあっても無駄なので省きましょう

というだけのこと。だったらこの通りに実装すればいいんじゃない？

```rust
  let c = cdb.clause[cid];
  for (i, lit) in c.lits.iter().enumerate() {  // 順番に
    asg.assign_by_decision(!lit); // 否定してみて
    if asg.propagate().is_some()  // 矛盾した時に
       && i < c.lits.len() // 短くなっていたら
    {
      cdb.strengthen_by_vivification(cid, i);  // iまでのリテラルに縮退
      break;
    }
  }
  asg.cancel_until(self.root_level); // クリーンアップ
```

節の出し入れが一切なくなってclauseDB的な負荷が一切消えてしまった!
これで決まりだな。
