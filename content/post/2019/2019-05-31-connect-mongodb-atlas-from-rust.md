---
title: Connect mongoDB Atlas from Rust
subtitle: "\"mongodb+srv://\"がない"
date: 2019-05-31
tags: ["Rust", "mongoDB", "cloud"]
---

クラウドの勉強をしようと思って無料データベースmongoDB Atlasにアカウントを作ってみた。

これを選んだのは、以下の理由：

- [nlp100](http://www.cl.ecei.tohoku.ac.jp/nlp100/)の問題で自前のmongoDBをrustから利用するプログラム
がある
- Zeit@nowからも統合できる

セットアップはサクサクできてあとはプログラムにconnectするだけ。

![](/img/2019-05-31-mongodb-1.png)

もちろん、ちゃんとセットアップの参考例が表示される。
例えばjs用のサンプルはこうなっている。

```js
const MongoClient = require(‘mongodb’).MongoClient;
const uri = "mongodb+srv://<ADMIN>:<PASSWORD>@<MYCLUSTER>.mongodb.net/test?...";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});
```

これを真似すれば、非公式ライブラリ[mongodb=0.3.12](https://crates.io/crates/mongodb)を使ったRustのプログラムでも
簡単に移植できるだろうと思ったら、予想が外れてしまった。

```
thread 'main' panicked at 'failed to auth: OperationError("No servers available for the provide
d ReadPreference.")', src/libcore/result.rs:997:5                                              
note: Run with `RUST_BACKTRACE=1` environment variable to display a backtrace.  
```

ネットで調べると参考になりそうなのはこのあたり。

- https://www.reddit.com/r/rust/comments/9x0bs9/connect_to_mongodb_atlas_from_rust/
- https://github.com/mongodb-labs/mongo-rust-driver-prototype/issues/291
- https://github.com/mongodb-labs/mongo-rust-driver-prototype/issues/313

- クライアントライブラリは変えたくないなあ。なんとかmongodbで繋ぎたい。
- しかし、`mongodb+srv://`はまだ実装されてない。
- とにかく、sshのサポートは必要なのでmongodbのコンパイルに`features="ssl"` が必要
- そして、認証には`db::auth`メソッドを呼び出すことが必要。
- さらに、つなぐべきbdは `"auth"` である。ただwebでの管理画面を見ていると正解はどうも `"admin"` らしい。。。

ということがわかって、こういうコードになった：

```rust
   let opts = mongodb::ClientOptions::with_unauthenticated_ssl(None, false);
   let mut m = mongodb::Client::with_uri_and_options(<上のURI>, opts).expect("connect");
   client.db("admin").auth("<ADMIN>", "<PASSWORD>").expect("auth");
   let coll = client.db("<DB>").collection("<COLLECTION>");
    ...
```
しかし、これらを反映してもどうやっても最初のエラーが取れない。

いい加減、諦めかけていたのだけど、Mongo ShellからConnectするためのサンプルを見ていて
Mongo Shellから接続するときのURIはバージョンによって全然違うことに気づいた。
具体的には最新版(3.6 or later)だと、

```
mongo "mongodb+srv://<CLUSTER>.mongodb.net/test" --username <username>
```

なのが、3.3 or earlierだとこうなる。


```
mongo "mongodb://<CLUSTER>-<SHARD0>.mongodb.net:xxx,<CLUSTER>-<SHARD1>.mongodb.net:xxx,<CLUSTER>-<SHARD2>.mongodb.net:xxx/test?...
```

問題の `srv` がないじゃん！

なのでrustのプログラム中のURIをこれと入れ替えると、さっくり通ってしまった。

めでたし、めでたし。
