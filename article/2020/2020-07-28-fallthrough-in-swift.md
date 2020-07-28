---
title: fallthroughについて
subtitle: Swift
date: 2020-07-28
tags: ["Swift"]
---
The programming Language Swift 5.3beta を読んでいて、`fallthrough` に関するちょっと信じられない記述を目にした。

> rogram execution continues to the next case even if the patterns of the case label do not match the value of the switch statement’s control expression.

playgroundで実行してみた。

```swift
var x = 1

switch x {
    case 1: print(1)
            fallthrough
    case 2: print(2)
    default: break
}
```

実行すると

```text
1
2
```

だと。記述は間違ってなかった@_@。
