import db from '~/article/.json/db.json'

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
  bag.forEach(entry => {
    entry[1] = entry[1].sort().reverse()
  })
  return bag
}
