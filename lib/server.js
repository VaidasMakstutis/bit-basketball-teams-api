const http = require('http');
const { StringDecoder } = require('string_decoder');
const utils = require('./utils.js');
const data = require('./data.js');

const server = {};

server.db = null;

server.httpServer = http.createServer((req, res) => {
    const baseURL = `http${req.socket.encrypted ? 's' : ''}://${req.headers.host}`;
    const parsedURL = new URL(req.url, baseURL);
    const parsedPathName = parsedURL.pathname;
    const httpMethod = req.method.toLowerCase();
    const trimmedPath = parsedPathName.replace(/^\/+|\/+$/g, '');

    const decoder = new StringDecoder('utf-8');
    let buffer = '';
    req.on('data', (data) => {
        buffer += decoder.write(data);
    })

    req.on('end', async () => {
        buffer += decoder.end();

        const payload = utils.parseJSONtoObject(buffer);
        let responseContent = '';

        switch (httpMethod) {
            case 'get':
                const countryContent = await data.read('teams', trimmedPath);
                responseContent = JSON.stringify(countryContent);
                break;

            case 'post':
                if (typeof payload.name !== 'string' ||
                    payload.name === '') {
                    responseContent = 'If you want to enter new team, please write name of team. For example: {"name": "Team name"}';
                } else {
                    const createResponse = await data.create('teams', payload.name.toLowerCase(), payload);
                    responseContent = `${createResponse}: ${payload.name}`;
                }
                break;

            case 'put':
                const payloadKeys = Object.keys(payload);
                const payloadHasCountryName = payloadKeys.includes('name');

                if (payloadHasCountryName && payloadKeys.length === 1) {
                    responseContent = 'You can not change name of team';
                } else {
                    const currentContent = await data.read('teams', trimmedPath);
                    const newContent = {
                        ...currentContent,
                        ...payload,
                        name: currentContent.name
                    };
                    const updateResponse = await data.update('teams', trimmedPath, newContent);
                    responseContent = `${updateResponse}: ${trimmedPath}`;
                }
                break;

            case 'delete':
                const deleteResponse = await data.delete('teams', trimmedPath);
                responseContent = `${deleteResponse}: ${trimmedPath}`;
                break;

            default:
                responseContent = 'ERROR: netinkamas request method\'as';
                break;
        }

        res.end(responseContent);
    })
});

server.routes = {};

server.api = {};

server.init = () => {
    const port = 3000;
    server.httpServer.listen(port, () => {
        console.log(`Your server is working on http://localhost:${port}`);
    })
}

module.exports = server;