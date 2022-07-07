import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'

const ModuleFederationPlugin = webpack.container.ModuleFederationPlugin

// For testing take pull from Appblox/node-blox-sdk and npm install from path
import { env } from 'node-blox-sdk'
env.init()

const __dirname = path.resolve()

export default {
  entry: './src/index',
  mode: 'development',
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 4007,
  },
  externals: {
    env: JSON.stringify(process.env),
  },
  output: {
    publicPath: 'auto',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react'],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.m?js/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new ModuleFederationPlugin({
      name: 'todoItem789',
      filename: 'remoteEntry.js',
      exposes: {
        './todoItem789': './src/todoItem789',
      },
      shared: {
        react: {
          import: 'react', // the "react" package will be used a provided and fallback module
          shareKey: 'react', // under this name the shared module will be placed in the share scope
          shareScope: 'default', // share scope with this name will be used
          singleton: true, // only a single version of the shared module is allowed
          version: '^17.0.2',
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
}
