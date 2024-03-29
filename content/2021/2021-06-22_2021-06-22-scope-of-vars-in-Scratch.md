---
title: Scratchでの変数のスコープ
extra:
  subtitle: as a concurrent programming language
  banner: /2021/06-22-scratch/shared-var.png
taxonomies:
  tags: ["Scratch"]
---
Scratchはイベント発火やメッセージベースで同期を取るマルチスレッドシステムとしてコーディングするのが簡単。
これだとあまり変数の必要性を感じない。
ただし、高度なことをするためにはもちろん関数や変数による状態管理をせざるを得ない。

で、変数を定義するのだけども、定義時にのみ共有レベルが指定できる。

![](/2021/06-22-scratch/define-var.png)

ここでグローバルを選ばないと、その変数は他スプライトからは見えないのだろうが、ではクローンされたスレッド間ではどうなるのだろう。その理解が必要となる。

## 結論

- `すべてのスプライト用` -- 全てのスプライト、全てのクローンで共有。完全にglobal。
- `このスプライトのみ` -- スコープはこのスプライトのみ、スプライトのクローンにより変数もクローンされる。従ってthread local storageに対応。

従って、各スプライト(弾幕を作るためクローンされる)が3次元座標を持ち、2次元投影関数で表示を行うなら、

- 各スプライトの座標はスプライトローカル
- 投影関数はローカル（ブロック定義は常にスレッド（スプライト）ローカル）
- 呼び出し時に座標を引数として渡す

ということになる。
問題は関数内ローカル変数なのだが、このままだとスプライトが変わるたびに再定義しなければならない。

![](/2021/06-22-scratch/func1.png)

うーん。
誰もスプライトはアクセスしないとみなして、この関数のみがworking areaとして使う大域変数
(見えてしまうけどもstatic領域みたいな)とするのが実際的な落とし所だろうか。

コメント：ノンプリエンプティブならこれでOK。

### 別案

この作業用ローカル変数も関数の引数で渡してしまうというやり方は使えるだろうか。スマートだろうか。

```rust
fn swap(a: &mut usize, b: &mut usize, mut c: &mut usize) {
  *c = *a;
  *a = *b;
  *b = *c;
}
```

![](/2021/06-22-scratch/func2.png)

あ、代入文で選択できない！引数はimmutableに決定か。
