let args = process.argv.slice(2),
    fs = require('fs'),
    pug = require('pug'),
    yaml = require('js-yaml'),
    watch = require('node-watch'),
    server = require('live-server'),
    lang = 'es',
    root = './src/',
    dist = './dist/',
    icons = {
        url: '🔗', book: '📕', course: '🎓', video: '▶️'
    };

let locals = {
        version: '0.0.1',
        lang: lang,
        root: root + lang + '/',
        pretty: ' ',
        data: loadYAML(root + lang + '/index.yml'),
        icons: icons,
        loadYAML: loadYAML
    };

let params = {
        root: dist,
        port: 8888,
        wait: 500,
        logLevel: 2
    };

fs.existsSync(dist) || fs.mkdir(dist, { recursive: true } );

compile();

if ( args.indexOf('watch') >= 0 ) {
    server.start(params);
    watch(root, { recursive: true }, compile);
}

function compile() {
    let compiler = pug.compileFile(root + 'index.pug');

    fs.writeFile(dist + 'index.html', compiler(locals));
}

function loadYAML(file) {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
}
