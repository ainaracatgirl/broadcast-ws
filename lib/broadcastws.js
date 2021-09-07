const BroadcastWS = (clientID, listens=[]) => {
    const ws = new WebSocket("wss://broadcastws.herokuapp.com/");
    ws.addEventListener('open', ev => {
        ws.send(JSON.stringify({ clientID, listens }));
    });
    ws.event = (event, data) => {
        ws.send(JSON.stringify({ event, ...data }))
    };
    return ws;
}