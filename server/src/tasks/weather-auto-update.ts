import {getCurrentWeather} from "../services/open-meteo";
import {broadcastWeather, isWeatherWsInUse} from "../websockets/weather.websocket";

/**
 * This function is used as a CRON task.
 * It is called every five minutes in order to update the weather widget on the webapp for connected clients.
 * If no clients are connected, this function does not run.
 */
export function autoUpdateWeather(): void {
    if (isWeatherWsInUse()) {
        // If at least one client is connected, we grab the current weather and send it to the weather websocket.
        console.log(`[weather-auto-update]: Auto updating weather on connected clients.`);
        getCurrentWeather().then(weather => {
            if (weather) {
                broadcastWeather(weather);
            }
        });
    }
}