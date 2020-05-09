---
title: What's 's-l'?
subtitle: used in lsp-mode
date: 2020-05-09
tags: ["Emacs"]
---
lsp-modeがプレフィックスとして採用している`'s-l'`とは一体なんなんだ？

's'は`Super`かとも思うのだがだったら大文字ではないのか？　いや、それならShiftになる。。。
`Super`のつもりで`Option`キーを押してみても反応ない。。。

ググってわかった。やはり`Super`だった。macのコンソールに入力できてないだけだった。
と思ったらちゃんと[入力方法が用意してあった](https://emacs.stackexchange.com/questions/55199/what-are-these-prefix-commands-that-start-with-s-l)。

>>> You can simulate these additional keys with some built-it sequences:
>>>   C-x @ h adds the Hyper flag to the next character, C-x @ s adds the Super flag

ストローク数はしょうがないが、入力できるのが素晴らしい。ALT(ESC)も当然`C-x @ m`だった(META)。

ともかく疑問解決してよかった。


