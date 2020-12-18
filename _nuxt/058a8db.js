(window.webpackJsonp=window.webpackJsonp||[]).push([[107],{602:function(n){n.exports=JSON.parse('{"title":"Rust製のSATソルバーで64x64のSudokuが解けるだろうか","subtitle":"Sudokuシリーズその3","date":"2020-12-18T00:00:00.000Z","tags":["splr","sudoku"],"banner":"/img/2020/12-18/banner.jpg","bodyContent":"Splr-0.6.0のリリース直前のベンチマークをしながら、息抜きでもっと大きなSudokuを探してみました。\\n\\nhttp://www.sudoku-download.net/sudoku_64x64.php\\n\\nさあこの問題を[Splrで解いてみよう](https://github.com/shnarazk/miracle_sudoku/blob/master/src/bin/sudoku64.rs)。\\n\\n元データがpdfしかないので人手で取り込み、変換、間違いの修正に3時間掛かって、ようやくSplrの出番。20秒で正解でした。\\n\\n大きさの割に空欄が少ないのでN=25と比べてそんなに計算量は増えないだろうと思ったのが2桁近く増えてしまった。なかなか勘はあたらないものだなあ。\\nちなみに生成されるCNFの大きさはこんな感じ。コミットしなくてよかった。\\n\\n```\\n$ head -4 sudoku64.cnf \\nhead -1 sudoku64.cnf headsudoku64.cnf\\np cnf 262144 41048269\\n$ ls -lh *.cnf\\nls -lh *.cnfls*\\n-rw-r-----+ 1 nash staff  14M 12 18 14:41 sudoku25.cnf\\n-rw-r-----+ 1 nash staff 678M 12 18 15:24 sudoku64.cnf\\n$ \\n```\\n\\nということで今日も5時間ほど遊んでしまった。はやく年賀状描かねば。。。","bodyHtml":"<p>Splr-0.6.0のリリース直前のベンチマークをしながら、息抜きでもっと大きなSudokuを探してみました。</p>\\n<p>http://www.sudoku-download.net/sudoku_64x64.php</p>\\n<p>さあこの問題を<a href=\\"https://github.com/shnarazk/miracle_sudoku/blob/master/src/bin/sudoku64.rs\\">Splrで解いてみよう</a>。</p>\\n<p>元データがpdfしかないので人手で取り込み、変換、間違いの修正に3時間掛かって、ようやくSplrの出番。20秒で正解でした。</p>\\n<p>大きさの割に空欄が少ないのでN=25と比べてそんなに計算量は増えないだろうと思ったのが2桁近く増えてしまった。なかなか勘はあたらないものだなあ。\\nちなみに生成されるCNFの大きさはこんな感じ。コミットしなくてよかった。</p>\\n<pre><code>$ head -4 sudoku64.cnf \\nhead -1 sudoku64.cnf headsudoku64.cnf\\np cnf 262144 41048269\\n$ ls -lh *.cnf\\nls -lh *.cnfls*\\n-rw-r-----+ 1 nash staff  14M 12 18 14:41 sudoku25.cnf\\n-rw-r-----+ 1 nash staff 678M 12 18 15:24 sudoku64.cnf\\n$ \\n</code></pre>\\n<p>ということで今日も5時間ほど遊んでしまった。はやく年賀状描かねば。。。</p>\\n","dir":"article/.json/2020","base":"2020-12-18-sudoku64.json","ext":".json","sourceBase":"2020-12-18-sudoku64.md","sourceExt":".md"}')}}]);