import path from 'path'
import Vue from 'vue'

Vue.filter('endPoint', function(art) {
  return (
    '/' +
    path.basename(art.dir) +
    '/' +
    path.basename(art.sourceBase, '.md') +
    '/'
  )
})
