---
title: JIS配列のMacbookの右commandで日本語入力モードのトグル
subtitle:
date: 2021-06-11
tags: ["macOS"]
---
## hidutilでなんとかしよう

US配列だと基本は(macbookでは)、こういうので日本語入力モードを切り替えることができる。

```
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x7000000e7,"HIDKeyboardModifierMappingDst":0x700000068}]}'
```

いや、もしかしてこれはbluetooth接続のmagic keyboardようかもしれない（最近OSのバージョンが上がって依然と変わってしまった。）

これと同じことをJIS配列のmacbook（支給品）でもやりたいのだが、世の中に逆行しているので、自分で検証しなければならなかったのでメモ。

まずは一次資料： https://developer.apple.com/library/archive/technotes/tn2450/_index.html#//apple_ref/doc/uid/DTS40017618-CH1-KEY_TABLE_USAGES

上に出てきたキーから解釈していくと：

| code |                 key |
|-----:|--------------------:|
|   e7 |  Keyboard Right GUI |
|   68 |  Keyboard F13       |

なんとコマンドキーとはGUIキーなのか。

次にどこかで使ったことがある別の設定：

```
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x7000000e7,"HIDKeyboardModifierMappingDst":0x700000039 }]}'
```

| code |                 key |
|-----:|--------------------:|
|   39 |  Keyboard Caps Lock |

これは特に設定のいらない入力切り替えキーの一つCaps Lockに割り当てている。
これはそのまま使えたので、スペースキーの隣の隣は入力ソースの切り替えに使えるようになった。


それでは「かな」のcodeが分かれば念願のスペースキーの隣で切り替えできるのだが、これを調べるのが大変。
全部調べたと言っておきながら「かな」がない日本語記事のなんと多いことか。
なんとか[それらしいの](https://qiita.com/nariya/items/0065c630653573ae7268)を探し出してきた。

| code |                 key |
|-----:|--------------------:|
|   90 |       Japanese Kana |
|   91 |                英数 |

ドンピシャ。

```
hidutil property --set '{"UserKeyMapping":[{"HIDKeyboardModifierMappingSrc":0x700000090,"HIDKeyboardModifierMappingDst":0x700000039 }]}'
```

これで幸せ。
