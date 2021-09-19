---
title: Unlock files on NextCloud
taxonomies:
  tags: ["nextcloud","archlinux"]
---

まず，/etc/webapps/nextcloud/config/config.phpでmaintenanceをtrueに一時変更．

そして，以下を実行：

```
mysql -u USERname DBname -p
パスワード
DELETE FROM oc_file_locks WHERE 1;
quit
```
