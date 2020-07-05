(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{491:function(n){n.exports=JSON.parse('{"title":"Kernel Density Estimation in R","subtitle":"Rでカーネル密度推定の可視化","date":"2018-06-20T00:00:00.000Z","tags":["R"],"bodyContent":"```R\\n#!/usr/bin/env Rscript\\n\\nlibrary(\\"MASS\\")\\nlibrary(\\"KernSmooth\\")\\n\\narg1 = commandArgs(trailingOnly=TRUE)[1]\\nd = read.csv(arg1, header=T, sep=\\",\\", comment=\\"#\\")\\n\\nbx <- max(0.1, bandwidth.nrd(d[,1]))\\nby <- max(0.1, bandwidth.nrd(d[,2]))\\nk <- kde2d(d[,1], d[,2], c(bx, by), n=30)\\n\\npng(paste(arg1, \\"-dens.png\\", sep=\\"\\"))\\nimage(k)\\ndev.off()\\n\\npng(paste(arg1, \\"-contour.png\\", sep=\\"\\"))\\ncontour(k)\\ndev.off()\\n```","bodyHtml":"<pre><code class=\\"hljs\\"><span class=\\"hljs-comment\\">#!/usr/bin/env Rscript</span>\\n\\n<span class=\\"hljs-keyword\\">library</span>(<span class=\\"hljs-string\\">\\"MASS\\"</span>)\\n<span class=\\"hljs-keyword\\">library</span>(<span class=\\"hljs-string\\">\\"KernSmooth\\"</span>)\\n\\narg1 = commandArgs(trailingOnly=<span class=\\"hljs-literal\\">TRUE</span>)[<span class=\\"hljs-number\\">1</span>]\\nd = read.csv(arg1, header=<span class=\\"hljs-literal\\">T</span>, sep=<span class=\\"hljs-string\\">\\",\\"</span>, comment=<span class=\\"hljs-string\\">\\"#\\"</span>)\\n\\nbx &lt;- max(<span class=\\"hljs-number\\">0.1</span>, bandwidth.nrd(d[,<span class=\\"hljs-number\\">1</span>]))\\nby &lt;- max(<span class=\\"hljs-number\\">0.1</span>, bandwidth.nrd(d[,<span class=\\"hljs-number\\">2</span>]))\\nk &lt;- kde2d(d[,<span class=\\"hljs-number\\">1</span>], d[,<span class=\\"hljs-number\\">2</span>], c(bx, by), n=<span class=\\"hljs-number\\">30</span>)\\n\\npng(paste(arg1, <span class=\\"hljs-string\\">\\"-dens.png\\"</span>, sep=<span class=\\"hljs-string\\">\\"\\"</span>))\\nimage(k)\\ndev.off()\\n\\npng(paste(arg1, <span class=\\"hljs-string\\">\\"-contour.png\\"</span>, sep=<span class=\\"hljs-string\\">\\"\\"</span>))\\ncontour(k)\\ndev.off()</code></pre>","dir":"article/.json/2018","base":"2018-06-20-KDE-in-R.json","ext":".json","sourceBase":"2018-06-20-KDE-in-R.md","sourceExt":".md"}')}}]);