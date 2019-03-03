let fs   = require('fs'),
    pug = require('pug'),
    yaml = require('js-yaml'),
    watch = require('node-watch'),
    StaticServer = require('static-server'),
    lang = 'es',
    icons = { url: '🔗', book: '📕', course: '🎓', video: '▶️' },
    root = './src/',
    dist = './dist';

if (!fs.existsSync(dist)){
    fs.mkdir(dist, { recursive: true });
}

watch(root, { recursive: true }, compile);

let server = new StaticServer({
    rootPath: dist,
    port: 8888
});

server.start(function () {
    console.log('Server listening to', server.port);
});

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
        let html = compiler(locals);

        fs.writeFile('dist/index.html', html, function(err) {
            if(err) {
                throw err;
            } else {
                console.log('The file was saved!');
            }
        });
    } catch (e) {
        console.log('Error:', e);
    }
}

function loadYAML(file) {
    return yaml.safeLoad(fs.readFileSync(file, 'utf8'));
}
