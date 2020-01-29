---
title: A Visualization tool to analyze logic fomula
subtitle: I need better intuition
date: 2020-01-28
tags: ["SAT", "Pharo"]
---
論理式がどう変化していくか視覚化したい。

ベンチマークで使われている問題の中には3SATみたいに変数数が少ないのだが、どうやっても解けないものもある。
単に3SATなんだけも相転移点に近くて難しいのか、ランダムではあるが3SATではないのか、3SATではあるけどランダムではないのか（いやだったらむしろやさしくなりそう）、いったいどういう問題を相手にしているのか、ソルバーが何も考えずに取り組む前に人間が分析をしないことには進展はないのではないか？

というわけで何か統計量だけでなく色々と視覚的に表示してくれるツールが必要かなあという気がしていた。
JavaScript(Vue.js or Observable)で作るか、それともいっそのことPharoに手を出してみようか（これこそSmalltalk環境の出番のようだがGraphvisの上位互換程度のことはできているのだろうか？）。

ちょっと考え中。というか調査しなければ。


## 2020-01-28

数日Pharo 8.0で遊んでみたんだけど、

- *Icebergがファイル .project の状態を理解できてないのでいつまで経ってもdirtyになる*
  **これは~/.config/git/ignore でおそらくJava用に.projectを追加していたせいだった！**
- Icebergはコメントも付かずにほったらかしのissuesが多い、エラーへの対応がわからない
- Iceberg, Metacelloあたりのドキュメントが古い
- リリース8.0で何がどうなったのか情報なさすぎ
- wiki情報も古い
- Baselineが面倒くさそう

~~というあたりがどうにも我慢できなくて、やはり使うのはやめることにした。エラーの発生が多すぎて、やる気が削がれた。しょうがない、D3.jsで頑張るしかないか。~~

上の文は取り消して、もうしばらく遊んでみる。

## 2020-01-29

Pharo 8.0でSystem Browserでプロジェクトを選んでコンテキストメニューからcommitしようとするとエラーになる。
以下のメソッドがないエラーなので、でっち上げた。

- `IceLibgitRepository >> #hasUnbornProject`
- `IceLibgitRepository >> #isDetached`

```
OmEntry {
	#tags : {
		#prior : OmNullReference [  ],
		#self : OmReference [ '1' ]
	},
	#content : EpProtocolAddition {
		#behavior : RGClassDefinition {
			#annotations : IdentityDictionary {
				#definitionSource : 'IceRepository subclass: #IceLibgitRepository\r\tinstanceVariableNames: \'location commitCache handle\'\r\tclassVariableNames: \'DefaultCodeSubdirectory DefaultFileFormatType ShareRepositoriesBetweenImages SharedRepositoriesLocation\'\r\tpoolDictionaries: \'\'\r\tcategory: \'Iceberg-Libgit-Core\'',
				#superclassName : 'IceRepository',
				#traitCompositionSource : '{}'
			},
			#name : #IceLibgitRepository,
			#methods : IdentityDictionary { },
			#protocols : Set [ ],
			#instanceVariables : OrderedCollection [
				RGInstanceVariableDefinition {
					#annotations : IdentityDictionary {
						#className : #IceLibgitRepository,
						#isMetaSide : false
					},
					#name : #location,
					#parent : @6
				},
				RGInstanceVariableDefinition {
					#annotations : IdentityDictionary {
						#className : #IceLibgitRepository,
						#isMetaSide : false
					},
					#name : #commitCache,
					#parent : @6
				},
				RGInstanceVariableDefinition {
					#annotations : IdentityDictionary {
						#className : #IceLibgitRepository,
						#isMetaSide : false
					},
					#name : #handle,
					#parent : @6
				}
			],
			#metaClass : RGMetaclassDefinition {
				#annotations : IdentityDictionary {
					#definitionSource : 'IceLibgitRepository class\r\tinstanceVariableNames: \'\'',
					#traitCompositionSource : '{}'
				},
				#name : #'IceLibgitRepository class',
				#methods : IdentityDictionary { },
				#protocols : Set [ ],
				#instanceVariables : OrderedCollection [ ],
				#baseClass : @6
			},
			#comment : RGCommentDefinition {
				#annotations : IdentityDictionary {
					#className : #IceLibgitRepository,
					#isMetaSide : false
				},
				#parent : @6,
				#content : 'I am an iceberg repository that uses libgit as backend.\rI have a handle to a LGitRepository that is lazily initialized on usage, and cleaned up on every shutdown (automatically done by uFFI).\r\rEvery access to the libgit repository should be wrapped with a call to #handleLibgitError: to manage possible libgit errors and transform them to a correct iceberg error.',
				#stamp : ''
			},
			#classVariables : OrderedCollection [
				RGClassVariableDefinition {
					#annotations : IdentityDictionary {
						#className : #IceLibgitRepository,
						#isMetaSide : false
					},
					#name : #DefaultCodeSubdirectory,
					#parent : @6
				},
				RGClassVariableDefinition {
					#annotations : IdentityDictionary {
						#className : #IceLibgitRepository,
						#isMetaSide : false
					},
					#name : #DefaultFileFormatType,
					#parent : @6
				},
				RGClassVariableDefinition {
					#annotations : IdentityDictionary {
						#className : #IceLibgitRepository,
						#isMetaSide : false
					},
					#name : #ShareRepositoriesBetweenImages,
					#parent : @6
				},
				RGClassVariableDefinition {
					#annotations : IdentityDictionary {
						#className : #IceLibgitRepository,
						#isMetaSide : false
					},
					#name : #SharedRepositoriesLocation,
					#parent : @6
				}
			],
			#category : #Iceberg-Libgit-Core,
			#package : #Iceberg-Libgit,
			#sharedPools : OrderedCollection [ ]
		},
		#protocol : #validating
	}
}

OmEntry {
	#tags : {
		#prior : OmReference [ '1' ],
		#self : OmReference [ '2' ]
	},
	#content : EpMethodAddition {
		#method : RGMethodDefinition {
			#annotations : IdentityDictionary {
				#className : #IceLibgitRepository,
				#isMetaSide : false
			},
			#name : #isDetached,
			#protocol : #validating,
			#sourceCode : 'isDetached \r  ^workingCopy isDetached',
			#stamp : 'shnarazk 1/29/2020 22:54',
			#package : #Iceberg-Libgit
		}
	}
}

OmEntry {
	#tags : {
		#prior : OmReference [ '2' ],
		#self : OmReference [ '3' ]
	},
	#content : EpMethodAddition {
		#method : RGMethodDefinition {
			#annotations : IdentityDictionary {
				#className : #IceLibgitRepository,
				#isMetaSide : false
			},
			#name : #hasUnbornProject,
			#protocol : #validating,
			#sourceCode : 'hasUnbornProject \r^false',
			#stamp : 'shnarazk 1/29/2020 22:59',
			#package : #Iceberg-Libgit
		}
	}
}
```
