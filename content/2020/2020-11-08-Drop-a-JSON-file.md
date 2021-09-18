---
title: JSONファイルをドラッグ&ドロップする
subtitle: SwiftUIの話
date: 2020-11-08
tags: ["Swift"]
---

画像ファイルとかURLとかをドロップする話はそこそこ見つかるけど、JSONファイルをドロップするのに手こずったのでメモ。

```swift
  NavigationView { ... }
  .onDrop(of: ["public.json"], isTargeted: nil) { providers, location in
       if let item = providers.first {
           item.loadItem(forTypeIdentifier: "public.json", options: nil) { (urlData, error) in
               if let url = urlData as? URL {
                   self.json = loadJson(url: url)
               }
           }
           return true
       }
       return false
 }
```

* `"public.json"` の`public`とはなんなのか？
* `isTargeted` とはなんなのか？
* `Item` と `Object` の違いがよーわかってない。
* 参考にしたページ（複数）ではクロージャの中には例のSystemサービススレッドにfetchをお願いするコードが入っていたが、ローカルファイルをロードするのにそれはいらんじゃろ、ということで削除。
* `urlData`から`URL`型を作る過程も1ステップ削除してある。
* `url` は `Data(contentOf:)`の引数に使える。

