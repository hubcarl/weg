
var fis = module.exports =  require('fis3');

fis.require.prefixes.unshift('weg');
fis.cli.name = 'weg';
fis.cli.info = require('./package.json');

fis.set('project.ignore', ['output/**', 'node_modules/**', '.git/**', '.svn/**']);

fis.hook('commonjs');

fis.match('server.js',{
    useMap:false,
    useHash: false,
    useCompile: false
});

fis.match('/server/**.**',{
    useMap:false,
    useHash: false,
    useCompile: false
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

fis.match('/{client/public, client/views}/**.{png,jpg}', {
    // fis-optimizer-png-compressor 插件进行压缩，已内置
    optimizer: fis.plugin('png-compressor')
});