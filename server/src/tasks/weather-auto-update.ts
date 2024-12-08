import {getCurrentWeather} from "../services/open-meteo";
import {broadcastWeather, isWeatherWsInUse} from "../app";

export function autoUpdateWeather(): void {
    if (isWeatherWsInUse()) {
        console.log(`[weather-auto-update]: Auto updating weather on connected clients.`);
        getCurrentWeather().then(weather => {
            if (weather) {
                broadcastWeather(weather);
            }
        });
    }
}