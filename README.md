![Build Status](https://github.com/shnarazk/shnarazk.github.io/badges/master/build.svg)

---

# A Blog powered with vue.js + nuxt.js

### History of the blog generator called *JANG*

#### 2.0.0 beta, 2021-09-18

- Switch to Zola from node.js-based in-house generator

#### 1.0.3, 2021-03-16
- add entry `banner_caption` in 'first matter'

#### 1.0.2, 2020-08-14
- Import entries from [GitHubGist](https://gist.github.com/)

#### 1.0.1
- Add entry banner image via 'first matter'
- Import entries from [Observable](https://observablehq.com/)

# Build Setup

All sub directories under /content/note/ should have it as `_index.md`.

```
---
title: test
template: index.html
page_template: page.html
transparent: true
---
```
