import {WebSocket} from "ws";
import expressWs from "express-ws";
import {Weather} from "../models/weather";

// This stores all the current connections to the weather websocket.
const weatherWsConnections: WebSocket[] = [];

/**
 * This function sets up the weather websocket on the /ws/weather endpoint.
 * @param app The reference to the Express application to start the websocket on.
 */
export function setupWeatherWebsocket(app: expressWs.Application): void {
    app.ws('/ws/weather', (ws, req) => {
        // When we get a connection, we add it to the weatherWsConnections array.
        weatherWsConnections.push(ws);
        ws.on('close', () => {
            // When someone disconnects, we remove the session from the array.
            weatherWsConnections.splice(weatherWsConnections.indexOf(ws), 1);
        });
    });
}

/**
 * This function broadcasts on the weather websocket (it sends the provided weather object to all connected instances).
 * This allows auto-updating the weather widget on the webapp without refreshing the page.
 * @param weather The weather object that should be broadcast to all webapp instances.
 */
export function broadcastWeather(weather: Weather): void {
    for (const client of weatherWsConnections) {
        client.send(JSON.stringify(weather));
    }
}

/**
 * This function returns a boolean to know if at least one client is using the weather websocket.
 * This is useful to avoid executing refreshes when no one is connected (to avoid overusing the OpenMeteo API, which is
 * limited to 10 000 calls a day).
 */
export function isWeatherWsInUse(): boolean {
    return weatherWsConnections.length > 0;
}