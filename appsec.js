const WebSocket = require('ws');
const uuid = require('uuid');
const HttpsServer = require('https').createServer;
const fs = require('fs');

const server = HttpsServer({
    cert: fs.readFileSync(process.env.BWS_CERT),
    key: fs.readFileSync(process.env.BWS_KEY)
}, app);

const wss = new WebSocket.Server({ server });
server.listen(443);

wss.on('connection', (ws) => {
    ws.eventReady = false;
    ws.clientID = undefined;
    ws.listens = [];

    ws.on('message', (data) => {
        try {
            const packet = JSON.parse(data);
            if (!ws.eventReady) {
                const { clientID, listens } = packet;
                ws.clientID = clientID || uuid.v4();
                ws.listens = listens || [];
                ws.eventReady = true;
                return;
            }

            packet.$sender = ws.clientID;

            if ('$target' in packet) {
                wss.clients.forEach((client) => {
                    if (client.clientID == packet.$target && client !== ws && client.readyState === WebSocket.OPEN && client.eventReady && client.listens.includes(JSON.parse(data).event)) {
                        client.send(JSON.stringify(packet));
                    }
                });
            } else {
                wss.clients.forEach((client) => {
                    if (client !== ws && client.readyState === WebSocket.OPEN && client.eventReady && client.listens.includes(JSON.parse(data).event)) {
                        client.send(JSON.stringify(packet));
                    }
                });
            }
        } catch {
            ws.send(JSON.stringify({ $error: "Incoming packet malformed" }));
        }
    });
});