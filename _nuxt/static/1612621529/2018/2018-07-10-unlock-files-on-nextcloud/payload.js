__NUXT_JSONP__("/2018/2018-07-10-unlock-files-on-nextcloud", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Unlock files on NextCloud",date:"2018-07-10T00:00:00.000Z",tags:["nextcloud","archlinux"],bodyContent:"まず，\u002Fetc\u002Fwebapps\u002Fnextcloud\u002Fconfig\u002Fconfig.phpでmaintenanceをtrueに一時変更．\n\nそして，以下を実行：\n\n```\nmysql -u USERname DBname -p\nパスワード\nDELETE FROM oc_file_locks WHERE 1;\nquit\n```",bodyHtml:"\u003Cp\u003Eまず，\u002Fetc\u002Fwebapps\u002Fnextcloud\u002Fconfig\u002Fconfig.phpでmaintenanceをtrueに一時変更．\u003C\u002Fp\u003E\n\u003Cp\u003Eそして，以下を実行：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Emysql -u USERname DBname -p\nパスワード\nDELETE FROM oc_file_locks WHERE 1;\nquit\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n",dir:"article\u002F.json\u002F2018",base:"2018-07-10-unlock-files-on-nextcloud.json",ext:".json",sourceBase:"2018-07-10-unlock-files-on-nextcloud.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Unlock files on NextCloud"},date:{writable:true,enumerable:true,value:"2018-07-10T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["nextcloud","archlinux"]},bodyContent:{writable:true,enumerable:true,value:"まず，\u002Fetc\u002Fwebapps\u002Fnextcloud\u002Fconfig\u002Fconfig.phpでmaintenanceをtrueに一時変更．\n\nそして，以下を実行：\n\n```\nmysql -u USERname DBname -p\nパスワード\nDELETE FROM oc_file_locks WHERE 1;\nquit\n```"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003Eまず，\u002Fetc\u002Fwebapps\u002Fnextcloud\u002Fconfig\u002Fconfig.phpでmaintenanceをtrueに一時変更．\u003C\u002Fp\u003E\n\u003Cp\u003Eそして，以下を実行：\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003Emysql -u USERname DBname -p\nパスワード\nDELETE FROM oc_file_locks WHERE 1;\nquit\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2018"},base:{writable:true,enumerable:true,value:"2018-07-10-unlock-files-on-nextcloud.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2018-07-10-unlock-files-on-nextcloud.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});