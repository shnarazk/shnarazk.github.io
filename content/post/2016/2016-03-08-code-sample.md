---
title: Code Sample
subtitle: Using Hugo Chroma instead of Pygments
date: 2018-06-22
tags: ["hugo"]
---

The following are two code samples using syntax highlighting.

<!--more-->

The following is a code sample using triple backticks ( ``` ) code fencing provided in Hugo. This is client side highlighting and does not require any special installation.

```javascript
    var num1, num2, sum
    num1 = prompt("Enter first number")
    num2 = prompt("Enter second number")
    sum = parseInt(num1) + parseInt(num2) // "+" means "add"
    alert("Sum = " + sum)  // "+" means combine into a string
```

The following is a code sample using the "highlight" shortcode provided in Hugo. This is server side
highlighting and required Python and Pygments to be installed once. But it doesn't now.

{{< highlight javascript >}}
    var num1, num2, sum
    num1 = prompt("Enter first number")
    num2 = prompt("Enter second number")
    sum = parseInt(num1) + parseInt(num2) // "+" means "add"
    alert("Sum = " + sum)  // "+" means combine into a string
{{</ highlight >}}

And here is the same code with line numbers:

{{< highlight javascript "linenos=inline">}}
    var num1, num2, sum
    num1 = prompt("Enter first number")
    num2 = prompt("Enter second number")
    sum = parseInt(num1) + parseInt(num2) // "+" means "add"
    alert("Sum = " + sum)  // "+" means combine into a string
{{</ highlight >}}

In this site it, [chrome](https://gohugo.io/content-management/syntax-highlighting/) is the default highlight engine, activated by ( ``` ) too.

```go-html-template
<section id="main">
  <div>
    <h1 id="title">{{ .Title }}</h1>
    {{ range .Data.Pages }}
      {{ .Render "summary"}}
    {{ end }}
  </div>
</section>
```

And, for me, it accepts the following languages: awk, (e)bnf, make, bash (sh, shell), c, C,
css, lisp, coq, diff, docker, elisp, html, haskell, json, java, javascript, mason, nix,
ocaml (ml), prolog, python(3), R, rust, scheme, smalltalk, (la)tex, xml, yaml, markdown,
text (plain). Wow!



