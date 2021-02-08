---
title: Evil (and vim) cheat sheet
date: 2019-08-18
tags: ['Emacs', 'evil', 'Vim']
---

## Basic :: object / mark / register

#### object

```plaintext
b      - a block by ()
t      - tag
w      - a small word
W      - a big word
$      - math mode in latex
i{o}   - inner text object {o}
a{o}   - around text object {o}
s{o}   - [Surround] surround object {o} in normal mode
S{o}   - [Surround] surround object {o} in visual mode
```

#### mark (location)

```plaintext
.      - last changed position (jump there by ` or ')
^      - last insert position
-      - latest small delete, which is a delete smaller than 1 line
[      - beginning of previously changed or yanked text
]      - end of previously changed or yanked text
<      - beginning of last visual selection
>      - end of last visual selection
```

#### register

```plaintext
0 to 9 - latest to 10th yanked text
"      - latest deleted or yanked text
.      - latest inserted text
+      - clipboard
:      - latest executed command (f.e. @:)
%      - current file path
#      - alternate file path
=      - expression register, taking an elisp expression
:reg   - list up the contents
```

---

## Normal Mode :: motion / operator

#### motion

```plaintext
h 	- move left
j 	- move down
k 	- move up
l	- move right
w 	- jump by start of words (punctuation considered words)
W 	- jump by words (spaces separate words)
b 	- jump backward by words (punctuation considered words)
B 	- jump backward by words (no punctuation)
e 	- jump to end of words (punctuation considered words)
E 	- jump to end of words (no punctuation)
ge 	- jump backward to end of words (punctuation considered words)
gE 	- jump backward to end of words (no punctuation)
f{c} 	- jump forward to the character {c}
F{c} 	- jump backward to the character {c}
t{c} 	- jump forward by the character {c}
T{c} 	- jump backward by the character {c}
; 	- repeat the last {fFtT}
, 	- repeat the last {fFtT} in reverse direction
0 	- (zero) start of line
^ 	- first non-blank character of line
$ 	- end of line
gg 	- go to first line
[N]G 	- go to line N. No N: last line
`{m} 	- jump to the marked position {m}
'{m} 	- jump to the marked line {m}
```

#### register operator

```plaintext
["{r}]d 	- delete target [to register {r}]
["{r}]y 	- yank target [to register]
["{r}]P 	- put (paste) the clipboard after cursor/current line [from register]
["{r}]p 	- put (paste) before cursor/current line [from register]
```

---

## Normal Mode Command :: search / edit / movement

#### search

```plaintext
/pattern 	- search for pattern
?pattern 	- search backward for pattern
n 		- repeat search in same direction
N 		- repeat search in opposite direction
* 		- search the word on cursor
:%s/old/new/g 	- replace all old with new throughout file
:%s/old/new/gc 	- replace all old with new throughout file with confirmations
```

#### edit

```plaintext
i 	- start insert mode at cursor
I 	- insert at the beginning of the line
a 	- append after the cursor
A 	- append at the end of the line
o 	- open (append) blank line below current line (no need to press return)
O 	- open blank line above current line
. 	- repeat last command
u 	- undo
Ctrl-r 	- redo
x 	- delete current character
X 	- delete previous character
s 	- delete character at cursor and substitute text
r 	- replace a single character (does not use insert mode)
J 	- join line below to the current one
~ 	- switch case
>> 	- indent line one column to right
<< 	- indent line one column to left
== 	- auto-indent current line
q{m} 	- start recording a macro into {m}
q 	- end macro recording
@{m} 	- execute macro {m}
```

#### movement

```plaintext
m{m} 	- mark the current position to {m} (jump there by ` or ')
Ctrl-b 	- page up
Ctrl-f 	- page down
% 	- jump to matching brace
z. 	- recenter
zz 	- jump to center of screen
zt 	- jump to the top of screen
zb 	- jump to the bottom of screen
```

---

## Visual Mode :: mark / commands

#### mark

```plaintext
v 	- start visual mode, mark lines, then do command (such as y-yank)
V 	- start Linewise visual mode
Ctrl-v 	- start visual block mode
o 	- move to other end of marked area
O 	- move to Other corner of block
```

#### commands

```plaintext
> 	- shift right
< 	- shift left
c 	- change (replace) marked text
y 	- yank (copy) marked text
d 	- delete (cut) marked text
~ 	- switch case
U 	- upper case of marked area
v	- exit visual mode
S 	- [Surround] insert surrounding
```

---

## Insert Mode

```plaintext
Esc 		- exit insert mode
\ 		- execute an command
Ctrl-r{r} 	- insert the content in register {r}
Ctrl-w 		- backward delete a word
Ctrl-y 		- copy a char in above line
Ctrl-e 		- copy a char in below line
```

---

## Interface :: buffer / windows / tab / exit

#### buffer

```plaintext
:edit filename 	- Edit a file in a new buffer
:new **/* 	- Open new files
:bnext		- go to next buffer
:bprev 		- go to previous buffer
:bd   		- delete a buffer (close a file)
```

#### window

```plaintext
:sp filename 	- Open a file in a new buffer and split window
Ctrl-w s 	- Split windows
Ctrl-w w 	- switch between windows
Ctrl-w q 	- Quit a window
Ctrl-w v 	- Split windows vertically
```

#### tab

```plaintext
gt		- next tab
gT		- previous tab
:tabr		- first tab
:tabl		- last tab
:tabe filename 	- Edit a file in a new tab (vim7)
:tabm [n]	- move current tab after tab n. no n: last. n=0: first.
```

#### exit

```plaintext
:w		- write (save) the file, but don't exit
:wq 		- write (save) and quit
:x		- same as :wq
:q		- quit (fails if anything has changed)
:q!		- quit and throw away changes
:setlocal fileformat=dos|unix | fileencoding=utf-8
:viusage 	- show a huge cheat sheet listing every command
:help
```

---

## Cliche

```plaintext
cs({    - [Surround] change surrounding parens to curly braces
xp 		- transpose two letters (delete and paste, technically)
g~iw 		- switch case of current word
guiw 		- make current word uppercase
guiw 		- make current word lowercase
ddp 		- swap current line with next
ddkp 		- swap current line with previous
:set paste 	- avoid unexpected effects in pasting
ds(    		- [Surround] delete the surrounding parens
```
