---
title: lualatex-ja on ArchLinux
extra:
  subtitle: lualatex-jaが動かなくなった
taxonomies:
  tags: ["latex", "archlinux"]
---


```
ABD: EverySelectfont initializing macros)
(/usr/share/texmf-dist/tex/luatex/luatexja/patches/lltjdefs.sty(save: /home/nas
h/.texlive/texmf-var/luatex-cache/generic/fonts/otl/ipaexm.lua)(save: /home/nas
h/.texlive/texmf-var/luatex-cache/generic/fonts/otl/ipaexm.luc)(load cache: /ho
me/nash/.texlive/texmf-var/luatexja/extra_ipaexmincho.luc)
(/usr/share/texmf-dist/tex/luatex/luatexja/jfm-ujisv.lua)
! Number too big.
ltj@@jfont ->luafunction ltj@@jfont@inner 
                                          
l.53 \kanjiencoding{JY3}\selectfont
                                 \adjustbaseline
? 
```

`rm .texlive/texmf-var/lualatexja`

```
pacman -Qo /usr/share/texmf-dist/tex/luatex/luatexja/patches/lltjdefs.sty 
/usr/share/texmf-dist/tex/luatex/luatexja/patches/lltjdefs.sty は texlive-langjapanese 2018.47402-1 によって所有されています
```
