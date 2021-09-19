---
title: Swiftのfallthroughについて
extra:
  subtitle: なんてこったい
taxonomies:
  tags: ["Swift"]
---
*The Swift Programming Language -- Swift 5.3 Edition (beta)* を読んでいて、`fallthrough` に関するちょっと信じられない記述を目にした。

> Program execution continues to the next case even if the patterns of the case label do not match the value of the switch statement’s control expression.

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

```txt
1
2
```

だと。記述は間違ってなかった@_@。

# 2020-08-30

なんてことを書いてから一ヶ月経ちますが、その間にあったLinux 5.9での大量のコード修正の話題を読んで、やっと「C言語がそもそもそうだった」ということを思い出しました。
原典に忠実なだけだったのか。うーん。しまった。
