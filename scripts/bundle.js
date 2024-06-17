const fs = require('fs').promises;

const quillSnow = require.resolve('../node_modules/quill/dist/quill.snow.css');
const quillBubble = require.resolve('../node_modules/quill/dist/quill.bubble.css');

const prependHeader = async (headerPath, bundlePath) => {
    const packageJson = await fs.readFile('package.json', 'utf8');
    const version = JSON.parse(packageJson).version;

    const [headerContent, bundleContent] = await Promise.all([
        fs.readFile(headerPath, 'utf8').then(content => {
            return content.replace(/(Version: )[\d.]+/, `$1${version}`);
        }),
        fs.readFile(bundlePath, 'utf8'),
    ]);
    await fs.writeFile(bundlePath, `${headerContent}\n${bundleContent}`);
};

const build = async () => {
    try {
        const esmResponses = await Bun.build({
            entrypoints: ['src/index.tsx'],
            outdir: './dist',
            format: 'esm',
            naming: '[dir]/[name].esm.[ext]',
            splitting: false,
            loader: { '.jsx': 'jsx', '.css': 'file' },
            external: ['react', 'react-dom'],
        });
        if (!esmResponses.success) {
            throw new AggregateError(esmResponses.logs, 'Bundle .esm failed');
        }
        const minifyResponses = await Bun.build({
            entrypoints: ['src/index.tsx'],
            outdir: './dist',
            format: 'esm',
            naming: '[dir]/[name].min.[ext]',
            minify: true,
            external: ['react', 'react-dom']
        });
        if (!minifyResponses.success) {
            throw new AggregateError(esmResponses.logs, 'Bundle .min failed');
        }
        // clone quill assets
        await Promise.all([
            Bun.write("./dist/quill.snow.css", Bun.file(quillSnow)),
            Bun.write("./dist/quill.bubble.css", Bun.file(quillBubble))
        ]);
        console.log('Build succeeded');
    } catch (error) {
        console.error('Build failed:', error);
    }
};

build().then(async () => {
    try {
        await prependHeader('./scripts/bundleHeader.js', './dist/index.esm.js');
        console.log(`Attach header's info succeeded`);
    } catch (error) {
        console.log(`Attach header's info failed:`, error);
    }
});