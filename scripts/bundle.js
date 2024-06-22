const fs = require('fs').promises;

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

const appendCssFile = async (cssPath, bundlePath, additionalCss) => {
    let cssContent = await fs.readFile(cssPath, 'utf8');
    if(additionalCss) {
        cssContent = `/** react-for-quill css */\n${additionalCss}\n/** =========End======== */\n\n${cssContent}`;
    }
    return fs.writeFile(bundlePath, cssContent, 'utf8');
};

const build = async () => {
    try {
        const esmResponses = await Bun.build({
            entrypoints: ['src/index.tsx'],
            outdir: './dist',
            format: 'esm',
            naming: '[dir]/[name].esm.[ext]',
            splitting: false,
            loader: { '.jsx': 'jsx' },
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
            loader: { '.jsx': 'jsx' },
            minify: true,
            external: ['react', 'react-dom']
        });
        if (!minifyResponses.success) {
            throw new AggregateError(esmResponses.logs, 'Bundle .min failed');
        }
        console.log('Appending styles...');
        const mainCss =  await fs.readFile('./src/index.css', 'utf8');
        await Promise.all([
            appendCssFile('./node_modules/quill/dist/quill.snow.css', './dist/quill.snow.css', mainCss),
            appendCssFile('./node_modules/quill/dist/quill.bubble.css', './dist/quill.bubble.css', mainCss),
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