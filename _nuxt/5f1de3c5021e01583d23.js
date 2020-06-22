(window.webpackJsonp=window.webpackJsonp||[]).push([[84],{556:function(n){n.exports=JSON.parse('{"title":"Duplicate Learnt Clauses","subtitle":"ECAI 2020","date":"2020-06-23T00:00:00.000Z","tags":["SAT"],"bodyContent":"Google Scholar alert 発令。今日のお題は「重複した学習節による速度向上」！？\\n\\n* S. Kochemazov, O. Zaikin, A. Semenov, and V. Kondratiev, “Speeding Up CDCL Inference With Duplicate Learnt Clauses,” 2020.\\n\\nduplicateは複数持つのではなく何度でも現れるという意味だ。\\nそのような節を削除せずに保持することで求解数が向上する（そういう問題セットが存在する）とのこと。\\n論文ではHash表を使って再出現を検知しようとしているようだ。\\nLBDによる層化は必ずしも正しいとは限らないと。\\n\\n変数に比べ節の尺度はそれほど注意が払われてなかったかもしれない。\\nLBDに依らない尺度を検討するなら、変数活性度の流用だろうか。\\nちょっと試してみるとそれほど悪くないような。\\n\\nあう、[vivification](2020/2020-06-20-vivification/)前提か。うーん、実装を急がねば。。。","bodyHtml":"<p>Google Scholar alert 発令。今日のお題は「重複した学習節による速度向上」！？</p>\\n<ul>\\n<li>S. Kochemazov, O. Zaikin, A. Semenov, and V. Kondratiev, “Speeding Up CDCL Inference With Duplicate Learnt Clauses,” 2020.</li>\\n</ul>\\n<p>duplicateは複数持つのではなく何度でも現れるという意味だ。\\nそのような節を削除せずに保持することで求解数が向上する（そういう問題セットが存在する）とのこと。\\n論文ではHash表を使って再出現を検知しようとしているようだ。\\nLBDによる層化は必ずしも正しいとは限らないと。</p>\\n<p>変数に比べ節の尺度はそれほど注意が払われてなかったかもしれない。\\nLBDに依らない尺度を検討するなら、変数活性度の流用だろうか。\\nちょっと試してみるとそれほど悪くないような。</p>\\n<p>あう、<a href=\\"2020/2020-06-20-vivification/\\">vivification</a>前提か。うーん、実装を急がねば。。。</p>\\n","dir":"article/.json/2020","base":"2020-06-22-duplicate-learnt-clause.json","ext":".json","sourceBase":"2020-06-22-duplicate-learnt-clause.md","sourceExt":".md"}')}}]);