---
title: Build GNU Source-highlight supporting Rust for NixOS
subtitle: NixOS的にlessをRust対応にしよう
date: 2019-03-10
tags: ["Rust", "NixOS"]
---

Let's Rust syntax highlighten in less!

1. We need to apply [a patch](https://gist.github.com/tav/3846383).
1. To apply the patch, make a simple overlay(~/.config/nixpkgs/overlays/source-highlight.nix) against [the expression](https://github.com/NixOS/nixpkgs/blob/master/pkgs/tools/text/source-highlight/default.nix) in the master branch.
1. But somehow I failed to build it due to lack of makeinfo.
1. So add super.texinfo to the `BuildInputs` in the overlay.
1. Run `nix-env -i source-highliht` and got it.
1. Activate this feature with the following settings:

```bash
export LESS='-R'
export LESSOPEN='|| ~/.nix-profile/bin/src-hilite-lesspipe.sh %s'
```

The double veritical bars are important!

> However, if the first character of LESSOPEN  starts  with  two  vertical  bars, the exit status of the script becomes meaningful.  If the exit status is zero, the output is considered to  be replacement text, even if it empty.  If the exit status is nonzero, any output is ignored and the original file is used.  For compatibility with previous versions of  less, if LESSOPEN starts with only one vertical bar, the exit status of the preprocessor is ignored.

In most cases in which `less` is used as a pager, this settings is identital to the original
behavior. On the other side, with a single bar, `less` clears the sceen to switch to full
screen mode.

### files

- ~/.config/nixpkgs/overlays/source-highlight.nix

```nix
self: super:
{
    sourceHighlight = super.sourceHighlight.overrideAttrs (attrs: {
        buildInputs = [ super.boost super.texinfo ];
        patches = [ ~/.config/nixpkgs/rust.patch ];
    });
}
```

- ~/.config/nixpkgs/rust.patch

```diff
diff -urN source-highlight-3.1.8/src/Makefile.am source-highlight-3.1.8-Rust/src/Makefile.am
--- source-highlight-3.1.8/src/Makefile.am      2015-03-30 22:00:00.000000000 +0900
+++ source-highlight-3.1.8-Rust/src/Makefile.am 2019-03-10 21:38:57.249427742 +0900
@@ -86,7 +86,7 @@
 errors.lang erlang.lang proto.lang vala.lang lisp.lang islisp.lang \
 scheme.lang po.lang opa.lang javalog.lang upc.lang tml.lang \
 lilypond.lang coffeescript.lang go.lang \
-r.lang s.lang zsh.lang groovy.lang json.lang feature.lang
+r.lang s.lang zsh.lang groovy.lang json.lang feature.lang rust.lang
 
 LANGFILES_NOTTOCHECK= \
 tml_formatting_all.lang  tml_macrolinks.lang      tml_macrosdelayed2.lang \
diff -urN source-highlight-3.1.8/src/Makefile.in source-highlight-3.1.8-Rust/src/Makefile.in
--- source-highlight-3.1.8/src/Makefile.in      2015-03-31 00:04:55.000000000 +0900
+++ source-highlight-3.1.8-Rust/src/Makefile.in 2019-03-10 21:39:16.152740165 +0900
@@ -838,7 +838,7 @@
 errors.lang erlang.lang proto.lang vala.lang lisp.lang islisp.lang \
 scheme.lang po.lang opa.lang javalog.lang upc.lang tml.lang \
 lilypond.lang coffeescript.lang go.lang \
-r.lang s.lang zsh.lang groovy.lang json.lang feature.lang
+r.lang s.lang zsh.lang groovy.lang json.lang feature.lang rust.lang
 
 LANGFILES_NOTTOCHECK = \
 tml_formatting_all.lang  tml_macrolinks.lang      tml_macrosdelayed2.lang \
diff -urN source-highlight-3.1.8/src/lang.map source-highlight-3.1.8-Rust/src/lang.map
--- source-highlight-3.1.8/src/lang.map 2015-03-30 20:26:24.000000000 +0900
+++ source-highlight-3.1.8-Rust/src/lang.map    2019-03-10 22:19:59.609966381 +0900
@@ -169,3 +169,5 @@
 groovy = groovy.lang
 json = json.lang
 feature = feature.lang
+rust = rust.lang
+rs = rust.lang
diff -urN source-highlight-3.1.8/src/rust.lang source-highlight-3.1.8-Rust/src/rust.lang
--- source-highlight-3.1.8/src/rust.lang        1970-01-01 09:00:00.000000000 +0900
+++ source-highlight-3.1.8-Rust/src/rust.lang   2019-03-10 13:09:20.711181631 +0900
@@ -0,0 +1,18 @@
+preproc = "import","package"
+
+include "c_comment.lang"
+
+include "number.lang"
+
+string delim "\"" "\"" escape "\\"
+string delim "'" "'"  escape "\\"
+string delim "`" "`"  escape "\\" multiline
+
+keyword = "as|assert|break|const|copy|do|drop|else|enum|export|extern|fail|false|fn|for|if|impl|let|log|loop|match|mod|move|mut|p
riv|pub|pure|ref|return|struct|true|trait|type|unsafe|use|while"
+keyword = "be|self|static|export|assert|log|fail"
+
+type = "bool|char|f32|f64|float|i8|i16|i32|i64|int|str|u8|u16|u32|u64|uint"
+
+include "symbols.lang"
+
+cbracket = "{|}"
```
