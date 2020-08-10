import axios from 'axios'
import db from '~/article/.json/db.json'
import gist from '~/article/githubgist.json'
import ob from '~/article/obs.json'

// injectGitHubGist(gist)

export const state = () => ({
  articles: {
    ...db.fileMap,
    ...gist,
    ...ob,
  },
  blogTags: buildTags({ ...db.fileMap, ...gist, ...ob }),
  sourceFiles: db.sourceFileArray,
})

export const mutations = {
  articles_inject(state, payload) {
    state.articles = payload
  },
}

async function injectGitHubGist(arts) {
  const arr = Object.entries(arts)
  arr.forEach((val) => {
    const art = val[1]
    if (art.gistid !== undefined) {
      art.url = 'https://gist.github.com/' + art.owner + '/' + art.gistid
      axios
        .get(art.url + '.json')
        .then((res) => {
          art.content = res.div
        })
        .catch(function (e) {
          art.content = `${e}: ${art.url}.json`
        })
    }
  })
  return arr
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
