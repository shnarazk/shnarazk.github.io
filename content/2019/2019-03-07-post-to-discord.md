---
title: Post to Discord from shell
subtitle: curlでwebhookを叩いてDiscordに投稿
date: 2019-03-07
tags: ["Discord", "shell"]
---

- 第1引数はメッセージ本体
- 第2引数には投稿者名

```bash
#!/bin/sh -norc
message=${1:-"empty message"}

if [ "$2" == "" ] ;
then
    payload="{\"content\":\"${message}\"}"
else
    payload="{\"username\":\"$2\",\"content\":\"${message}\"}"
fi

url='https://discordapp.com/api/webhooks/aaa/bbb'
curl -X POST -H "Accept: application/json" -H "Content-type: application/json" -d "${payload}" ${url}
```

- `url`には先に取得しておいたwebhookのものを指定する。
