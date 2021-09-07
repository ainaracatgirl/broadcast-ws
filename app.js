const WebSocket = require('ws');
const uuid = require('uuid');

const wss = new WebSocket.Server({ port: process.env.PORT || process.env.app_port || 8080 });

wss.on('connection', (ws) => {
    ws.eventReady = false;
    ws.clientID = undefined;
    ws.listens = [];

    ws.on('message', (data) => {
        if (!ws.eventReady) {
            const { clientID, listens } = JSON.parse(data);
            ws.clientID = clientID || uuid.v4();
            ws.listens = listens || [];
            ws.eventReady = true;
            return;
        }

        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN && client.eventReady && client.listens.includes(JSON.parse(data).event)) {
                client.send(data);
            }
        });
    });
});