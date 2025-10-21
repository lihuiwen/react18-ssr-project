// Main webpack configuration entry point
// This file is used by webpack CLI to load the appropriate configuration

const clientConfig = require('./src/config/webpack.client.ts');
const serverConfig = require('./src/config/webpack.server.ts');

module.exports = [clientConfig, serverConfig];
