---
title: Deploy a Servant program to Heroku with Docker
subtitle: HaskellプログラムをHerokuで動かそう（2018年私家版）
date: 2018-06-24
tags: ["haskell", "servant", "heroku", "docker", "gitlab", "nixos"]
---

stackのテンプレートを使って
[Dockerを使ってHaskellアプリをHerokuにデプロイする](https://haskell.jp/blog/posts/2017/02-haskell-on-heroku.html)
と同じことをやってみます．

### 下準備（オプショナル）

stackに警告を出されないように，~/.stack/config.yml に以下のような情報を追加しておくといいかも．

```yaml
templates:
  params:
    author-email: EMAIL
    author-name:  NAME
```

### プロジェクトの生成

stackのテンプレート `servant-docker` を使ってプロジェクトの雛形を作らせます．

```
stack new PROJECT [--bare] servant-docker [--solver SOLVER]
```

雛形なのでこれでデプロイまでできるはずなのですが，いくつか問題があるので修正します．

### heroku用にプログラムを変更

まず，herokuの環境でlistenすべきポート番号は環境変数で取得しないといけないのでそれを反映させます：

```diff
diff --git a/src/Lib.hs b/src/Lib.hs
index 46ba8bc..c800dc5 100644
--- a/src/Lib.hs
+++ b/src/Lib.hs
@@ -10,6 +10,7 @@ import Data.Aeson.TH
 import Network.Wai
 import Network.Wai.Handler.Warp
 import Servant
+import System.ReadEnvVar (readEnvDef)

 data User = User
   { userId        :: Int
@@ -22,7 +23,10 @@ $(deriveJSON defaultOptions ''User)
 type API = "users" :> Get '[JSON] [User]

 startApp :: IO ()
-startApp = run 1234 app
+startApp = do
+  port <- readEnvDef "PORT" 8080
+  putStrLn $ ";;; start server at " ++ show port
+  run port app

 app :: Application
 app = serve api server
```

[ReadEnvVar](https://github.com/cdepillabout/read-env-var)パッケージを追加したのでcabalファイルにも追加：

```diff
diff --git a/appname.cabal b/appname.cabal
index b977aa5..e654f60 100644
--- a/PROJECT.cabal
+++ b/PROJECT.cabal
@@ -18,6 +18,7 @@ library
   exposed-modules:     Lib
   build-depends:       base >= 4.7 && < 5
                      , aeson
+                     , read-env-var
                      , servant-server
                      , wai
                      , warp
```

### 手動で確認

ここでコンパイルしてエラーがないことを確認します．

```bash
$ stack build
```

動作確認は

```bash
$ export PORT=8080; APP &
$ wget http://localhost:8080/
```

### Dockerイメージの作成

まずdockerのイメージでプログラムが自動で実行されるようにDockerfile（ついでにstack.yml）を変更します．
．

```diff
--- a/Dockerfile
+++ b/Dockerfile
@@ -9,3 +9,4 @@

 COPY . /app/user
 RUN stack install
+CMD APP.EXE
```

```diff
modified   stack.yaml
@@ -66,6 +66,15 @@ allow-newer: true
 # Allow a newer minor version of GHC than the snapshot specifies
 # compiler-check: newer-minor

+image:
+  containers:
+    -
+      base: "haskell:8.4.3"
+      executables:
+        - APP.EXE
+      entrypoints:
+        - APP.EXE
```

以下を実行してイメージを作ります：

```
docker build -t APPNAME .
```

動作確認は

```bash
$ docker run -p 8080:8080 --publish-all APPNAME
$ wget http://localhost:8080/
```

### herokuへのデプロイ

#### 初期設定

1. アカウントを作る
2. heroku dashboardでアプリの登録

```sh
heroku login
heroku apps:create APPNAME
```

#### ビルドからデプロイ

1. ログインする
2. コンテナ環境での作業

```sh
$ heroku container:login
$ heroku container:push web [--app APPNAME]
$ heroku container:release web [--app APPNAME]
```

### gitlab-ci.ymlに登録

うまく行ったなら自動化させます．当然gitlab用に `.gitlab-ci.yml` を作成：

```
build:
  stage: build
  script:
    - docker build -t APPNAME .

deploy heroku:
  stage: deploy
  script:
    - heroku container:login
    - heroku container:push web --app APPNAME
    - heroku container:release web --app APPNAME
```

（さらにherokuへのデプロイ用のキーを登録する必要があるかも）

That's it.

## だったらstack templateにしてしまおう

ということで以上の変更をしたテンプレート https://gitlab.com/snippets/1728485/raw を作りました．
テンプレートはurl指定で使えるので，以下のようにするのが一番速いでしょう．

```
stack new projectname https://gitlab.com/snippets/1728485/raw
```

ということで結論

1. プロジェクト生成： `stack new PROJECT https://gitlab.com/snippets/1728485/raw`
1. dockerで確認： `docker build -t PROJECT .`
1. herokuにログイン： `heroku container:login`
1. プッシュ: `heroku container:push web --app PROJECT`
1. 実行開始: `heroku container:release web --app PROJECT`

## PostgreSQLにつないでみよう

このプログラムはPostgreSQLを使うために外部プログラムを呼び出していません。
対応するのは簡単で以下の通り：

- Dockerのベースイメージを `nixos:2.0.4` に変更
- servantのプログラムはtutorialの[Cookbook PostgreSQL connection pool](http://haskell-servant.readthedocs.io/en/stable/cookbook/db-postgres-pool/PostgresPool.html)をそのまま流用

あとはherokuでpostgreSQLを有効にすればOK。
Dockerfileはこのようになりました。

```
FROM nixos/nix:2.0.4
ENV LANG C.UTF-8

RUN nix-channel --update
RUN nix-env -u
RUN nix-env -f "<nixpkgs>" -iA haskell.compiler.ghc843
RUN nix-env -i stack

WORKDIR /opt/PROJECT/src
ENV PATH "/opt/PROJECT/bin:$PATH"

# Build and install application binaries to /opt/PROJECT/bin.
COPY *.yaml /opt/PROJECT/src/
RUN stack --no-terminal build --only-dependencies
COPY . /opt/PROJECT/src
RUN stack --no-terminal --local-bin-path /opt/PROJECT/bin install

# clean up and run
RUN rm -rf /opt/PROJECT/src
CMD /opt/PROJECT/bin/PROJECT
```
