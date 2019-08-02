import path from 'path'
import Vue from 'vue'

Vue.filter('endPoint', function(art) {
  if (art.sourceExt === 'observable')
    return '/' + art.year + '/' + art.notebook + '/obs/'
  else
    return (
      '/' +
      path.basename(art.dir) +
      '/' +
      path.basename(art.sourceBase, '.md') +
      '/'
    )
})
