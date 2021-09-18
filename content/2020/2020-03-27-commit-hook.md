---
title: pre.commit hook for Rust project
subtitle: check with 'cargo fmt'
date: 2020-03-27
tags: ["Rust"]
---
commitする前にフォーマットをチェックするための `.git/hooks/pre.commit`。
github gistで拾ったもの。

```bash
#!/bin/bash

diff=$(cargo fmt -- --check)
result=$?

if [[ ${result} -ne 0 ]] ; then
    cat <<\EOF
There are some code style issues, run `cargo fmt` first.
EOF
    exit 1
fi

exit 0
```
