# What's this!?

```apl
•Show a ← 3‿3⥊↕9
•Show b ← 3‿3 •rand.Range 10
ProductIndices ← {d←𝕩⋄({(((⊑𝕩)⊸⋈)(⋈)(⋈⟜(1⊑𝕩)))¨↕d}⋈)⌜˜↕𝕩}
MyProduct ← {(+´((𝕩⊑˜1⊸⊑)×(𝕨⊑˜0⊸⊑))¨)⌜ ProductIndices ≠𝕨}
Product ← +˝∘×⎉1‿∞
```

これは配列の積を計算する方法を比べたもの。
最後の式はbqncrateにあったもので、意味わからさのあまりcommitしたようだ。
