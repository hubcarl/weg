
var fis = module.exports =  require('fis3');

fis.require.prefixes.unshift('weg');
fis.cli.name = 'weg';
fis.cli.info = require('./package.json');

fis.set('project.ignore', ['output/**', 'node_modules/**', '.git/**', '.svn/**']);

fis.hook('commonjs',{});

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




fis.match('/client/views/(**).tpl', {
    useMap:true,
    url: '/$1',
    //preprocessor: fis.plugin('require')
    preprocessor: fis.plugin('extlang')
});


fis.match('/client/**.{js,css,png,jpg,gif}', {
    useHash:true
});

fis.match('/client/**.js', {
    isMod:true
});


fis.match('/client/**.{js,css}', {
    useMap:true
});

// 同名组件依赖
fis.match('/client/views/**.{tpl,js,css}', {
    useSameNameRequire: true
});


fis.match('/client/views/(**).{gif,png,js,css}', {
    url:'/public/$1',
    release: '/client/public/$1'
});

// 公共静态资源
fis.match('/{client/public, client/views}/(**).js', {
    url:'/public/$1',
    // fis-optimizer-uglify-js 插件进行压缩，已内置
    optimizer: fis.plugin('uglify-js')
});

fis.match('/{client/public, client/views}/(**).css', {
    url:'/public/$1',
    // fis-optimizer-clean-css 插件进行压缩，已内置
    optimizer: fis.plugin('clean-css')
});

fis.match('/{client/public, client/views}/(**).png', {
    url:'/public/$1',
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});


fis.match('/client/public/framework/(**).js', {
    url:'/public/framework/$1',
    isMod: false,
    wrap: false
});

fis.match('::package', {
    postpackager: fis.plugin('loader')
});

// 对 CSS 进行图片合并
//fis.match('*.css', {
//    // 给匹配到的文件分配属性 `useSprite`
//    useSprite: true
//});

// 启用 fis-spriter-csssprites 插件
//fis.match('::package', {
//    spriter: fis.plugin('csssprites')
//})


fis.media('debug').match('*.{js,css,png}', {
    useHash: false,
    useSprite: false,
    optimizer: null
})
