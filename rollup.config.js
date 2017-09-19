import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs    from 'rollup-plugin-commonjs'
import buble       from 'rollup-plugin-buble'

module.exports = {
  entry   : 'src/index.js',
  dest    : 'docs/app.js',
  format  : 'iife',
  plugins : [
    nodeResolve({ jsnext: true, main: true, browser: true }),
    commonjs({
      namedExports: { 'node_modules/date-fns/format/index.js': [ 'format' ] }
    }),
    buble(),
  ]
}
