import path from 'path'
const fs = require('fs')
const { promisify } = require('util')
const { Feed } = require('feed')

module.exports = function() {
  // generate が終わったタイミングで実行する
  this.nuxt.hook('generate:done', async generator => {
    const json = await promisify(fs.readFile)('article/.json/db.json', 'utf-8')
    const entries = Object.entries(await JSON.parse(json).fileMap)
    entries.sort()
    entries.reverse()
    const feed = new Feed({
      title: 'Just a Note',
      description: 'a collection of memo',
      generator: 'nuxtjs/feed'
    })
    for (let i = 0; i < 20; i++) {
      const entry = entries[i][1]
      const year = entry.date.substring(0, 4)
      const id = path.basename(entry.sourceBase, '.md')
      feed.addItem({
        title: entry.title,
        id: `https://shnarazk.now.sh/${year}/${id}`,
        link: `https://shnarazk.now.sh/${year}/${id}`,
        date: new Date(entry.date)
      })
      feed.addContributor({
        name: 'Shuji Narazaki',
        email: 'shujinarazaki@protonmail.com',
        link: 'https://medium.com/@shnarazk'
      })
    }

    // RSS 2.0 形式で ./dist/feed.xml に書き込む
    await promisify(fs.writeFile)('./dist/feed.xml', feed.rss2())

    // ログ
    // console.log('Output feed.xml')
  })
}
