import path from 'path'
import Vue from 'vue'

Vue.filter('endPoint', function(art) {
  if (art.notebook != null)
    return ('/' + art.year + '/' + art.notebook + '/obs/')
  if (art.gistid != null)
    return ('/' + art.year + '/' + art.gistid + '/ghg/')
  return (
      '/' +
      path.basename(art.dir) +
      '/' +
      path.basename(art.sourceBase, '.md') +
      '/'
    )
})
