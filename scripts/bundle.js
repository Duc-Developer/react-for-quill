const fs = require('fs').promises;
const prependHeader = async (headerPath, bundlePath) => {
    const [headerContent, bundleContent] = await Promise.all([
        fs.readFile(headerPath, 'utf8'),
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
        await prependHeader('scripts/bundleHeader.js', './dist/index.esm.js');
        console.log('Build succeeded');
    } catch (error) {
        console.error('Build failed:', error);
    }
};

build();