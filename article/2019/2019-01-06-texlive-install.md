---
title: Memo about installing Texlive
subtitle: latex日本語環境を設定
date: 2019-01-06
tags: ["latex"]
---

### Bootstapping my Japanese env.

1. tlmgr update --self --all
2. tlmgr install collection-langjapanese
3. tlmgr install collection-latexextra
4. tlmgr install latexmk

/usr/local/texlive/* が自分の管理下ならsudoは不要．

### macでのパス

- 実行ファイル: PATH=$PATH:/Library/TeX/texbin
- スタイルファイルなど: Library/texmf/tex/latex

----

参考

- https://texwiki.texjp.org/?BasicTeX
