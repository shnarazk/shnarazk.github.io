import axios from 'axios'
import db from '~/article/.json/db.json'
import gist from '~/article/githubgist.json'
import ob from '~/article/obs.json'

export const state = () => ({
  articles: {
    ...db.fileMap,
    ...gist,
    ...ob,
  },
  blogTags: buildTags({ ...db.fileMap, ...gist, ...ob }),
  sourceFiles: db.sourceFileArray,
})

export const actions = {
  async nuxtServerInit({ commit }) {
    const arr = Object.entries(gist)
    for(let val of arr) {
      const art = val[1]
      if (art.gistid !== undefined) {
        art.url = `https://gist.github.com/${art.owner}/${art.gistid}`
        const j = await axios.get(`${art.url}.json`)
        if (j.data === undefined)
          art.content = `could not load ${art.url}.json`
        else {
          art.content = j.data.div
          art.description = j.data.description
          art.created_at = j.data.created_at.substring(0, 10)
        }
      }
    }
    commit('mutations', arr)
  }
}

function buildTags(arts) {
  const bag = []
  const arr = Object.entries(arts)
  arr.forEach((val) => {
    const art = val[1]
    art.tags.forEach((tag) => {
      const t = tag.toLowerCase()
      const target = bag.find((item) => item[0] === t)
      if (target === undefined) {
        bag.push([t, [art]])
      } else {
        target[1].push(art)
      }
    })
  })
  bag.sort()
  bag.forEach((entry) => {
    entry[1] = entry[1].sort().reverse()
  })
  return bag
}
