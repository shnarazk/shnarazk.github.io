(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{527:function(o){o.exports=JSON.parse('{"title":"Post to Discord from shell","subtitle":"curlでwebhookを叩いてDiscordに投稿","date":"2019-03-07T00:00:00.000Z","tags":["Discord","shell"],"bodyContent":"- 第1引数はメッセージ本体\\n- 第2引数には投稿者名\\n\\n```shell\\n#!/bin/sh -norc\\nmessage=${1:-\\"empty message\\"}\\n\\nif [ \\"$2\\" == \\"\\" ] ;\\nthen\\n    payload=\\"{\\\\\\"content\\\\\\":\\\\\\"${message}\\\\\\"}\\"\\nelse\\n    payload=\\"{\\\\\\"username\\\\\\":\\\\\\"$2\\\\\\",\\\\\\"content\\\\\\":\\\\\\"${message}\\\\\\"}\\"\\nfi\\n\\nurl=\'https://discordapp.com/api/webhooks/aaa/bbb\'\\ncurl -X POST -H \\"Accept: application/json\\" -H \\"Content-type: application/json\\" -d \\"${payload}\\" ${url}\\n```\\n\\n- `url`には先に取得しておいたwebhookのものを指定する。","bodyHtml":"<ul>\\n<li>第1引数はメッセージ本体</li>\\n<li>第2引数には投稿者名</li>\\n</ul>\\n<pre><code class=\\"hljs\\"><span class=\\"hljs-meta\\">#</span><span class=\\"bash\\">!/bin/sh -norc</span>\\nmessage=${1:-&quot;empty message&quot;}\\n\\nif [ &quot;$2&quot; == &quot;&quot; ] ;\\nthen\\n    payload=&quot;{\\\\&quot;content\\\\&quot;:\\\\&quot;${message}\\\\&quot;}&quot;\\nelse\\n    payload=&quot;{\\\\&quot;username\\\\&quot;:\\\\&quot;$2\\\\&quot;,\\\\&quot;content\\\\&quot;:\\\\&quot;${message}\\\\&quot;}&quot;\\nfi\\n\\nurl=&#x27;https://discordapp.com/api/webhooks/aaa/bbb&#x27;\\ncurl -X POST -H &quot;Accept: application/json&quot; -H &quot;Content-type: application/json&quot; -d &quot;${payload}&quot; ${url}</code></pre><ul>\\n<li><code>url</code>には先に取得しておいたwebhookのものを指定する。</li>\\n</ul>\\n","dir":"article/.json/2019","base":"2019-03-07-post-to-discord.json","ext":".json","sourceBase":"2019-03-07-post-to-discord.md","sourceExt":".md"}')}}]);