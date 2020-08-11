(window.webpackJsonp=window.webpackJsonp||[]).push([[15],{492:function(t){t.exports=JSON.parse('{"title":"Upgrade PostgreSQL DB","subtitle":"moodleで使用しているPostgreSQLのメジャーアップグレード","date":"2018-02-04T00:00:00.000Z","tags":["PostgreSQL","moodle","ArchLinux"],"bodyContent":"-  https://wiki.archlinux.org/index.php/PostgreSQL#Upgrading_PostgreSQL\\n\\nFrom 9.X to 10.X\\n\\n```bash\\nsystemctl stop postgreqsl\\ncd /var/lib/postgres\\nmv data data-old\\nmkdir data\\nchown postgreq:postgreq data\\nsu postgres\\ninitdb --locale \\"en_US.UTF8\\" -E UTF8 -D \'/var/lib/postgres/data\'\\n(cd /tmp ; pg_upgrade -b /opt/pgsql-9.6/bin/ -B /usr/bin/ -d /var/lib/postgres/data-old -D /var/lib/postgres/data)\\nsudo systemctl start postgresql\\n./analyze_new_cluster.sh\\n./delete_old_cluster.sh\\n```","bodyHtml":"<ul>\\n<li>https://wiki.archlinux.org/index.php/PostgreSQL#Upgrading_PostgreSQL</li>\\n</ul>\\n<p>From 9.X to 10.X</p>\\n<pre><code class=\\"hljs\\">systemctl stop postgreqsl\\n<span class=\\"hljs-built_in\\">cd</span> /var/lib/postgres\\nmv data data-old\\nmkdir data\\nchown postgreq:postgreq data\\nsu postgres\\ninitdb --locale <span class=\\"hljs-string\\">\\"en_US.UTF8\\"</span> -E UTF8 -D <span class=\\"hljs-string\\">\'/var/lib/postgres/data\'</span>\\n(<span class=\\"hljs-built_in\\">cd</span> /tmp ; pg_upgrade -b /opt/pgsql-9.6/bin/ -B /usr/bin/ -d /var/lib/postgres/data-old -D /var/lib/postgres/data)\\nsudo systemctl start postgresql\\n./analyze_new_cluster.sh\\n./delete_old_cluster.sh</code></pre>","dir":"article/.json/2018","base":"2018-02-04-upgrade-postgresql.json","ext":".json","sourceBase":"2018-02-04-upgrade-postgresql.md","sourceExt":".md"}')}}]);