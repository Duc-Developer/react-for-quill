const fs = require('fs');
const path = require('bun:path');

export const getFiles = (entry, extensions = [], excludeExtensions = []) => {
    let fileNames = [];
    const dirs = fs.readdirSync(entry);

    dirs.forEach((dir) => {
        const path = `${entry}/${dir}`;

        if (fs.lstatSync(path).isDirectory()) {
            fileNames = [
                ...fileNames,
                ...getFiles(path, extensions, excludeExtensions),
            ];

            return;
        }

        if (!excludeExtensions.some((exclude) => dir.endsWith(exclude))
            && extensions.some((ext) => dir.endsWith(ext))
        ) {
            fileNames.push(path);
        }
    });

    return fileNames;
};

export const visualizer = async () => {
    const distPath = path.join(__dirname, '../dist');
    const files = await fs.promises.readdir(distPath);
    let totalSize = 0;

    const fileDetails = await Promise.all(files.map(async (file) => {
        const filePath = path.join(distPath, file);
        const stats = await fs.promises.stat(filePath);
        totalSize += stats.size;
        return { name: file, size: `${(stats.size / 1024).toFixed(2)} KB` };
    }));

    console.table(fileDetails, ['name', 'size']);
    console.log(`Total size: ${(totalSize / 1024).toFixed(2)} KB\n`);
};