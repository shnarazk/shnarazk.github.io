import db from '~/static/db.json'

export const state = () => ({
  articles: db.fileMap,
  sourceFiles: db.sourceFileArray,
  blogTags: buildTags(db.fileMap)
})

export const mutations = {
  articles_inject(state, payload) {
    state.articles = payload
  }
}

function buildTags(arts) {
  const bag = []
  const arr = Object.entries(arts)
  // for (const e in arr) {
  /// bag.push(e)
  // const article = arts[key]
  // if (article.hasOwnPropety('tags')) {
  //   article.tags.forEach(t => {
  //     if (bag[t] === undefined) {
  //       bag.push(t)
  //     }
  //     bag[t].push(article)
  //   })
  // }
  // }
  arr.forEach(val => {
    const art = val[1]
    art.tags.forEach(tag => {
      const t = tag.toLowerCase()
      const target = bag.find(item => item[0] === t)
      if (target === undefined) {
        bag.push([t, [art]])
      } else {
        target[1].push(art)
      }
    })
  })
  bag.sort()
  return bag
}
