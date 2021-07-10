---
title: Swiftでcrawling
subtitle: 
date: 2021-07-10
tags: ["Swift", "Covid19"]
---
福岡市の[COVID19オープンデータ](https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients)は更新されるたびにURLが更新される（そして古いURLは削除される）という意味不明な[運用](https://ckan.open-governmentdata.org/dataset/activity/401000_pref_fukuoka_covid19_patients)なので、毎日swiftプログラムを書き換えるという馬鹿なことをしていたのだけど、半年たってようやくcrawlingしようという気になりました。

適当なサイトでそのやり方を調べるとそれなりに簡単みたいだっただけど、コピペで動かない。
そもそもこの正規表現は何?というレベルでコードに不信感を抱いたのでplaygroundで色々修正して正解を探した。

結局こうなった。`parse`の中身をほぼ作り直し。
しかし、それにしても正規表現を使うのに`NSなんとか`を使うというあたりが、言語が「閉じてない」感。ちょっとねえ。

```swift
import Foundation

// Input your parameters here
let startUrl = URL(string: "https://ckan.open-governmentdata.org/dataset/401000_pref_fukuoka_covid19_patients")!
let wordToSearch = "Swift"
let maximumPagesToVisit = 10

// Crawler Parameters
let semaphore = DispatchSemaphore(value: 0)
var visitedPages: Set<URL> = []
var pagesToVisit: Set<URL> = [startUrl]

// Crawler Core
func crawl() {
    guard visitedPages.count <= maximumPagesToVisit else {
        print("🏁 Reached max number of pages to visit")
        semaphore.signal()
        return
    }
    guard let pageToVisit = pagesToVisit.popFirst() else {
        print("🏁 No more pages to visit")
        semaphore.signal()
        return
    }
    if visitedPages.contains(pageToVisit) {
        crawl()
    } else {
        visit(page: pageToVisit)
    }
}

func visit(page url: URL) {
    visitedPages.insert(url)
    
    let task = URLSession.shared.dataTask(with: url) { data, response, error in
        defer { crawl() }
        guard
            let data = data,
            error == nil,
            let document = String(data: data, encoding: .utf8) else { return }
        parse(document: document, url: url)
    }
    
    print("🔎 Visiting page: \(url)")
    task.resume()
}

func parse(document: String, url: URL) {
    func collectLinks() -> [URL] {
        let regex = try! NSRegularExpression(pattern: "https://[^\"]*", options: [])
        let matches = regex.matches(in: document, options: [], range: NSRange(document.startIndex..<document.endIndex, in: document))
        print(matches.map { m in document[Range(m.range, in: document)!]} )
        return matches.compactMap { m in URL(string: String(document[Range(m.range, in: document)!])) }
    }
    print(collectLinks())
    collectLinks().forEach { pagesToVisit.insert($0) }
}

crawl()
//semaphore.wait()
```
