const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const fs = require('fs')
const path = require('path')
const pages = path.resolve(__dirname, 'src/client/pages')

module.exports = async (env, argv) => {
  const pageFiles = await fs.readdirSync(pages)
  const entry = pageFiles.reduce((result, file) => {
    result[file.replace(/\.jsx$/, '')] = `${pages}/${file}`
    return result
  }, {})

  return {
    mode: argv.mode || 'none',
    entry: entry,

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
    },

    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          loader: 'babel-loader'
        }
      ]
    },

    resolve: {
      extensions: ['.js', '.jsx']
    },

    plugins: [
      ...Object.keys(entry).map((page) => (
        new HtmlWebpackPlugin({
          template: path.resolve(__dirname, 'index.html'),
          chunks: [ page ],
          filename: page === 'index' ? 'index.html' : `${page}/index.html`
        })
      )),
      new CopyWebpackPlugin([{ from: 'static', to: 'static' }])
    ]
  }
}
