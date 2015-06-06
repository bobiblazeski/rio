module.exports = {
    entry: './client/index.jsx',
    output: {
        path:__dirname+'/public',
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader'
            }
        ]
    },
    externals: {
        'react': 'React',
        'rx':'Rx',
        'ramda':'R',
        'immutable':'Immutable'
    },
    resolve: {
        extensions: ['','.js','.jsx']
    }
};