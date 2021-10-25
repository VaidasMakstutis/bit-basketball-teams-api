const server = require('./lib/server.js');

const app = {};

app.init = () => {
// pasiruosti pradinius folder'ius
// pasiruosti pradinius failus
// prisijungti prie DB
// uzkurti serveri
server.init();
};

app.init();

module.exports = app;