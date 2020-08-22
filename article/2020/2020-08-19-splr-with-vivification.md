---
title: Implementing clause vivification on Splr
subtitle: vivification part 3
date: 2020-08-22
tags: ["SAT", "vivification", "splr"]
banner: "https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
---
**cover image: https://unsplash.com/photos/-IMlv9Jlb24**

Version 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。
SAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。
vivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。

## 1. gratgenのこういうメッセージがどうやっても解消できない

```text
c Ignoring deletion of non-existent clause (pos 30441)
c Ignoring deletion of non-existent clause (pos 30441)
c Ignoring deletion of non-existent clause (pos 30441)
```

うーん、そんなはずはないのだが。。。

理由：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。

## 2. なぜかAssignStack中に未割り当てリテラルが出現する

理由：変数への仮割り当ての前提条件の検査が不十分だった。

## 3. 2020-08-21 記号の読み間違え判明

[Clause Vivification updated 2020](/2020/2020-07-05-vivification2/)に記載の通り。

## 4. vivify中に決定による割り当てを行っただけでcertificateが不当なものになってしまう

理由：Eliminatorがバグってた！

## 5. Eliminatorを直しても以下省略

理由：`cdb.detach(); cdb.garbage_collect();` が非常に怪しい。

## 6. `propagate`しなくてもおかしくなる

理由：節の追加削除しか原因はない。

## 7. Rule. 3の解釈が怪しい

> **Rule_3**: If $\text{UP}(\phi \cup \{\neg l_1, \ldots, \neg l_i \}) = \Box$, then $\phi \cup \{\neg l_1, \ldots, \neg l_i \}$ is unsatisfiable and clause $l_1 \vee \cdots \vee l_i$ is a logical consequence of $\phi$ and could replace $C$. However, as before, let $R$ be the set of literals of the falsified clause, $conflAnalysis(\phi, \neg C' \cup \{\neg l_i \}, R)$, which is a sub-clause of $l_1 \vee \cdots \vee l_i$ .

そもそも`conflict_analysis`の引数の解釈は大丈夫だろうか。なぜ3引数なのか。ということで論文より引用し直し。

![](/img/2020/08-19/Algorithm4_conflAnalysis.jpg)

![](/img/2020/07-05/vivi-algo3.jpg)

# 最終版

```rust
pub fn vivify(asg: &mut AssignStack, cdb: &mut ClauseDB) -> MaybeInconsistent {
    while let Some(ci) = clauses.pop() {
        let c: &mut Clause = &mut cdb[ci];
        let clits = c.lits.clone();
        let mut copied: Vec<Lit> = Vec::new();
        let mut flipped = true;
        'this_clause: for l in clits.iter() {
            match asg.assigned(*l) {
                Some(false) => continue 'this_clause, // Rule 1
                Some(true) => {
                    copied.push(!*l);
                    let r = asg.reason_literals(cdb, *l);
                    let mut v = Vec::new();
                    for lit in &*r {
                        if *lit == *l { v.push(!*lit); } else { v.push(*lit); }
                    }
                    copied = asg.minimize(cdb, &copied, &v); // Rule 2
                    flipped = false;
                    break 'this_clause;
                }
                None => {
                    asg.cancel_until(asg.root_level);
                    let cid: Option<ClauseId> = match copied.len() {
                        0 => None,
                        1 => {
                            asg.assign_by_decision(copied[0]);
                            None
                        }
                        _ => Some(cdb.new_clause(asg, &mut copied.clone(), true, false)),
                    };
                    asg.assign_by_decision(!*l);
                    let cc = asg.propagate(cdb);
                    if !cc.is_none() {
                        let r = cdb[cc].lits.clone(); // Rule 3
                        copied = asg.minimize(cdb, &copied, &r);
                        flipped = false;
                    }
                    asg.cancel_until(asg.root_level);
                    if let Some(cj) = cid { cdb.detach(cj); }
                    if !cc.is_none() { break 'this_clause; }
                    copied.push(!*l); // Rule 4
                }
            }
        }
        if flipped { flip(&mut copied); }
        match copied.len() {
            0 if flipped => return Err(SolverError::Inconsistent),
            0 => cdb.detach(ci),
            1 => {
                let l0 = copied[0];
                cdb.certificate_add(&copied);
                if asg.assigned(l0) == None {
                    asg.assign_at_rootlevel(l0)?;
                    if !asg.propagate(cdb).is_none() {
                        return Err(SolverError::Inconsistent);
                    }
                }
                cdb.detach(ci);
            }
            n if n == clits.len() => (),
            n => {
                cdb.new_clause(asg, &mut copied);
                cdb.detach(ci);
            }
        }
        clauses.retain(|ci| !cdb[ci].is(Flag::DEAD));
    }
    Ok(())
}
```
