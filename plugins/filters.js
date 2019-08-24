import path from 'path'
import Vue from 'vue'

Vue.filter('endPoint', function(art) {
  if (art.notebook == null)
    return (
      '/' +
      path.basename(art.dir) +
      '/' +
      path.basename(art.sourceBase, '.md') +
      '/'
    )
  else return '/' + art.year + '/' + art.notebook + '/obs/'
})
