---
title: New Implementation of vivification on Splr
subtitle: vivification part 4
date: 2021-05-04
tags: ["SAT", "vivification", "splr"]
banner: https://unsplash.com/photos/GWtOJTUyDfc/download?force=true&w=2400
banner_caption: https://unsplash.com/photos/GWtOJTUyDfc
---
### 2021-04-10

Splr-0.7.1で発見された決定性誤りバグの一因がどうもvivificationにあるようなので、徹底的に見直してみた。
その結果、バグ修正の副産物として大変更に至りました。

これまではひたすら論文[1]のオリジナル疑似コードに忠実な実装を心がけていた:

![](/img/2020/07-05/vivi-algo3.jpg)

ここで`confilctAnalysis`の引数は

1. $\phi$ -- 論理式式
1. $D$ -- 仮定されたリテラル列（なぜtrailではいけないのだろう）
1. $R$ - 矛盾節

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

### 2021-04-16

そしてこれがSplr-0.7.1がさらに1週間リリースできなかった原因になってしまった。
うん、全くダメな考えだった。論外だった。

### 2021-05-04

だめじゃない。ダメなのは矛盾解析の部分で、決定リテラルを積み重ねるこの方法はずっとスマートな気がしてきた。少なくとも、これがSplr-0.7.1におけるvivificationの決定性判定間違いの原因ではない。


## References

[1] C.-M. Li, F. Xiao, M. Luo, F. Manyà, Z. Lü, and Y. Li, “Clause Vivification by Unit Propagation in CDCL SAT Solvers,”* Artif. Intell*., vol. 279, Jul. 2019.
