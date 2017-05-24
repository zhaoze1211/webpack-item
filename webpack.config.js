var path = require('path');
var glob = require('glob');
var webpack = require("webpack");
var entries = getEntry('src/js/views/**/*.js');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var config = {
    entry: entries,
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].js',
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            },
            {
                test: /\.less$/,
                use: ExtractTextPlugin.extract(["css-loader", "less-loader"])
            },
            {
                test: /\.html$/,
                use: ["html-loader"]
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=fonts/[name].[ext]'
            },
            {
                test: /\.(png|jpg|gif)$/,
                use: ['url-loader?limit=8192&name=images/[sha512:hash:base64:7].[ext]']
            }

        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({ name: "common", filename: "js/common.js" }),
        new ExtractTextPlugin("css/[name].css"),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        }),
        new CleanWebpackPlugin(['dist'])
    ],
    resolve: {
        extensions: [".js", ".json", "css", "less"]
    },
    devServer: {
        contentBase: __dirname + "dist",
        compress: true,
        port: 9000,
        clientLogLevel: "none"
    }
};

var pages = Object.keys(getEntry('src/views/**/*.html'));
pages.forEach(function (name) {
    var conf = {
        favicon: '', //favicon路径，通过webpack引入同时可以生成hash值
        filename: './' + name + '.html', //生成的html存放路径，相对于path
        template: './src/views/' + name + '.html', //html模板路径
        inject: 'body', //js插入的位置，true/'head'/'body'/false
        hash: true, //为静态资源生成hash值
        chunks: ['common', name],//需要引入的chunk，不配置就会引入所有页面的资源
        minify: { //压缩HTML文件    
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: false //删除空白符与换行符
        }
    };
    config.plugins.push(new HtmlWebpackPlugin(conf));
});
function getEntry(globPath) {
    var files = glob.sync(globPath);
    var entries = {}, entry, basename;
    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        extname = path.extname(entry);
        basename = path.basename(entry, extname);
        entries[basename] = './' + entry;
    }
    return entries;
}
module.exports = config;