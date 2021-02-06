__NUXT_JSONP__("/2019/2019-07-11-varact-distribution", {data:[{article:Object.create(null,{default:{writable:true,enumerable:true,value:{title:"Development of Var activities (2019-07-11)",subtitle:"変数活性度と変数割当て量の相関",date:"2019-08-25T00:00:00.000Z",tags:["SAT","issue"],bodyContent:"以下は変数活性度の分散（青色の線）と変数割当量のEMA（緑色の線）の時間変化である。\n\n![](\u002Fimg\u002F2019\u002F07-11\u002Fvadist-fixedvars.png)\n\nどうもこの両者には負の相関があるらしい。変数割当てが減ると分散は高くなる。\nこれは、\n\n- リスタートにより活性度が高い変数群の割当てを優先する。\n  他の変数の割当てはなくなり、全体としての割当量は減少する。\n- リスタート後もその矛盾する変数に関連する変数のみ活性度が繰り返し増加する。\n  従って活性度の分散は大きくなる。\n\nということで説明できるだろう。\n\n難しい山を乗り越えたからこそ（変数割当てに関する）進捗があるらしい。\n逆に、割当量が小さくなりながら（困難な矛盾が解決して）新しい変数が見つかる。\nとは言え、決して小ささを維持しようとしているわけではない。\n小さくなった後では大したことはできないと思う。\n\n逆に言うと、落ちるためにまず上がらなければならないのかもしれないが、これは当然、予測不能問題：\n\n- 今、超えないといけないから山を登るべきなのか、\n- 高すぎる=資源を使いすぎたから降りるべきなのか。\n\nしかし、それでもstagnationは\n\n- threshold\n- step\n- 山登り量\n\nのどれかの増加の契機となるはずではなかろうか。\n\n## 2019-07-13\n\n割当て率と平均LBDをガイドにした場合ほど性能がよくない。目的関数にするには、ずれているのかも。確かに割当てを改善しなければ解には到達できないだろう。しかし枝刈りの尺度としては優秀なはずなのだが。\n\n分散は目的ではなく求解過程の（遷移）状態を表現しているのかも。",bodyHtml:"\u003Cp\u003E以下は変数活性度の分散（青色の線）と変数割当量のEMA（緑色の線）の時間変化である。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2019\u002F07-11\u002Fvadist-fixedvars.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eどうもこの両者には負の相関があるらしい。変数割当てが減ると分散は高くなる。\nこれは、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Eリスタートにより活性度が高い変数群の割当てを優先する。\n他の変数の割当てはなくなり、全体としての割当量は減少する。\u003C\u002Fli\u003E\n\u003Cli\u003Eリスタート後もその矛盾する変数に関連する変数のみ活性度が繰り返し増加する。\n従って活性度の分散は大きくなる。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eということで説明できるだろう。\u003C\u002Fp\u003E\n\u003Cp\u003E難しい山を乗り越えたからこそ（変数割当てに関する）進捗があるらしい。\n逆に、割当量が小さくなりながら（困難な矛盾が解決して）新しい変数が見つかる。\nとは言え、決して小ささを維持しようとしているわけではない。\n小さくなった後では大したことはできないと思う。\u003C\u002Fp\u003E\n\u003Cp\u003E逆に言うと、落ちるためにまず上がらなければならないのかもしれないが、これは当然、予測不能問題：\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E今、超えないといけないから山を登るべきなのか、\u003C\u002Fli\u003E\n\u003Cli\u003E高すぎる=資源を使いすぎたから降りるべきなのか。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eしかし、それでもstagnationは\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ethreshold\u003C\u002Fli\u003E\n\u003Cli\u003Estep\u003C\u002Fli\u003E\n\u003Cli\u003E山登り量\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eのどれかの増加の契機となるはずではなかろうか。\u003C\u002Fp\u003E\n\u003Ch2\u003E2019-07-13\u003C\u002Fh2\u003E\n\u003Cp\u003E割当て率と平均LBDをガイドにした場合ほど性能がよくない。目的関数にするには、ずれているのかも。確かに割当てを改善しなければ解には到達できないだろう。しかし枝刈りの尺度としては優秀なはずなのだが。\u003C\u002Fp\u003E\n\u003Cp\u003E分散は目的ではなく求解過程の（遷移）状態を表現しているのかも。\u003C\u002Fp\u003E\n",dir:"article\u002F.json\u002F2019",base:"2019-07-11-varact-distribution.json",ext:".json",sourceBase:"2019-07-11-varact-distribution.md",sourceExt:".md"}},title:{writable:true,enumerable:true,value:"Development of Var activities (2019-07-11)"},subtitle:{writable:true,enumerable:true,value:"変数活性度と変数割当て量の相関"},date:{writable:true,enumerable:true,value:"2019-08-25T00:00:00.000Z"},tags:{writable:true,enumerable:true,value:["SAT","issue"]},bodyContent:{writable:true,enumerable:true,value:"以下は変数活性度の分散（青色の線）と変数割当量のEMA（緑色の線）の時間変化である。\n\n![](\u002Fimg\u002F2019\u002F07-11\u002Fvadist-fixedvars.png)\n\nどうもこの両者には負の相関があるらしい。変数割当てが減ると分散は高くなる。\nこれは、\n\n- リスタートにより活性度が高い変数群の割当てを優先する。\n  他の変数の割当てはなくなり、全体としての割当量は減少する。\n- リスタート後もその矛盾する変数に関連する変数のみ活性度が繰り返し増加する。\n  従って活性度の分散は大きくなる。\n\nということで説明できるだろう。\n\n難しい山を乗り越えたからこそ（変数割当てに関する）進捗があるらしい。\n逆に、割当量が小さくなりながら（困難な矛盾が解決して）新しい変数が見つかる。\nとは言え、決して小ささを維持しようとしているわけではない。\n小さくなった後では大したことはできないと思う。\n\n逆に言うと、落ちるためにまず上がらなければならないのかもしれないが、これは当然、予測不能問題：\n\n- 今、超えないといけないから山を登るべきなのか、\n- 高すぎる=資源を使いすぎたから降りるべきなのか。\n\nしかし、それでもstagnationは\n\n- threshold\n- step\n- 山登り量\n\nのどれかの増加の契機となるはずではなかろうか。\n\n## 2019-07-13\n\n割当て率と平均LBDをガイドにした場合ほど性能がよくない。目的関数にするには、ずれているのかも。確かに割当てを改善しなければ解には到達できないだろう。しかし枝刈りの尺度としては優秀なはずなのだが。\n\n分散は目的ではなく求解過程の（遷移）状態を表現しているのかも。"},bodyHtml:{writable:true,enumerable:true,value:"\u003Cp\u003E以下は変数活性度の分散（青色の線）と変数割当量のEMA（緑色の線）の時間変化である。\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Cimg src=\"\u002Fimg\u002F2019\u002F07-11\u002Fvadist-fixedvars.png\" alt=\"\"\u003E\u003C\u002Fp\u003E\n\u003Cp\u003Eどうもこの両者には負の相関があるらしい。変数割当てが減ると分散は高くなる。\nこれは、\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Eリスタートにより活性度が高い変数群の割当てを優先する。\n他の変数の割当てはなくなり、全体としての割当量は減少する。\u003C\u002Fli\u003E\n\u003Cli\u003Eリスタート後もその矛盾する変数に関連する変数のみ活性度が繰り返し増加する。\n従って活性度の分散は大きくなる。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eということで説明できるだろう。\u003C\u002Fp\u003E\n\u003Cp\u003E難しい山を乗り越えたからこそ（変数割当てに関する）進捗があるらしい。\n逆に、割当量が小さくなりながら（困難な矛盾が解決して）新しい変数が見つかる。\nとは言え、決して小ささを維持しようとしているわけではない。\n小さくなった後では大したことはできないと思う。\u003C\u002Fp\u003E\n\u003Cp\u003E逆に言うと、落ちるためにまず上がらなければならないのかもしれないが、これは当然、予測不能問題：\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003E今、超えないといけないから山を登るべきなのか、\u003C\u002Fli\u003E\n\u003Cli\u003E高すぎる=資源を使いすぎたから降りるべきなのか。\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eしかし、それでもstagnationは\u003C\u002Fp\u003E\n\u003Cul\u003E\n\u003Cli\u003Ethreshold\u003C\u002Fli\u003E\n\u003Cli\u003Estep\u003C\u002Fli\u003E\n\u003Cli\u003E山登り量\u003C\u002Fli\u003E\n\u003C\u002Ful\u003E\n\u003Cp\u003Eのどれかの増加の契機となるはずではなかろうか。\u003C\u002Fp\u003E\n\u003Ch2\u003E2019-07-13\u003C\u002Fh2\u003E\n\u003Cp\u003E割当て率と平均LBDをガイドにした場合ほど性能がよくない。目的関数にするには、ずれているのかも。確かに割当てを改善しなければ解には到達できないだろう。しかし枝刈りの尺度としては優秀なはずなのだが。\u003C\u002Fp\u003E\n\u003Cp\u003E分散は目的ではなく求解過程の（遷移）状態を表現しているのかも。\u003C\u002Fp\u003E\n"},dir:{writable:true,enumerable:true,value:"article\u002F.json\u002F2019"},base:{writable:true,enumerable:true,value:"2019-07-11-varact-distribution.json"},ext:{writable:true,enumerable:true,value:".json"},sourceBase:{writable:true,enumerable:true,value:"2019-07-11-varact-distribution.md"},sourceExt:{writable:true,enumerable:true,value:".md"}})}],fetch:[],mutations:[]});