#!/usr/bin/env node
// vi weg/bin/weg.js
var Liftoff = require('liftoff');
var argv = require('minimist')(process.argv.slice(2));
var path = require('path');
var cli = new Liftoff({
    name: 'weg', // 命令名字
    processTitle: 'weg',
    moduleName: 'weg',
    configName: 'fis-conf',

    // only js supported!
    extensions: {
        '.js': null
    }
});

cli.launch({
    cwd: argv.r || argv.root,
    configPath: argv.f || argv.file
}, function(env) {
    var fis;
    if (!env.modulePath) {
        fis = require('../');
    } else {
        fis = require(env.modulePath);
    }
    fis.set('system.localNPMFolder', path.join(env.cwd, 'node_modules/weg'));
    fis.set('system.globalNPMFolder', path.dirname(__dirname));
    fis.cli.run(argv, env);
});