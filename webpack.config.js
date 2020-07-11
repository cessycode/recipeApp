const path = require('path');
    //returns the absolute path of the file
    // path is a built-in node

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: ['babel-polyfill', './src/js/index.js'],
    output: {
        path: path.resolve(__dirname, 'dist'),
            //output root folder

    filename: 'js/bundle.js'
    },

    devServer: {
        contentBase: './dist'
            // this folder contains the files that are gonna be shared to the client
            // all final codes to be given to the client is here in dist(distribution folder)
            // src folder contains all the files solely for developers
    },
    
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html'
            //copy the src/index.html automatically to the dist/index.html everytime it is bundled
            //data is not saved in the disk but will only stream them unless you run npm run dev
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                    //looks for all .js files and test them using babel-loader
                exclude: /node_modules/,
                    // will not include files in the node_modules folder during testing
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    }
};