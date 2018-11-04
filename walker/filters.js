const path = require('path');

const ignoreFiles = params => {
    const { filePath, filesToIgnore = [], extensionsToIgnore = [] } = params;

    if (!filePath) {
        return false;
    }

    const fileName = path.basename(filePath);
    const fileExtension = path.extname(filePath);
    if (filesToIgnore.length > 0 && filesToIgnore.indexOf(fileName) !== -1) {
        return false;
    }

    if (
        extensionsToIgnore.length > 0 &&
        extensionsToIgnore.indexOf(fileExtension) !== -1
    ) {
        return false;
    }

    return true;
};

module.exports = {
    ignoreFiles,
};
