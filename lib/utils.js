const crypto = require('crypto');

const utils = {};

utils.parseJSONtoObject = text => {
    try {
        return JSON.parse(text);
    } catch (error) {
        return {};
    }
}

utils.hash = str => {
    if (typeof str === 'string' && str !== '') {
        const hashingSecret = 'secret-password';
        return crypto.createHmac('sha256', hashingSecret).update(str).digest('hex');
    } else {
        return false;
    }
}

module.exports = utils;