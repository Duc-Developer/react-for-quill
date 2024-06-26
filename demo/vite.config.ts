import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const BASE_URL = '/react-for-quill/';
function htmlAttachment(): Plugin {
  return {
    name: 'attachment-cdn-link',
    transformIndexHtml(html) {
      const isProduction = process.env.MODE === 'production';
      const localPath = '/react-for-quill/node_modules/react-for-quill/dist/quill.snow.css';
      const prodHref = 'https://cdn.jsdelivr.net/npm/react-for-quill@latest/dist/quill.snow.css';
      const regex = /(<link id="react-for-quill-snow-style" href=")[^"]+(" rel="stylesheet" \/>)/;
      const content = html.replace(regex, `$1${isProduction ? prodHref : localPath}$2`);
      return content;
    },
  };
}

function adjustModuleResolutionForDev(): Plugin {
  return {
    name: 'adjust-module-resolution-for-dev',
    config(config, { command }) {
      if (command === 'serve') {
        config.resolve = config.resolve || {};
        const alias = config.resolve.alias as Record<string, string>;
        if (alias) {
          const localPath = path.resolve(__dirname, './node_modules/react-for-quill/dist/index.esm.js');
          alias['react-for-quill'] = localPath;
        }
      }
    },
  };
}

export default defineConfig(() => {
  return {
    base: BASE_URL,
    plugins: [react(), htmlAttachment(), adjustModuleResolutionForDev()],
    server: {
      host: process.env.HOST,
      port: +(process.env.PORT || 3000),
      open: true
    },
    preview: {
      host: process.env.HOST,
      port: 30001
    },
    resolve: {
      alias: {}
    },
    envDir: './env',
  }
})
