---
title: Building emacs-mozc with yay
extra:
  subtitle: yayで"aura --hotedit"に相当するオプションは?
taxonomies:
  tags: ["archlinux", "emacs"]
---

Arch linuxでemacs-mozcを生成するにはmozcのPKGBUILDを修正する必要がある．
yayでそうするには以下のようなオプションが必要．

```
$ yay -S mozc --editmenu
```

ここで`--editmenu`だけを与えると，デフォールトの`-Syu`がなくなって何も実行しなくなるので注意．
