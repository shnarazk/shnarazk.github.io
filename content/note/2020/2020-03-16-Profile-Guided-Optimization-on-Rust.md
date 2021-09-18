---
title: Profile Guided Optimization on Rust
subtitle: (rustc-1.42.0)
date: 2020-03-16
tags: ["Rust"]
---
[The rustc book](https://doc.rust-lang.org/rustc/index.html)に
[profile guided optimization](https://doc.rust-lang.org/rustc/profile-guided-optimization.html)
のわかりやすい説明があったのでSplrでやってみた。

```
DATA=./pgo-data
MERGED=/tmp/merged.profdata

# STEP 0: Make sure there is no left-over profiling data from previous runs
rm -rf ${DATA}
mkdir ${DATA}

# STEP 1: Build the instrumented binaries
RUSTFLAGS="-Cprofile-generate=${DATA}" cargo build --release

# STEP 2: Run the instrumented binaries with some typical data
./target/release/splr --to 1000 --quiet ../SC/T56.2.0.cnf
./target/release/splr --to 1000 --quiet ../SR/26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
./target/release/splr --to 1000 --quiet ../SR/f6nidw-sc2012.cnf

# STEP 3: Merge the `.profraw` files into a `.profdata` file
llvm-profdata merge -o ${MERGED} ${DATA}

# STEP 4: Use the `.profdata` file for guiding optimizations
#RUSTFLAGS="-Cprofile-use=${MERGED}" cargo install -f --path .
RUSTFLAGS="-Cprofile-use=${MERGED}" cargo build --release

# TEST RUN
./target/release/splr --to 1000 --quiet ../SC/T56.2.0.cnf
./target/release/splr --to 1000 --quiet ../SR/26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
./target/release/splr --to 1000 --quiet ../SR/f6nidw-sc2012.cnf
```

ここで`profile-use` で指定するファイルは`/tmp`に置かないと存在しないエラーになってしまった。macOS の
sandbox 化のせいだろうか、よくわからない。
また実行ファイルが正常終了しないとデータは使われないようなので、確実に求解できる CNF ファイルを指定してプロファイルを作成しなければならないようだ。

実行結果はこちら（生データは最後に付けます）。

| CNF | normal obj. | profiling obj. | profile guided |　pg/no |
| --- | ----------: | -------------: | -------------: | -----: |
|  A  |      509.45 |         591.59 |         501.86 | 0.9851 |
|  B  |      163.12 |         176.42 |         161.07 | 0.9874 |
|  C  |        7.30 |           9.25 |           7.13 | 0.9767 |
| SUM |      679.87 |         777.26 |         670.06 | 0.9831 |

* A: SC2018/T56.2.0.cnf  
* B: SR2019/26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
* C: SR2019/f6nidw-sc2012.cnf

裏で色々としながらの計測ではあるが、見ての通り1から2％程度の高速化だった。
うーーん、測定誤差程度かあ。

## 生データ

```
$ sh pgo
   Compiling proc-macro2 v1.0.9
   ...
   Compiling splr v0.3.2-dev.1 (/Users/nash/Repositories/splr)
    Finished release [optimized] target(s) in 1m 03s
T56.2.0.cnf                                3145220,10854665 |time:   591.59
 #conflict:     417842, #decision:      1198754, #propagate:        1616716
  Assignment|#rem:   573165, #fix:     6304, #elm:  2565751, prg%:  81.7766
      Clause|Remv:    84308, LBD2:    30005, Binc:  4813544, Perm:  3530977
     Restart|#BLK:     2970, #RST:      898, tASG:   0.1729, tLBD:   0.8118
    Conflict|eLBD:     4.83, cnfl:    37.97, bjmp:    36.67, rpc%:   0.2149
        misc|#rdc:       16, #sce:      145, core:      966, vdcy:   0.9131
    Strategy|mode: Generic (using a generic parameter set)
      Result|file: ./.ans_T56.2.0.cnf
UNSAT: ../SC/T56.2.0.cnf
26_stack_cas_longest_true-unreach-call.i-c 7807714,35975032 |time:   176.42
 #conflict:       1636, #decision:       558092, #propagate:         559729
  Assignment|#rem:  7802492, #fix:     2464, #elm:     2758, prg%:   0.0669
      Clause|Remv:     1144, LBD2:       98, Binc:  7781031, Perm: 35968175
     Restart|#BLK:       31, #RST:        0, tASG: 781.1437, tLBD:   0.9137
    Conflict|eLBD:     6.26, cnfl:   227.46, bjmp:   224.67, rpc%:   0.0000
        misc|#rdc:        1, #sce:        2, core:        0, vdcy:   0.9600
    Strategy|mode: Initial search phase before a main strategy
      Result|file: ./.ans_26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
SATISFIABLE: ../SR/26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
f6nidw-sc2012.cnf                             190399,564775 |time:     9.25
 #conflict:      96420, #decision:       238247, #propagate:         334674
  Assignment|#rem:    32849, #fix:     2853, #elm:   154697, prg%:  82.7473
      Clause|Remv:     7518, LBD2:      942, Binc:   376881, Perm:   206409
     Restart|#BLK:      432, #RST:       68, tASG:   0.9892, tLBD:   0.8494
    Conflict|eLBD:     4.65, cnfl:    17.02, bjmp:    15.92, rpc%:   0.0705
        misc|#rdc:        8, #sce:       18, core:      179, vdcy:   0.9623
    Strategy|mode: Initial search phase before a main strategy
      Result|file: ./.ans_f6nidw-sc2012.cnf
UNSAT: ../SR/f6nidw-sc2012.cnf
   Compiling proc-macro2 v1.0.9
   ...
   Compiling splr v0.3.2-dev.1 (/Users/nash/Repositories/splr)
    Finished release [optimized] target(s) in 44.58s
T56.2.0.cnf                                3145220,10854665 |time:   501.86
 #conflict:     417842, #decision:      1198754, #propagate:        1616716
  Assignment|#rem:   573165, #fix:     6304, #elm:  2565751, prg%:  81.7766
      Clause|Remv:    84308, LBD2:    30005, Binc:  4813544, Perm:  3530977
     Restart|#BLK:     2970, #RST:      898, tASG:   0.1729, tLBD:   0.8118
    Conflict|eLBD:     4.83, cnfl:    37.97, bjmp:    36.67, rpc%:   0.2149
        misc|#rdc:       16, #sce:      145, core:      966, vdcy:   0.9131
    Strategy|mode: Generic (using a generic parameter set)
      Result|file: ./.ans_T56.2.0.cnf
UNSAT: ../SC/T56.2.0.cnf
26_stack_cas_longest_true-unreach-call.i-c 7807714,35975032 |time:   161.07
 #conflict:       1247, #decision:       559271, #propagate:         560519
  Assignment|#rem:  7797316, #fix:     2464, #elm:     7934, prg%:   0.1332
      Clause|Remv:      757, LBD2:      103, Binc:  7781035, Perm: 35952651
     Restart|#BLK:       23, #RST:        0, tASG: 512.9724, tLBD:   0.9137
    Conflict|eLBD:     6.13, cnfl:   319.86, bjmp:   316.40, rpc%:   0.0000
        misc|#rdc:        1, #sce:        2, core:        0, vdcy:   0.9600
    Strategy|mode: Initial search phase before a main strategy
      Result|file: ./.ans_26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
SATISFIABLE: ../SR/26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
f6nidw-sc2012.cnf                             190399,564775 |time:     7.13
 #conflict:      96420, #decision:       238247, #propagate:         334674
  Assignment|#rem:    32849, #fix:     2853, #elm:   154697, prg%:  82.7473
      Clause|Remv:     7518, LBD2:      942, Binc:   376881, Perm:   206409
     Restart|#BLK:      432, #RST:       68, tASG:   0.9892, tLBD:   0.8494
    Conflict|eLBD:     4.65, cnfl:    17.02, bjmp:    15.92, rpc%:   0.0705
        misc|#rdc:        8, #sce:       18, core:      179, vdcy:   0.9623
    Strategy|mode: Initial search phase before a main strategy
      Result|file: ./.ans_f6nidw-sc2012.cnf
UNSAT: ../SR/f6nidw-sc2012.cnf
$
```

```
$ sh no-pgo
   Compiling proc-macro2 v1.0.9
   ...
   Compiling splr v0.3.2-dev.1 (/Users/nash/Repositories/splr)
    Finished release [optimized] target(s) in 1m 02s
T56.2.0.cnf                                3145220,10854665 |time:   509.45
 #conflict:     417842, #decision:      1198754, #propagate:        1616716
  Assignment|#rem:   573165, #fix:     6304, #elm:  2565751, prg%:  81.7766
      Clause|Remv:    84308, LBD2:    30005, Binc:  4813544, Perm:  3530977
     Restart|#BLK:     2970, #RST:      898, tASG:   0.1729, tLBD:   0.8118
    Conflict|eLBD:     4.83, cnfl:    37.97, bjmp:    36.67, rpc%:   0.2149
        misc|#rdc:       16, #sce:      145, core:      966, vdcy:   0.9131
    Strategy|mode: Generic (using a generic parameter set)
      Result|file: ./.ans_T56.2.0.cnf
UNSAT: ../SC/T56.2.0.cnf
26_stack_cas_longest_true-unreach-call.i-c 7807714,35975032 |time:   163.12
 #conflict:       1877, #decision:       462203, #propagate:         464081
  Assignment|#rem:  7785361, #fix:     2464, #elm:    19889, prg%:   0.2863
      Clause|Remv:     1383, LBD2:      125, Binc:  7781038, Perm: 35916790
     Restart|#BLK:       36, #RST:        0, tASG: 260.4156, tLBD:   0.8171
    Conflict|eLBD:     6.12, cnfl:   217.13, bjmp:   214.81, rpc%:   0.0000
        misc|#rdc:        1, #sce:        2, core:        0, vdcy:   0.9600
    Strategy|mode: Initial search phase before a main strategy
      Result|file: ./.ans_26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
SATISFIABLE: ../SR/26_stack_cas_longest_true-unreach-call.i-cbmc-u2-sc2016.cnf
f6nidw-sc2012.cnf                             190399,564775 |time:     7.30
 #conflict:      96420, #decision:       238247, #propagate:         334674
  Assignment|#rem:    32849, #fix:     2853, #elm:   154697, prg%:  82.7473
      Clause|Remv:     7518, LBD2:      942, Binc:   376881, Perm:   206409
     Restart|#BLK:      432, #RST:       68, tASG:   0.9892, tLBD:   0.8494
    Conflict|eLBD:     4.65, cnfl:    17.02, bjmp:    15.92, rpc%:   0.0705
        misc|#rdc:        8, #sce:       18, core:      179, vdcy:   0.9623
    Strategy|mode: Initial search phase before a main strategy
      Result|file: ./.ans_f6nidw-sc2012.cnf
UNSAT: ../SR/f6nidw-sc2012.cnf
```
