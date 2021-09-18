---
title: JIS配列のMacbookのかなキーで日本語入力モードをトグルしたい
date: 2021-06-11
extra:
  subtitle: 少しでもLinuxのカスタムキーボードに近づけたい
taxonomies:
  tags: ["macOS"]
---
## hidutilでなんとかしよう

US配列だと基本は(macbookでは)、こういうので日本語入力モードを切り替えることができる。

```
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x7000000e7,"HIDKeyboardModifierMappingDst":0x700000068}]}'
```

あるいは、最近だとmagic keyboardが対象だと下のようになる（以前は上ので問題なかったのだけど、OSのバージョンが上がって何か変わってしまったようだ）。

```
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x7000000e7,"HIDKeyboardModifierMappingDst":0x700000039}]}'
```

これと同じことをJIS配列のmacbook（支給品）でもやりたいのだが、少数派の意見なので、自分で検証しなければならなかった。
ということでメモ。

まずは[一次資料](https://developer.apple.com/library/archive/technotes/tn2450/_index.html#//apple_ref/doc/uid/DTS40017618-CH1-KEY_TABLE_USAGES)で上に出てきたキーを解釈していく。

| code |        key |
|-----:|-----------:|
|   39 |  Caps Lock |
|   68 |        F13 |
|   e7 |  Right GUI |

なんとコマンドキーとはGUIキーなのか。
39は特に設定のいらない入力切り替えキーCaps Lockに割り当てているだけだ。

このe7を39に割り当てる方法はそのまま使えたので、スペースキーの隣の隣を入力ソースの切り替えに使えるようにするのは簡単だった。

あとは「かな」のcodeが分かれば念願のスペースキーの隣で切り替えできるのだが、これを調べるのが大変だった。
全部調べたと言っておきながら「かな」がないblogがなんと多いことか。
なんとか[それらしいの](https://qiita.com/nariya/items/0065c630653573ae7268)を探し出してきた。

| code |            key |
|-----:|---------------:|
|   90 |  Japanese Kana |
|   91 |           英数 |

やってみるとドンピシャ。

```
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000090,"HIDKeyboardModifierMappingDst":0x700000039}]}'
```

これで幸せ。
