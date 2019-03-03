let args = process.argv.slice(2),
    fs = require('fs'),
    pug = require('pug'),
    yaml = require('js-yaml'),
    watch = require('node-watch'),
    server = require('live-server'),
    lang = 'es',
    icons = { url: '🔗', book: '📕', course: '🎓', video: '▶️' },
    root = './src/',
    dist = './dist';

if (!fs.existsSync(dist)){
    fs.mkdir(dist, { recursive: true });
}

if ( args.indexOf('build') >= 0 ) {
    compile();
}

if ( args.indexOf('watch') >= 0 ) {
    let params = {
        root: dist,
        port: 8888,
        wait: 500,
        logLevel: 1
    };

    server.start(params);

    compile();

    watch(root, { recursive: true }, compile);
}

function compile() {
    try {
        let map = yaml.safeLoad(fs.readFileSync(root + lang + '/index.yml', 'utf8'));
        let options = {};
        let locals = {
            version: '0.0.1',
            lang: 'en',
            root: root + lang + '/',
            pretty: ' ',
            map: map,
            icons: icons,
            loadYAML: loadYAML
        };

        let compiler = pug.compileFile('src/index.pug', options);

        fs.writeFile('dist/index.html', compiler(locals));
    } catch (e) {
        console.log('Error:', e);
    }
}

function loadYAML(file) {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
}
