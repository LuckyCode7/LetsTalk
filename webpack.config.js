const path = require('path');

module.exports = {
    entry: './public/js/app.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js'
    },
    watch: true
};