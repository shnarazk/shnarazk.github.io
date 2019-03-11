---
title: Upgrade PostgreSQL DB
subtitle: moodleで使用しているPostgreSQLのメジャーアップグレード
date: 2018-02-04
tags: ["PostgreSQL", "moodle", "ArchLinux"]
---

-  https://wiki.archlinux.org/index.php/PostgreSQL#Upgrading_PostgreSQL

From 9.X to 10.X

```bash
systemctl stop postgreqsl
cd /var/lib/postgres
mv data data-old
mkdir data
chown postgreq:postgreq data
su postgres
initdb --locale "en_US.UTF8" -E UTF8 -D '/var/lib/postgres/data'
(cd /tmp ; pg_upgrade -b /opt/pgsql-9.6/bin/ -B /usr/bin/ -d /var/lib/postgres/data-old -D /var/lib/postgres/data)
sudo systemctl start postgresql
./analyze_new_cluster.sh
./delete_old_cluster.sh
```
