---
title: Comparison of luajitlatex and lualatex in TexLive2018
subtitle: luajitlatexはlualatexより速いのか
date: 2018-06-30
tags: ["latex"]
---

つい最近までluajittexを知らなかったので、lualatexとluajitltexの速度比較をしてみます．

- 対象：50ページを超えるbeamerプレゼンテーションスライド
- Version: TexLive2018 x86_64-linux
- Env.: ArchLinux, 16GB, SSD
- 環境変数`TIMEFORMAT="%2U"`
- 種々のキャッシュを活かすため１回目の実行結果は対象外

```txt
$ make clean; time lualatex presen.tex > /dev/null
18.31
17.74
17.99
```

※ make cleanの内容は `rm -f *.pdf *.aux *.log *.nav *.snm *.toc *.vrb`

```txt
$ make clean;time luajittex --fmt=luajitlatex.fmt presen.tex > /dev/null
43.91
44.67
44.90
```

予想に反してjit版の方が2倍強遅いという結果になってしまった．なにか勘違いしている？
それともluatexはlua 5.2ベースなのに対して，luajittexはlua5.1ベースだそうだが，そのせいなのだろうか．

ではもしかしてluatex53は何か期待できる？

```txt
$ make clean;time luatex53 --fmt=lualatex.fmt presen.tex > /dev/null
16.34
16.21
16.28
```

1秒強速くなった．今回の環境ではこれが最速．

この程度の違いでも何度もlatexを走らせるlatexmkで評価するとそれなりの差になってくる．
実際に`$pdflatex`の定義をこの２つで変えて実行してみると以下の結果．

latexmk  | run 1 | run 2 
---------|-------|-------
luatex53 | 63.33 | 63.63 
luatex   | 69.53 | 69.85 

うーむ．では .latexmkrc には luatex53 を登録しておこう．
