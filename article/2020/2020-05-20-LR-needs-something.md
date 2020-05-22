---
title: LR needs something te explore the world
subtitle: I guess so
date: 2020-05-21
tags: ["SAT"]
---
引き続きよくわかってない人の意見の連投ですが。

## LRのリスタート問題

LR はよさそうなんだけども、そんなにいいならリスタートの立場はどうなる？
矛盾発生率の最適化を達成していて何故リスタートが必要になるのだろうか。

しかし何かそのようなものが必要なことはすぐわかる。
以前も書いたような気がするがリスタートはリスタートであって、決してリセットではないのだ。
EVSIDS も含めた変数選択ヒューリスティックスは割当て後にその使われた変数に値を割り当てるもので、使われてない変数に脚光を当てるものではない。
従って、リスタートを掛けても優先度が高い変数間の順序が変わるだけと書いてもそれほど言い過ぎというわけではないだろう。
もちろん順序を入れ替えることによってリスタート後の伝播の方向がこれまでと違う方向へと向かうことはあるけども、いきなり極端に違う変数が選ばれるものではない（という去年の経験）。

さて、LRはあくまでみた事のある変数の中での順序づけであり、それが変数全体の中での最適解とはとても言えない。
そして、矛盾から生成される学習節の LBD 的なよさとも無関係である。
従って、もしLBD が悪い学習節が生成される傾向にあるならば、LRといえどもそれなりの対応が必要になるはずである。

それはどういうものかというと、

* 試していない変数の評価を行う（そのためには割当てを実行しなければならない）。そのためにはリスタートが必要。
* 単にそのような変数への割当て評価を行っただけでは、decay rateが高い状況では結局無視されてしまうので、decay rateの一時的な修正か何かが必要。

ということではなかろうか（decay rate を下げる云々は昨日の複数ヒューリスティックスの併用を念頭に置いている）。
いっそのことdecay rate の違う二つのLRを使おうか。あるいはdecay rateを初期値に戻そうか。。。

というわけでリスタートは実は不十分でさらにexploreのための補助となる仕組みが必要ではなかろうか、という作業仮説でした。

```rust
#[derive(Eq, Ord, PartialEq, PartialOrd)]
struct VarTimestamp {
    timestamp: usize,
    vi: VarId,
}

impl VarSelectIF for AssignStack {
    fn force_select_iter(&mut self, ...) {
        let mut heap: BinaryHeap<VarTimestamp> = BinaryHeap::new();
        let size: usize = todo!();
        for v in self.var.iter().skip(1) {
            if self.assign[v.index].is_some() || v.is(Flag::ELIMINATED) {
                continue;
            }
            if let Some(top) = heap.peek() {
                if v.timestamp < top.timestamp {
                    heap.push(VarTimestamp::from(v));
                    if size < heap.len() {
                        heap.pop();
                    }
                }
            }
        }
        for v in heap.iter() {
            let lit = Lit::from_assign(v.vi, self.var[v.vi].is(Flag::PHASE));
            self.temp_order.push(lit);
        }
    }
```

## 2020-05-21

うまくいかぬ。exploreの契機はworse LBDではないのかもしれない。

![](https://2.bp.blogspot.com/-hMADLxB1puo/VMIvawjKgWI/AAAAAAAAq8E/2bgLT3inaSk/s400/cooking15_rangiri.png)

