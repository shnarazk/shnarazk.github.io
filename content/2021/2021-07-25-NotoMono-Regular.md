---
title: luaLatex-jaでNotoMono-Regularを使いたい
subtitle: それもttfなやつを
date: 2021-07-25
tags: ["font", "latex"]
---
lualatexの個人共通設定ファイルでゴシック系の文章に対して以下の設定をしています。

```latex
\setmainjfont[
    BoldFont={NotoSansCJKjp-Bold},
    YokoFeatures={JFM=prop,Kerning=On},
    AutoFakeSlant=0.2,
    SlantedFeatures={FakeSlant=0.2},
    BoldItalicFeatures={FakeSlant=0.2},
    BoldSlantedFeatures={FakeSlant=0.2}]
  {NotoSansCJKjp-Regular}
```

で、等幅フォントに関してはこちら。


```latex
\setmonofont[
    BoldFont={NotoSansMono-Bold},
    AutoFakeSlant=0.2,
    SlantedFeatures={FakeSlant=0.2},
    BoldItalicFeatures={FakeSlant=0.2},
    BoldSlantedFeatures={FakeSlant=0.2}]
 {NotoMono-Regular}
```

しかし何故かこの設定のせいでlatexを走らせる度に以下のコマンドが実行される。

```
luaotfload | db : Reload initiated (formats: otf,ttf,ttc); reason: Font "NotoMono-Regular" not found.
```

これはいけない。SSD が消耗してしまうではないか。
と思いつつ長い間ほったらかしにしていたけど、ようやく今日対応しました。

- `NotoSansCJKjp-Regular`に対応するのはotfファイルで中に名前っぽいもの（フォントの属性指定に使えそうなやつ）が入っている
-  `NotoMono-Regular`に対応するのはttfファイルでざっとみた感じではその中には名前っぽいものがない
- だったらと思ったが[google](https://www.google.com/get/noto/#mono-mono)にはNotoMonoのotfファイルは置いてない

ということで以下のように変更すると、問題解決。キャッシュが生きるようになりました。

```latex
\setmonofont[
    BoldFont={NotoSansMono-Bold},
    AutoFakeSlant=0.2,
    SlantedFeatures={FakeSlant=0.2},
    BoldItalicFeatures={FakeSlant=0.2},
    BoldSlantedFeatures={FakeSlant=0.2}]
 {NotoMono-Regular.ttf}
```

これで気持ちよくTUG2021に参加できる（それは関係ない）。