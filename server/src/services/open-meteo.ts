import {fetchWeatherApi} from "openmeteo";
import {Weather} from "../models/weather";

export function getCurrentWeather(): Promise<Weather | undefined> {

    return new Promise((resolve, reject) => {
        const latitude = process.env.LATITUDE;
        const longitude = process.env.LONGITUDE;

        if (!latitude || !longitude) {
            console.warn('[open-meteo]: No coordinates provided. Please provide the LATITUDE and LONGITUDE environment values.');
            resolve(undefined);
        } else {
            const params = {
                latitude: [latitude],
                longitude: [longitude],
                current: 'temperature_2m,weather_code'
            };
            const url = 'https://api.open-meteo.com/v1/forecast';
            fetchWeatherApi(url, params).then((response) => {
                const current = response[0].current()!;
                resolve({
                    temperature: current.variables(0)!.value(),
                    wmo: current.variables(1)!.value()
                });
            });
        }

    });

}