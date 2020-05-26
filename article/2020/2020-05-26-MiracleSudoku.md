---
title: What's Miracle Sudoku?
subtitle: for a SAT solver developer
date: 2020-05-26
tags: ["SAT", "splr"]
banner: "https://images.unsplash.com/photo-1511689774932-3aca18459e68?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1234&q=80"
---

25日のHacker's Newsで初めて知ったMiracle Sudoku。長いビデオを見ずに知るところは

* Normal Sudoku rules apply.
* ナイトまたはキングが1hopで行ける場所には同じ数は置けない: Any two cells separated by a knight's move or a king's move (in chess) cannot contain the same digit.
* 近接した対角線には連続する数列は置けない: Any two orthogonally adjacent cells cannot contain consecutive digits.

[The Guardian 2020-05-22](https://www.theguardian.com/lifeandstyle/video/2020/may/22/cracking-the-cryptic-sudoku-solvers-become-unlikely-youtube-sensation-video)

さあSATソルバの出番。

# CNF生成

under construction 土曜日もくもくかな？
