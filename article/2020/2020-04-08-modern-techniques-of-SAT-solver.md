---
title: Importance of modern techniques in SAT solvers
subtitle: A case of CaDiCal
date: 2020-04-08
tags: ["Cadical", "Splr", "SAT"]
---

さあ[CaDiCaL](https://github.com/arminbiere/cadical)がなぜ速いのか検討しよう。
CaDiCalのbool型のオプションを一つづつ外して、[SAT-bench](https://github.com/shnarazk/SAT-bench)を使ってUF250とUUF250の実行速度を計測してみた。以下が結果の生データ。

| Technique          |     SAT   |    UNSAT  |
| -----------------  | --------: | --------: |
| arena              |  67.276   |  411.603  |
| arenacompact       |  72.570   |  385.086  |
| arenasort          |  64.913   |  403.137  |
| binary             |  65.285   |  400.457  |
| bump               | *TIMEOUT* | *TIMEOUT* |
| bumpreason         |  73.502   | *TIMEOUT* |
| checkassumptions   |  65.905   |  395.175  |
| checkfailed        |  65.343   |  394.922  |
| checkproof         |  65.450   |  393.980  |
| checkwitness       |  65.381   |  393.769  |
| chronoreusetrail   |  64.292   |  393.042  |
| compact            |  65.512   |  393.734  |
| decompose          |  68.543   |  396.974  |
| deduplicate        |  65.446   |  396.366  |
| eagersubsume       |  78.028   |  394.733  |
| elim               |  75.681   |  384.247  |
| elimands           |  67.227   |  402.034  |
| elimbackward       |  66.500   |  399.709  |
| elimequivs         |  65.709   |  398.184  |
| elimites           |  66.295   |  400.141  |
| elimlimited        |  65.861   |  393.830  |
| elimsubst          |  65.375   |  393.759  |
| elimxors           |  65.207   |  393.136  |
| inprocessing       |  55.999   |  374.042  |
| instantiateonce    |  65.360   |  393.572  |
| lucky              |  70.052   |  388.465  |
| minimize           |  84.862   | *TIMEOUT* |
| phase              |  81.518   |  386.279  |
| probe              |  63.664   |  390.642  |
| probehbr           |  67.185   |  393.756  |
| reduce             |  127.971  | *TIMEOUT* |
| rephase            |  128.430  |  376.436  |
| restart            |  38.578   | *TIMEOUT* |
| restartreusetrail  |  68.626   |  400.377  |
| score              |  88.269   | *TIMEOUT* |
| shufflequeue       |  66.147   |  399.462  |
| shufflescores      |  65.964   |  396.335  |
| simplify           |  56.229   |  374.795  |
| stabilize          |  128.038  | *TIMEOUT* |
| stabilizephase     |  86.403   |  367.847  |
| subsume            |  66.877   |  375.520  |
| subsumelimited     |  64.952   |  391.814  |
| subsumestr         |  59.750   |  392.570  |
| ternary            |  64.958   |  403.329  |
| transred           |  66.878   |  394.866  |
| vivify             |  58.933   |  372.927  |
| walk               |  130.862  |  386.060  |
| walknonstable      |  87.557   |  394.616  |

SAT, UNSATに分けてそれぞれ重要度でソートしたものが以下。

| Technique          |     *SAT* |    -----  |  done |
| -----------------  | --------: | --------: | ----- |
| bump               | *TIMEOUT* | *TIMEOUT* | 0.1.0 |
| walk               |  130.862  |  386.060  |       |
| rephase            |  128.430  |  376.436  | 0.3.3 |
| stabilize          |  128.038  | *TIMEOUT* | 0.3.3 |
| reduce             |  127.971  | *TIMEOUT* | 0.1.0 |
| score              |  88.269   | *TIMEOUT* | 0.1.0 |
| walknonstable      |  87.557   |  394.616  |       |
| stabilizephase     |  86.403   |  367.847  |       |
| phase              |  81.518   |  386.279  | 0.1.0 |

| Technique          |     ---   |   *UNSAT* |  done |
| -----------------  | --------: | --------: | ----- |
| bump               | *TIMEOUT* | *TIMEOUT* | 0.1.0 |
| stabilize          |  128.038  | *TIMEOUT* | 0.3.3 |
| reduce             |  127.971  | *TIMEOUT* | 0.1.0 |
| score              |  88.269   | *TIMEOUT* | 0.1.0 |
| minimize           |  84.862   | *TIMEOUT* | 0.1.0 |
| bumpreason         |  73.502   | *TIMEOUT* |       |
| restart            |  38.578   | *TIMEOUT* | 0.1.0 |

ということで今後何やるべきかが見えてきた。

- bumpreason -- bump reason literals too
- walk -- enable random walks
- walknonstable -- walk in non-stabilizing phase
- stabilizeとstabilizephaseは何が違うんだろう。わかってない。

さあ1日1実装だ。

## Appendix

```shell
#!/bin/zsh
parallel -k -j1 'sat-bench -Q -M \\{} --options \\{}=false -3 -U 250 cadical' ::: \
 --arena \
 --arenacompact \
 --arenasort \
 --binary \
 --bump \
 --bumpreason \
 --checkassumptions \
 --checkfailed \
 --checkproof \
 --checkwitness \
 --chronoreusetrail \
 --compact \
 --decompose \
 --deduplicate \
 --eagersubsume \
 --elim \
 --elimands \
 --elimbackward \
 --elimequivs \
 --elimites \
 --elimlimited \
 --elimsubst \
 --elimxors \
 --inprocessing \
 --instantiateonce \
 --lucky \
 --minimize \
 --phase \
 --probe \
 --probehbr \
 --reduce \
 --rephase \
 --restart \
 --restartreusetrail \
 --score \
 --shufflequeue \
 --shufflescores \
 --simplify \
 --stabilize \
 --stabilizephase \
 --subsume \
 --subsumelimited \
 --subsumestr \
 --ternary \
 --transred \
 --vivify \
 --walk \
 --walknonstable
```

```
arena,             67.276,  411.603
arenacompact,      72.570,  385.086
arenasort,         64.913,  403.137
binary,            65.285,  400.457
bump,              TIMEOUT, TIMEOUT
bumpreason,        73.502,  TIMEOUT
checkassumptions,  65.905,  395.175
checkfailed,       65.343,  394.922
checkproof,        65.450,  393.980
checkwitness,      65.381,  393.769
chronoreusetrail,  64.292,  393.042
compact,           65.512,  393.734
decompose,         68.543,  396.974
deduplicate,       65.446,  396.366
eagersubsume,      78.028,  394.733
elim,              75.681,  384.247
elimands,          67.227,  402.034
elimbackward,      66.500,  399.709
elimequivs,        65.709,  398.184
elimites,          66.295,  400.141
elimlimited,       65.861,  393.830
elimsubst,         65.375,  393.759
elimxors,          65.207,  393.136
inprocessing,      55.999,  374.042
instantiateonce,   65.360,  393.572
lucky,             70.052,  388.465
minimize,          84.862,  TIMEOUT
phase,             81.518,  386.279
probe,             63.664,  390.642
probehbr,          67.185,  393.756
reduce,            127.971, TIMEOUT
rephase,           128.430, 376.436
restart,           38.578,  TIMEOUT
restartreusetrail, 68.626,  400.377
score,             88.269,  TIMEOUT
shufflequeue,      66.147,  399.462
shufflescores,     65.964,  396.335
simplify,          56.229,  374.795
stabilize,         128.038, TIMEOUT
stabilizephase,    86.403,  367.847
subsume,           66.877,  375.520
subsumelimited,    64.952,  391.814
subsumestr,        59.750,  392.570
ternary,           64.958,  403.329
transred,          66.878,  394.866
vivify,            58.933,  372.927
walk,              130.862, 386.060
walknonstable,     87.557,  394.616

```
