---
title: Kissat on macOS
subtitle: Abort!
date: 2021-08-31
tags: ["SAT"]
---
KissatをNix package化しようとして、OSの違いに阻まれてしまった。
こりゃ手に負えない。

```
$ ./result/bin/kissat ../SAT/kissat/test/cnf/add128.cnf proof                 
c ---- [ banner ] ------------------------------------------------------------
c                                                                             
c KISSAT SAT Solver                                                           
c Copyright (c) 2019-2021 Armin Biere JKU Linz                                
c                                                                             
c Version 2.0.0 unknown                                                       
c clang version 7.1.0 (tags/RELEASE_710/final) -W -Wall -O3 -DNDEBUG          
c Mon Aug 30 23:51:02 UTC 2021 Darwin demorgan.local 20.6.0 x86_64            
c                                                                             
c ---- [ proving ] -----------------------------------------------------------
c                                                                             
c opened and writing proof to DRAT file:                                      
c                                                                             
c   proof                                                                     
c                                                                             
c ---- [ parsing ] -----------------------------------------------------------
c                                                                             
c opened and reading DIMACS file:                                             
c                                                                             
c   ../SAT/kissat/test/cnf/add128.cnf                                         
c                                                                             
c parsed 'p cnf 2282 6586' header                                             
c closing input after reading 96737 bytes (94 KB)                             
c finished parsing after 0.00 seconds                                         
c                                                                             
c ---- [ solving ] -----------------------------------------------------------
c                                                                             
c  seconds switched rate      trail    variables                              
c         MB reductions conflicts glue      remaining                         
c          level restarts redundant irredundant                               
c                                                                             
c *  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           
c {  0.00  0 0 0 0  0 0   0   0 0% 0 6584 2280 100%                           
c i  0.00  0 128 0 0  0 128   1   0 11% 0 6584 2279 100%                      
c i  0.01  0 230 0 0  1 77   6   2 38% 1 6584 2277 100%                       
c -  0.01  0 260 0 1  8 9 301 206 60% 2 6576 2277 100%                        
c i  0.01  0 152 0 1 124 20 664 506 47% 2 6576 2263 99%                       
c }  0.02  0 149 1 1 220 30 1000 741 50% 2 6576 2263 99%                      
c [  0.02  0 0 1 1 220 0 1000 741 0% 0 6576 2263 99%                          
c O  0.02  0 143 1 1 220 31 1004 672 21% 2 6538 2263 99%                      
c i  0.02  0 199 1 1 220 41 1009 675 55% 2 6538 2261 99%
c i  0.02  0 169 1 1 220 24 1025 682 38% 2 6538 2257 99%
../src/proof.c:269: check_repeated_proof_lines: Coverage goal `proof->units[punit]' reached.
c caught signal 6 (SIGABRT)
c
```

## 2021-09-07

手に負えないと思ったけど、ちょっとだけコードを追ってみると単なる境界条件の判定ミスだ。
丁寧な表現でissue立てたけど返事がこん。
今週返事がなければ修正パッチ込みでNixパッケージ化しよう！
