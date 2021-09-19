---
title: Connect mongoDB Atlas from Rust
extra:
  subtitle: "\"mongodb+srv://\"がない"
taxonomies:
  tags: ["Rust", "mongoDB", "cloud"]
---

クラウドの勉強をしようと思って無料データベース[mongoDB Atlas](https://cloud.mongodb.com/)にアカウントを作ってみた。

mongoDBを選んだのは、以下の理由から。

- [nlp100](http://www.cl.ecei.tohoku.ac.jp/nlp100/)の課題で、
自前のmongoDBをrustから利用するプログラムを作ってた
- [Zeit@now](https://zeit.co/)からも[統合](https://zeit.co/blog/zeit-now-integrations-platform)できる

セットアップはサクサクできて、あとはプログラムにconnectするだけ。
もちろん、ちゃんと参考例が表示される。

![](/2019/2019-05-31_mongodb-1.png)

例えば**Connect Your Application**から辿ったjs用のサンプルはこうなっている。

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

これを真似すれば、非公式クライアントライブラリ[mongodb 0.3.12](https://crates.io/crates/mongodb)を使ったRustのプログラムでも
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

そこで、

- クライアントライブラリは変えたくないなあ。なんとかmongodbで繋ぎたい。
- しかし、`mongodb+srv://`はまだ実装されてない。
- とにかく、sshのサポートは必要なのでmongodbのコンパイルに`features="ssl"` が必要
- そして、認証には`db::auth`メソッドを呼び出すことが必要。
- さらに、認証時につなぐべきbdは `"auth"` である。ただwebでの管理画面を見ていると正解はどうも `"admin"` らしい。。。

となって、こういうコードになった：

```rust
   let opts = mongodb::ClientOptions::with_unauthenticated_ssl(None, false);
   let uri = <上のURI>;
   let mut m = mongodb::Client::with_uri_and_options(uri, opts).expect("connect");
   client.db("admin").auth("<ADMIN>", "<PASSWORD>").expect("auth");
   let coll = client.db("<DB>").collection("<COLLECTION>");
    ...
```
しかし、これらを反映してもどうやっても最初のエラーが取れない。

いい加減、諦めかけていたのだけど、**Connect with the Mongo Shell**の中のサンプルを見ていて
指定すべきURIがMongo Shellのバージョンによって全然違うことに気づいた。
具体的には最新版(3.6 or later)だと、

```
mongo "mongodb+srv://<CLUSTER>.mongodb.net/test" --username <username>
```

なのが、3.3 or earlierだとこうなる。

```
mongo "mongodb://<CLUSTER>-<SHARD0>.mongodb.net:xxx,<CLUSTER>-<SHARD1>.mongodb.net:xxx,<CLUSTER>-<SHARD2>.mongodb.net:xxx/test?...
```

問題の `srv` がないじゃん！

なので上のrustプログラムの2行目の`uri`の定義をこれと入れ替えたら、さっくり通ってしまった。

めでたし、めでたし。
