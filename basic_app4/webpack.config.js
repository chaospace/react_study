module.exports = {
    devtool:'source-map',
    entry :  __dirname + '/src/app.js',
    output : {
        path :  __dirname,
        filename : "bundle.js"
    },
    module : {
        loaders : [
            {
                test : /\.jsx?$/,
                loader : 'babel',
                exclude : /node_modules/,
                query : {
                    presets : ['es2015', 'react' ]
                }
            }
        ]
    },
    devServer : {
            inline : true,
            contentBase : __dirname
    }
};
