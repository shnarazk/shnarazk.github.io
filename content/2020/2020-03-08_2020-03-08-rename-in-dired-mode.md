---
title: File renaming in dired mode on GNU Emacs
extra:
  subtitle: with default filename
taxonomies:
  tags: ["Emacs"]
---
dired modeでリネームする際にデフォルト値として元ファイル名を使いたい場面が非常に多かったので
いじってみた。

```lisp
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

元々は以下の定義です。

```lisp
;;; dired-aux.el
(defun dired-mark-read-file-name (prompt dir op-symbol arg files
                                         &optional default)
  (dired-mark-pop-up
   nil op-symbol files
   #'read-file-name
   (format prompt (dired-mark-prompt arg files)) dir default))
```

個人的にはかなり快適になりました。
