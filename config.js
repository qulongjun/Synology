const path = require('path');

const config = {
    IGNORE_FILES: ['.DS_Store'],
    LIBRARY_URL : 'https://www.seedmm.zone/',
    LIBRARY_WATCH_PATH: path.resolve(__dirname, './demo'),
    LIBRARY_TARGET_PATH: path.resolve(__dirname, './demo2')
};


module.exports = config;