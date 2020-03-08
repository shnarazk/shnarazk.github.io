---
title: File renaming in dired mode on GNU Emacs
subtitle: with default filename
date: 2020-03-08
tags: ["Emacs"]
---
dired modeでリネームする際にでフォールトとして元ファイル名を使いたい場面が非常に多かったので
いじってみた。

```
(eval-after-load "dired-aux"
  '(progn
     (defun dired-mark-read-file-name (prompt dir op-symbol arg files
					      &optional default)
       (dired-mark-pop-up
	nil op-symbol files
	#'read-file-name
	(format prompt (dired-mark-prompt arg files)) dir default nil
	(and default (file-name-nondirectory default))))))
```

個人的にはかなり快適になった。
