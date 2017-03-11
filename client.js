var webpack = require('webpack');
const path = require("path");
const fs = require("fs");

function pack(callback) {
  // iterator static files of plugin 
  const config = {
    // or devtool: 'eval' to debug issues with compiled output:
    //devtool: 'cheap-module-eval-source-map',
    devtool: 'source-map',
    entry: [
      // 'eventsource-polyfill',
      // 'webpack/hot/dev-server',
      './web/index'
    ],
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
      publicPath: '/dist/'
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
      rules: [{ test: /\.(js|jsx)$/, exclude: /node_modules/, use: ['babel-loader'] },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'less-loader'
        ]
      },
      ]
    },
    resolve: {
      alias: {
        'framework': path.resolve(__dirname, "web/framework")
      }
    }
  }

  const compiler = webpack(config);
  compiler.run(function (err, stats) {
    if (stats.hasErrors()) {
      log.error('[bee client] run error,info:' + stats);
    } else {
      log.debug('[bee client] run success');
    }
    callback(!stats.hasErrors());
  });

  // compiler.watch({
  //   aggregateTimout: 300,
  //   poll: true
  // }, (err, stats) => {
  //   if (stats.hasErrors()) {
  //     log.error('[bee client] recompile error,info:' + stats);
  //   } else {
  //     log.debug('[bee client] recompile success');
  //   }
  //   callback(stats.hasErrors());
  // });
}

module.exports = {
  pack
}