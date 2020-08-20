(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{573:function(n){n.exports=JSON.parse('{"title":"Implementing vivification on Splr","subtitle":"vivification part 3","date":"2020-08-19T00:00:00.000Z","tags":["SAT","vivification","splr"],"banner":"https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80","bodyContent":"**cover image: https://unsplash.com/photos/-IMlv9Jlb24**\\n\\nVersion 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。\\nSAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。\\nvivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。\\n\\n## 1. gratgenのこういうメッセージがどうやっても解消できない\\n\\n```text\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\n```\\n\\nうーん、そんなはずはないのだが。。。\\n\\n答え：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。\\n\\n## 2. なぜかAssignStack中に未割り当てリテラルが出現する","bodyHtml":"<p><strong>cover image: https://unsplash.com/photos/-IMlv9Jlb24</strong></p>\\n<p>Version 0.4.2 リリース直前のSplr、性能的には妥協できるものが出来たので次の課題は妥当性。\\nSAT問題はいいのだけど、UNSAT問題に対する certification がおかしなものになっているとか。\\nvivification を切ると問題が解消するので、vivify時の節の追加削除が正しくcertification に反映されてないようだ。</p>\\n<h2>1. gratgenのこういうメッセージがどうやっても解消できない</h2>\\n<pre><code class=\\"hljs\\">c Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)\\nc Ignoring deletion of non-existent clause (pos 30441)</code></pre><p>うーん、そんなはずはないのだが。。。</p>\\n<p>答え：節内リテラルの順序とcertificateに書き出されたものでの順序とが一致していなかった。</p>\\n<h2>2. なぜかAssignStack中に未割り当てリテラルが出現する</h2>\\n","dir":"article/.json/2020","base":"2020-08-19-splr-with-vivification.json","ext":".json","sourceBase":"2020-08-19-splr-with-vivification.md","sourceExt":".md"}')}}]);