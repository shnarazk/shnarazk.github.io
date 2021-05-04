__NUXT_JSONP__("/2018/2018-02-04-upgrade-postgresql", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Upgrade PostgreSQL DB",subtitle:"moodleで使用しているPostgreSQLのメジャーアップグレード",date:"2018-02-04T00:00:00.000Z",tags:["PostgreSQL","moodle","ArchLinux"],bodyContent:"-  https:\u002F\u002Fwiki.archlinux.org\u002Findex.php\u002FPostgreSQL#Upgrading_PostgreSQL\n\nFrom 9.X to 10.X\n\n```bash\nsystemctl stop postgreqsl\ncd \u002Fvar\u002Flib\u002Fpostgres\nmv data data-old\nmkdir data\nchown postgreq:postgreq data\nsu postgres\ninitdb --locale \"en_US.UTF8\" -E UTF8 -D '\u002Fvar\u002Flib\u002Fpostgres\u002Fdata'\n(cd \u002Ftmp ; pg_upgrade -b \u002Fopt\u002Fpgsql-9.6\u002Fbin\u002F -B \u002Fusr\u002Fbin\u002F -d \u002Fvar\u002Flib\u002Fpostgres\u002Fdata-old -D \u002Fvar\u002Flib\u002Fpostgres\u002Fdata)\nsudo systemctl start postgresql\n.\u002Fanalyze_new_cluster.sh\n.\u002Fdelete_old_cluster.sh\n```",bodyHtml:"\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fwiki.archlinux.org\u002Findex.php\u002FPostgreSQL#Upgrading_PostgreSQL\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003EFrom 9.X to 10.X\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003Esystemctl stop postgreqsl\n\u003Cspan class=\"hljs-built_in\"\u003Ecd\u003C\u002Fspan\u003E \u002Fvar\u002Flib\u002Fpostgres\nmv data data-old\nmkdir data\nchown postgreq:postgreq data\nsu postgres\ninitdb --locale \u003Cspan class=\"hljs-string\"\u003E&quot;en_US.UTF8&quot;\u003C\u002Fspan\u003E -E UTF8 -D \u003Cspan class=\"hljs-string\"\u003E&#x27;\u002Fvar\u002Flib\u002Fpostgres\u002Fdata&#x27;\u003C\u002Fspan\u003E\n(\u003Cspan class=\"hljs-built_in\"\u003Ecd\u003C\u002Fspan\u003E \u002Ftmp ; pg_upgrade -b \u002Fopt\u002Fpgsql-9.6\u002Fbin\u002F -B \u002Fusr\u002Fbin\u002F -d \u002Fvar\u002Flib\u002Fpostgres\u002Fdata-old -D \u002Fvar\u002Flib\u002Fpostgres\u002Fdata)\nsudo systemctl start postgresql\n.\u002Fanalyze_new_cluster.sh\n.\u002Fdelete_old_cluster.sh\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E",dir:"article\u002F.json\u002F2018",base:"2018-02-04-upgrade-postgresql.json",ext:".json",sourceBase:"2018-02-04-upgrade-postgresql.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Upgrade PostgreSQL DB"},subtitle:{writable:true,enumerable:true,value:"moodleで使用しているPostgreSQLのメジャーアップグレード"},date:{writable:true,enumerable:true,value:"2018-02-04T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["PostgreSQL","moodle","ArchLinux"]},bodyContent:{writable:true,enumerable:true,value:"-  https:\u002F\u002Fwiki.archlinux.org\u002Findex.php\u002FPostgreSQL#Upgrading_PostgreSQL\n\nFrom 9.X to 10.X\n\n```bash\nsystemctl stop postgreqsl\ncd \u002Fvar\u002Flib\u002Fpostgres\nmv data data-old\nmkdir data\nchown postgreq:postgreq data\nsu postgres\ninitdb --locale \"en_US.UTF8\" -E UTF8 -D '\u002Fvar\u002Flib\u002Fpostgres\u002Fdata'\n(cd \u002Ftmp ; pg_upgrade -b \u002Fopt\u002Fpgsql-9.6\u002Fbin\u002F -B \u002Fusr\u002Fbin\u002F -d \u002Fvar\u002Flib\u002Fpostgres\u002Fdata-old -D \u002Fvar\u002Flib\u002Fpostgres\u002Fdata)\nsudo systemctl start postgresql\n.\u002Fanalyze_new_cluster.sh\n.\u002Fdelete_old_cluster.sh\n```"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cul\u003E\n\u003Cli\u003Ehttps:\u002F\u002Fwiki.archlinux.org\u002Findex.php\u002FPostgreSQL#Upgrading_PostgreSQL\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003EFrom 9.X to 10.X\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode class=\"hljs\"\u003Esystemctl stop postgreqsl\n\u003Cspan class=\"hljs-built_in\"\u003Ecd\u003C\u002Fspan\u003E \u002Fvar\u002Flib\u002Fpostgres\nmv data data-old\nmkdir data\nchown postgreq:postgreq data\nsu postgres\ninitdb --locale \u003Cspan class=\"hljs-string\"\u003E&quot;en_US.UTF8&quot;\u003C\u002Fspan\u003E -E UTF8 -D \u003Cspan class=\"hljs-string\"\u003E&#x27;\u002Fvar\u002Flib\u002Fpostgres\u002Fdata&#x27;\u003C\u002Fspan\u003E\n(\u003Cspan class=\"hljs-built_in\"\u003Ecd\u003C\u002Fspan\u003E \u002Ftmp ; pg_upgrade -b \u002Fopt\u002Fpgsql-9.6\u002Fbin\u002F -B \u002Fusr\u002Fbin\u002F -d \u002Fvar\u002Flib\u002Fpostgres\u002Fdata-old -D \u002Fvar\u002Flib\u002Fpostgres\u002Fdata)\nsudo systemctl start postgresql\n.\u002Fanalyze_new_cluster.sh\n.\u002Fdelete_old_cluster.sh\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2018"},base:{writable:true,enumerable:true,value:"2018-02-04-upgrade-postgresql.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2018-02-04-upgrade-postgresql.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});