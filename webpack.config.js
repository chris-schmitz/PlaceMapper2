var path = require('path');

module.exports = {
    entry: [
        './src/PlaceMapper/index.js'
    ],
    output:{
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'public/')
    },
    devtool: 'source-map',
    devServer:{
        contentBase: 'public'
    },
    module:{
        loaders:[
            { test: /\.vue$/, loader: 'vue'},
            { test: /\.scss$/, loaders: ['style', 'css', 'sass'] },
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
    babel: {
        presets: ['es2015'],
        plugins: ['transform-runtime']
    }
};
