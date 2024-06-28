import { promises as fsASync, watch } from 'fs';
import CleanCSS from 'clean-css';

const prepareHeader = async (headerPath) => {
    const packageJson = await fsASync.readFile('package.json', 'utf8');
    const version = JSON.parse(packageJson).version;
    const headerContent = await fsASync.readFile(headerPath, 'utf8');
    return headerContent.replace(/(Version: )[\d.]+/, `$1${version}`);
};
const prependHeader = async (headerContent, bundlePath) => {
    const bundleContent = await fsASync.readFile(bundlePath, 'utf8');
    await fsASync.writeFile(bundlePath, `${headerContent}\n${bundleContent}`);
};

const appendCssFile = async (cssPath, bundlePath, additionalCss) => {
    let cssContent = await fsASync.readFile(cssPath, 'utf8');
    if (additionalCss) {
        cssContent = `${additionalCss}\n${cssContent}`;
    }
    return fsASync.writeFile(bundlePath, cssContent, 'utf8');
};

// fix bug from bun with config at tsconfig.json "jsx": "react-jsx"
// but it always generate with "jsxDEV" and "react/jsx-dev-runtime"
const fixBundleFromBun = async (bundlePath) => {
    const bundleContent = await fsASync.readFile(bundlePath, 'utf8');
    const fixedContent = bundleContent
        .replace(/react\/jsx-dev-runtime/g, 'react/jsx-runtime')
        .replace(/jsxDEV/g, 'jsx');
    await fsASync.writeFile(bundlePath, fixedContent);
};
const build = async (watching) => {
    const mode = process.env.MODE || 'development';
    try {
        const esmResponses = await Bun.build({
            entrypoints: ['src/index.tsx'],
            outdir: './dist',
            format: 'esm',
            naming: '[dir]/[name].esm.[ext]',
            splitting: false,
            loader: { '.jsx': 'jsx' },
            external: ['react', 'react-dom']
        });
        if (!esmResponses.success) {
            throw new AggregateError(esmResponses.logs, 'Bundle .esm failed');
        }

        if (mode === 'production') {
            console.log('Bun Content fixing...');
            await fixBundleFromBun('./dist/index.esm.js');
        }
        /** currently have bug from bun, so we can not use minify */
        // const minifyResponses = await Bun.build({
        //     entrypoints: ['src/index.tsx'],
        //     outdir: './dist',
        //     format: 'esm',
        //     naming: '[dir]/[name].min.[ext]',
        //     loader: { '.jsx': 'jsx' },
        //     minify: true,
        //     external: ['react', 'react-dom'],
        // });
        // if (!minifyResponses.success) {
        //     throw new AggregateError(esmResponses.logs, 'Bundle .min failed');
        // }

        let headerContent = '/** Development */';
        if(!watching) {
            console.log('Header attaching...');
            headerContent = await prepareHeader('./scripts/bundleHeader.js');
            await prependHeader(headerContent, './dist/index.esm.js');
        }        

        console.log('Style Attaching...');
        const mainCss = await fsASync.readFile('./src/index.css', 'utf8');
        let minifiedCss = new CleanCSS({}).minify(mainCss).styles;
        minifiedCss = `${headerContent}\n${minifiedCss}\n/** =========End======== */\n`;
        await Promise.all([
            appendCssFile('./node_modules/quill/dist/quill.snow.css', './dist/quill.snow.css', minifiedCss),
            appendCssFile('./node_modules/quill/dist/quill.bubble.css', './dist/quill.bubble.css', minifiedCss),
        ]);
        console.log('Build succeeded');
    } catch (error) {
        console.error('Build failed:', error);
    }
};

const isWatchMode =process.argv.includes('--watch');
build(isWatchMode);

if (isWatchMode) {
    watch('src', { recursive: true }, async () => {
        await build(true);
    });
}