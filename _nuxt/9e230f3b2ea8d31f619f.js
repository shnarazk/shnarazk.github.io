(window.webpackJsonp=window.webpackJsonp||[]).push([[26],{498:function(n){n.exports=JSON.parse('{"title":"Unlock files on NextCloud","date":"2018-07-10T00:00:00.000Z","tags":["nextcloud","archlinux"],"bodyContent":"まず，/etc/webapps/nextcloud/config/config.phpでmaintenanceをtrueに一時変更．\\n\\nそして，以下を実行：\\n\\n```\\nmysql -u USERname DBname -p\\nパスワード\\nDELETE FROM oc_file_locks WHERE 1;\\nquit\\n```","bodyHtml":"<p>まず，/etc/webapps/nextcloud/config/config.phpでmaintenanceをtrueに一時変更．</p>\\n<p>そして，以下を実行：</p>\\n<pre><code>mysql -u USERname DBname -p\\nパスワード\\nDELETE FROM oc_file_locks WHERE 1;\\nquit\\n</code></pre>\\n","dir":"article/.json/2018","base":"2018-07-10-unlock-files-on-nextcloud.json","ext":".json","sourceBase":"2018-07-10-unlock-files-on-nextcloud.md","sourceExt":".md"}')}}]);