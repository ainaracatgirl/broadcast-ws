# broadcast-ws
BroadcastWS - WebSocket event-based broadcast service.

```
⚠️ The service is hosted in Heroku and can have a cold-start of up to 10s
```

## Structure

> 🛈 All packets are in the `JSON` format

Once a WebSocket connection is open, the first `Client->Server` packet must be the **Handshake** packet. Every single packet sent *after* the **Handshake** packet must be a **Data** packet.

### Handshake packet
```json
{
    "clientID": "UUID v4 Client ID",
    "listens": [
        /* Contains each Event ID this client wants to listen to */
    ]
}
```

### Data packet
```json
{
    "event": "Event ID in the format specified below",
    
    /* Any custom properties can be sent with this packet */
}
```

### Event ID format
The **Event ID** in the **Data** packet must be in the format specified by the image below.

![example:chat/message](img/event_id.png)

## JS Library
There's also a JS library found in this repo at `lib/broadcastws.min.js` that wraps the WebSocket connection and adds some new methods.

`BroadcastWS(clientID, listens)` -> Creates a wrapped WebSocket object, send the handshake packet, and returns it.

On the wrapped WebSocket object there's a new method:

`.event(eventID, data)` -> Sends the *data* JSON object with the *event* property set.