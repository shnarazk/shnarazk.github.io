__NUXT_JSONP__("/2018/2018-07-15-edit-personal-info-on-nextcloud", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Re-edit personal information on NextCloud",subtitle:"NextCloudの個人情報が編集できなくなった",date:"2018-07-15T00:00:00.000Z",tags:["nextcloud"],bodyContent:"なにやら色々やっていたら、入力した電話番号やウェブサイトの情報が表示されているものの、\n編集できなくなってしまった。\n\nまず最初に考えたDBのリストアは見当違いだったので、ソースを追いかけてみた。\n\nウェブページのソースからブロックのidを見つけてソースで検索すると、\nsettings\u002Ftemplates\u002Fsettings\u002Fpersonal\u002Fpersonal.info.php が引っかかる。\n検索ボックスをhiddenにしているのは`lookupServerUploadEnabled`らしい。\nこのキーワードでさらに検索すると、[server\u002Flib\u002Fprivate\u002FPersonal\u002FPersonalInfo.php](https:\u002F\u002Fgithub.com\u002Fnextcloud\u002Fserver\u002Fblob\u002Fmaster\u002Flib\u002Fprivate\u002FSettings\u002FPersonal\u002FPersonalInfo.php)中で\n`federated`かどうかを調べている。\n\n```\n\t\u002F**\n\t * @return TemplateResponse returns the instance with all parameters set, ready to be rendered\n\t * @since 9.1\n\t *\u002F\n\tpublic function getForm() {\n\t\t$federatedFileSharingEnabled = $this-\u003EappManager-\u003EisEnabledForUser('federatedfilesharing');\n\t\t$lookupServerUploadEnabled = false;\n\t\tif($federatedFileSharingEnabled) {\n\t\t\t$federatedFileSharing = new Application();\n\t\t\t$shareProvider = $federatedFileSharing-\u003EgetFederatedShareProvider();\n\t\t\t$lookupServerUploadEnabled = $shareProvider-\u003EisLookupServerUploadEnabled();\n\t\t}\n```\n\n確かに共有に関して「色々やっていた」ので、メニュー：設定→共有→統合されたクラウド共有中のあれこれを公開するように変更したら問題解決。\n\n----\n\nただ、ログインに異常に時間が掛かるようにようになったのと、ログインに失敗したときに内部エラーになっ\nてしまうという問題は残ったまま。再インストールでは治らなかったのでやはりDBの新規作り直しが必要なのだ\nと思う。\n\nカレンダーを使うとDBが壊れることもあるようだ。色々と勘違いをしていたせいもあり、設定をいじり過\nぎてわけがわからなくなってしまったので、結局データベースの作り直しも含む再インストールになってしまっ\nた。",bodyHtml:"\u003Cp\u003Eなにやら色々やっていたら、入力した電話番号やウェブサイトの情報が表示されているものの、\n編集できなくなってしまった。\u003C\u002Fp\u003E\n\u003Cp\u003Eまず最初に考えたDBのリストアは見当違いだったので、ソースを追いかけてみた。\u003C\u002Fp\u003E\n\u003Cp\u003Eウェブページのソースからブロックのidを見つけてソースで検索すると、\nsettings\u002Ftemplates\u002Fsettings\u002Fpersonal\u002Fpersonal.info.php が引っかかる。\n検索ボックスをhiddenにしているのは\u003Ccode\u003ElookupServerUploadEnabled\u003C\u002Fcode\u003Eらしい。\nこのキーワードでさらに検索すると、\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fnextcloud\u002Fserver\u002Fblob\u002Fmaster\u002Flib\u002Fprivate\u002FSettings\u002FPersonal\u002FPersonalInfo.php\"\u003Eserver\u002Flib\u002Fprivate\u002FPersonal\u002FPersonalInfo.php\u003C\u002Fa\u003E中で\n\u003Ccode\u003Efederated\u003C\u002Fcode\u003Eかどうかを調べている。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E\t\u002F**\n\t * @return TemplateResponse returns the instance with all parameters set, ready to be rendered\n\t * @since 9.1\n\t *\u002F\n\tpublic function getForm() {\n\t\t$federatedFileSharingEnabled = $this-&gt;appManager-&gt;isEnabledForUser('federatedfilesharing');\n\t\t$lookupServerUploadEnabled = false;\n\t\tif($federatedFileSharingEnabled) {\n\t\t\t$federatedFileSharing = new Application();\n\t\t\t$shareProvider = $federatedFileSharing-&gt;getFederatedShareProvider();\n\t\t\t$lookupServerUploadEnabled = $shareProvider-&gt;isLookupServerUploadEnabled();\n\t\t}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E確かに共有に関して「色々やっていた」ので、メニュー：設定→共有→統合されたクラウド共有中のあれこれを公開するように変更したら問題解決。\u003C\u002Fp\u003E\n\u003Chr\u003E\n\u003Cp\u003Eただ、ログインに異常に時間が掛かるようにようになったのと、ログインに失敗したときに内部エラーになっ\nてしまうという問題は残ったまま。再インストールでは治らなかったのでやはりDBの新規作り直しが必要なのだ\nと思う。\u003C\u002Fp\u003E\n\u003Cp\u003Eカレンダーを使うとDBが壊れることもあるようだ。色々と勘違いをしていたせいもあり、設定をいじり過\nぎてわけがわからなくなってしまったので、結局データベースの作り直しも含む再インストールになってしまっ\nた。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2018",base:"2018-07-15-edit-personal-info-on-nextcloud.json",ext:".json",sourceBase:"2018-07-15-edit-personal-info-on-nextcloud.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Re-edit personal information on NextCloud"},subtitle:{writable:true,enumerable:true,value:"NextCloudの個人情報が編集できなくなった"},date:{writable:true,enumerable:true,value:"2018-07-15T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["nextcloud"]},bodyContent:{writable:true,enumerable:true,value:"なにやら色々やっていたら、入力した電話番号やウェブサイトの情報が表示されているものの、\n編集できなくなってしまった。\n\nまず最初に考えたDBのリストアは見当違いだったので、ソースを追いかけてみた。\n\nウェブページのソースからブロックのidを見つけてソースで検索すると、\nsettings\u002Ftemplates\u002Fsettings\u002Fpersonal\u002Fpersonal.info.php が引っかかる。\n検索ボックスをhiddenにしているのは`lookupServerUploadEnabled`らしい。\nこのキーワードでさらに検索すると、[server\u002Flib\u002Fprivate\u002FPersonal\u002FPersonalInfo.php](https:\u002F\u002Fgithub.com\u002Fnextcloud\u002Fserver\u002Fblob\u002Fmaster\u002Flib\u002Fprivate\u002FSettings\u002FPersonal\u002FPersonalInfo.php)中で\n`federated`かどうかを調べている。\n\n```\n\t\u002F**\n\t * @return TemplateResponse returns the instance with all parameters set, ready to be rendered\n\t * @since 9.1\n\t *\u002F\n\tpublic function getForm() {\n\t\t$federatedFileSharingEnabled = $this-\u003EappManager-\u003EisEnabledForUser('federatedfilesharing');\n\t\t$lookupServerUploadEnabled = false;\n\t\tif($federatedFileSharingEnabled) {\n\t\t\t$federatedFileSharing = new Application();\n\t\t\t$shareProvider = $federatedFileSharing-\u003EgetFederatedShareProvider();\n\t\t\t$lookupServerUploadEnabled = $shareProvider-\u003EisLookupServerUploadEnabled();\n\t\t}\n```\n\n確かに共有に関して「色々やっていた」ので、メニュー：設定→共有→統合されたクラウド共有中のあれこれを公開するように変更したら問題解決。\n\n----\n\nただ、ログインに異常に時間が掛かるようにようになったのと、ログインに失敗したときに内部エラーになっ\nてしまうという問題は残ったまま。再インストールでは治らなかったのでやはりDBの新規作り直しが必要なのだ\nと思う。\n\nカレンダーを使うとDBが壊れることもあるようだ。色々と勘違いをしていたせいもあり、設定をいじり過\nぎてわけがわからなくなってしまったので、結局データベースの作り直しも含む再インストールになってしまっ\nた。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003Eなにやら色々やっていたら、入力した電話番号やウェブサイトの情報が表示されているものの、\n編集できなくなってしまった。\u003C\u002Fp\u003E\n\u003Cp\u003Eまず最初に考えたDBのリストアは見当違いだったので、ソースを追いかけてみた。\u003C\u002Fp\u003E\n\u003Cp\u003Eウェブページのソースからブロックのidを見つけてソースで検索すると、\nsettings\u002Ftemplates\u002Fsettings\u002Fpersonal\u002Fpersonal.info.php が引っかかる。\n検索ボックスをhiddenにしているのは\u003Ccode\u003ElookupServerUploadEnabled\u003C\u002Fcode\u003Eらしい。\nこのキーワードでさらに検索すると、\u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fnextcloud\u002Fserver\u002Fblob\u002Fmaster\u002Flib\u002Fprivate\u002FSettings\u002FPersonal\u002FPersonalInfo.php\"\u003Eserver\u002Flib\u002Fprivate\u002FPersonal\u002FPersonalInfo.php\u003C\u002Fa\u003E中で\n\u003Ccode\u003Efederated\u003C\u002Fcode\u003Eかどうかを調べている。\u003C\u002Fp\u003E\n\u003Cpre\u003E\u003Ccode\u003E\t\u002F**\n\t * @return TemplateResponse returns the instance with all parameters set, ready to be rendered\n\t * @since 9.1\n\t *\u002F\n\tpublic function getForm() {\n\t\t$federatedFileSharingEnabled = $this-&gt;appManager-&gt;isEnabledForUser('federatedfilesharing');\n\t\t$lookupServerUploadEnabled = false;\n\t\tif($federatedFileSharingEnabled) {\n\t\t\t$federatedFileSharing = new Application();\n\t\t\t$shareProvider = $federatedFileSharing-&gt;getFederatedShareProvider();\n\t\t\t$lookupServerUploadEnabled = $shareProvider-&gt;isLookupServerUploadEnabled();\n\t\t}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003E確かに共有に関して「色々やっていた」ので、メニュー：設定→共有→統合されたクラウド共有中のあれこれを公開するように変更したら問題解決。\u003C\u002Fp\u003E\n\u003Chr\u003E\n\u003Cp\u003Eただ、ログインに異常に時間が掛かるようにようになったのと、ログインに失敗したときに内部エラーになっ\nてしまうという問題は残ったまま。再インストールでは治らなかったのでやはりDBの新規作り直しが必要なのだ\nと思う。\u003C\u002Fp\u003E\n\u003Cp\u003Eカレンダーを使うとDBが壊れることもあるようだ。色々と勘違いをしていたせいもあり、設定をいじり過\nぎてわけがわからなくなってしまったので、結局データベースの作り直しも含む再インストールになってしまっ\nた。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2018"},base:{writable:true,enumerable:true,value:"2018-07-15-edit-personal-info-on-nextcloud.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2018-07-15-edit-personal-info-on-nextcloud.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});