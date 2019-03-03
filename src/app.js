let args = process.argv.slice(2),
    fs = require('fs'),
    pug = require('pug'),
    yaml = require('js-yaml'),
    watch = require('node-watch'),
    server = require('live-server'),
    lang = 'es',
    root = './src/',
    dist = './dist/';

let icons = { url: '🔗', book: '📕', course: '🎓', video: '▶️' };
let data =  loadYAML(root + lang + '/index.yml');
let locals = {
        version: '0.0.1',
        lang: 'en',
        root: root + lang + '/',
        pretty: ' ',
        data: data,
        icons: icons,
        loadYAML: loadYAML
    };
let params = {
        root: dist,
        port: 8888,
        wait: 500,
        logLevel: 1
    };


if (!fs.existsSync(dist)){
    fs.mkdir(dist, { recursive: true });
}

if ( args.indexOf('build') >= 0 ) {
    compile();
}

if ( args.indexOf('watch') >= 0 ) {
    compile();

    server.start(params);
    watch(root, { recursive: true }, compile);
}

function compile() {
    try {
        let compiler = pug.compileFile(root + 'index.pug', {});

        fs.writeFile(dist + 'index.html', compiler(locals));
    } catch (e) {
        console.log('Error:', e);
    }
}

function loadYAML(file) {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
}
