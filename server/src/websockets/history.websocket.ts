import {WebSocket} from "ws";
import expressWs from "express-ws";


// This stores all the current connections to the history websocket.
const historyWsConnections: WebSocket[] = [];

/**
 * This function sets up the history websocket on the /ws/history endpoint.
 * @param app The reference to the Express application to start the websocket on.
 */
export function setupHistoryWebsocket(app: expressWs.Application): void {
    app.ws('/ws/history', (ws, req) => {
        // When we get a connection, we add it to the historyWsConnections array.
        historyWsConnections.push(ws);
        ws.on('close', () => {
            // When someone disconnects, we remove the session from the array.
            historyWsConnections.splice(historyWsConnections.indexOf(ws), 1);
        });
    });
}

/**
 * This function broadcasts on the history websocket (it sends a dummy value to all connected instances).
 * Sending "true" probably isn't the best thing to do, but I think it doesn't work with a null value.
 */
export function broadcastHistoryUpdate(): void {
    for (const client of historyWsConnections) {
        // We don't need to send any data to the clients, this is just to tell the webapp to fetch the history again.
        client.send('true');
    }
}