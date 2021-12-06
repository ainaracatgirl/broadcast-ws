# broadcast-ws
BroadcastWS - WebSocket event-based broadcast service.

## Public-domain Server
wss://relay.jdev.com.es/

## Structure

> 🛈 All packets are in the `JSON` format

Once a WebSocket connection is open, the first `Client->Server` packet must be the **Handshake** packet. Every single packet sent *after* the **Handshake** packet must be a **Data** packet.

### Handshake packet
```json
{
    "clientID": "UUID v4 Client ID",
    "listens": [
        
    ]
}
```

### Data packet
```json
{
    "event": "Event ID in the format specified below",
}
```

### Event ID format
The **Event ID** in the **Data** packet must be in the format specified below.

**NAMESPACE**`:CATEGORY`*/EVENT*

## JS Library
There's also a JS library found in this repo at `lib/broadcastws.min.js` that wraps the WebSocket connection and adds some new methods.

`BroadcastWS(clientID, listens)` -> Creates a wrapped WebSocket object, send the handshake packet, and returns it.

On the wrapped WebSocket object there's a new method:

`.event(eventID, data)` -> Sends the *data* JSON object with the *event* property set.