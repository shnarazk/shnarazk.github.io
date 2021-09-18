---
title: Running Glucose in benchmark mode
subtitle: Glucoseのベンチマークがしたい
date: 2019-03-04
tags: ["glucose", "SAT"]
---

Using my [patched](https://gitlab.com/satisfiability01/glucose/tree/v.4.1) glucose, we can get more useful result.

```
glucose -cpu-lim=TIMEOUT -verb=0 a.cnf result.file
```

- `-cpu-lim=TIMEOUT` ; you can't insert whitespaces.
- no progress report if `verb`== 0.

Now the result file contains the stats information.

```
c restarts              : 2 (2201 conflicts in avg)
c blocked restarts      : 0 (multiple: 0) 
c last block at restart : 0
c nb ReduceDB           : 1
c nb removed Clauses    : 994
c nb learnts DL2        : 22
c nb learnts size 2     : 0
c nb learnts size 1     : 0
c conflicts             : 4403           (83932 /sec)
c decisions             : 5285           (0.00 % random) (100745 /sec)
c propagations          : 184690         (3520654 /sec)
c nb reduced Clauses    : 0
c CPU time              : 0.052459 s
-1 2 -3 -4 5 -6 -7 ...
```

Nice!

### remaining parts

Let's run on the benchmark suit.

```
parallel -j1 "glucose -cpu-lim=5000 -verb=0 {} .ans_{/}" ::: SAT-COMPETITION/*.cnf
```

Then gather the results into a csv.

```rust
fn main() { ...
    for e in fs::read_dir(...)? {
        let f = e?;
        if f.file_name().to_string_lossy().starts_with(".ans_") {
            if let Some(t) = read_time(...) {
                hash.insert(f, t);
                break;
            }
         }
    }
    ...
}

fn read_time(input: ... ) -> Option<f64> {
    let re = Regex::new(r"c CPU time +: ([.0-9]+)").expect("wrong regex");
    let mut buf = String::new();
    while let Ok(k) = input.read_line(&mut buf) {
        if k == 0 {
            break;
        }
        if let Some(c) = re.captures(&buf) {
            if let Ok(v) = c[1].parse::<f64>() {
                return Some(v)
            }
        }
        buf.clear();
    }
    None
}
```


