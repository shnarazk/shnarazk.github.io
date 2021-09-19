---
title: Re-edit personal information on NextCloud
extra:
  subtitle: NextCloudの個人情報が編集できなくなった
taxonomies:
  tags: ["nextcloud"]
---
なにやら色々やっていたら、入力した電話番号やウェブサイトの情報が表示されているものの、
編集できなくなってしまった。

まず最初に考えたDBのリストアは見当違いだったので、ソースを追いかけてみた。

ウェブページのソースからブロックのidを見つけてソースで検索すると、
settings/templates/settings/personal/personal.info.php が引っかかる。
検索ボックスをhiddenにしているのは`lookupServerUploadEnabled`らしい。
このキーワードでさらに検索すると、server/lib/private/Personal/PersonalInfo.php(dead link https://github.com/nextcloud/server/blob/master/lib/private/Settings/Personal/PersonalInfo.php)中で
`federated`かどうかを調べている。

```
	/**
	 * @return TemplateResponse returns the instance with all parameters set, ready to be rendered
	 * @since 9.1
	 */
	public function getForm() {
		$federatedFileSharingEnabled = $this->appManager->isEnabledForUser('federatedfilesharing');
		$lookupServerUploadEnabled = false;
		if($federatedFileSharingEnabled) {
			$federatedFileSharing = new Application();
			$shareProvider = $federatedFileSharing->getFederatedShareProvider();
			$lookupServerUploadEnabled = $shareProvider->isLookupServerUploadEnabled();
		}
```

確かに共有に関して「色々やっていた」ので、メニュー：設定→共有→統合されたクラウド共有中のあれこれを公開するように変更したら問題解決。

----

ただ、ログインに異常に時間が掛かるようにようになったのと、ログインに失敗したときに内部エラーになっ
てしまうという問題は残ったまま。再インストールでは治らなかったのでやはりDBの新規作り直しが必要なのだ
と思う。

カレンダーを使うとDBが壊れることもあるようだ。色々と勘違いをしていたせいもあり、設定をいじり過
ぎてわけがわからなくなってしまったので、結局データベースの作り直しも含む再インストールになってしまっ
た。
