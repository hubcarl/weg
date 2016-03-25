
var fis = module.exports =  require('fis3');

fis.require.prefixes.unshift('weg');
fis.cli.name = 'weg';
fis.cli.info = require('./package.json');

fis.set('project.ignore', ['output/**', 'node_modules/**', '.git/**', '.svn/**']);

fis.hook('commonjs');

fis.match('/{index,server,app}.js',{
    useMap:false,
    useHash: false,
    useCompile: false
});

fis.match('/server/**.**',{
    useMap:false,
    useHash: false,
    useCompile: false
});


fis.match('/client/views/**.tpl', {
    useMap:true,
    isMod:true
});

fis.match('/client/views/(**).{png,js,css}', {
    release: '/client/public/$1'
});

fis.match('/client/**.{js,css,png,jpg}', {
    useHash: true
});

// 公共静态资源
fis.match('/{client/public, client/views}/**.js', {
    isMod: true,
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});

fis.match('/client/public/static/js/mod.js', {
    isMod: false,
    wrap: false
});


fis.match('/{client/public, client/views}/**.css', {
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});

fis.match('/{client/public, client/views}/**.png', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});

// 对 CSS 进行图片合并
fis.match('*.css', {
    // 给匹配到的文件分配属性 `useSprite`
    useSprite: true
});

// 启用 fis-spriter-csssprites 插件
//fis.match('::package', {
//    spriter: fis.plugin('csssprites')
//})

fis.match('::package', {
    postpackager: fis.plugin('loader')
});