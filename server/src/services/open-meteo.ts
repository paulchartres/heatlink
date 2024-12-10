import {fetchWeatherApi} from "openmeteo";
import {Weather} from "../models/weather";
import {DateTime} from "luxon";
import {WeatherHistory} from "../models/weather-history";
import {linearInterpolation} from "../helpers/math";
import {getFirstTemperatureDataPoint} from "./database";

const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

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
            fetchWeatherApi(url, params)
            .then((response) => {
                const current = response[0].current()!;
                resolve({
                    temperature: current.variables(0)!.value(),
                    wmo: current.variables(1)!.value()
                });
            })
            .catch((error) => {
                resolve(undefined);
            });
        }

    });

}

export function getWeatherInRange(startTimestamp: number, endTimestamp: number, deviceId: string): Promise<WeatherHistory[] | undefined> {

    return new Promise((resolve, reject) => {
        const latitude = process.env.LATITUDE;
        const longitude = process.env.LONGITUDE;

        if (!latitude || !longitude) {
            console.warn('[open-meteo]: No coordinates provided. Please provide the LATITUDE and LONGITUDE environment values.');
            resolve(undefined);
        } else {

            // We always make sure that the minimum time is the first available data point in our temperature history.
            // Prevents us from retrieving external weather data when we don't even have household data.
            getFirstTemperatureDataPoint(deviceId).then((dataPoint) => {
               startTimestamp = Math.max(startTimestamp, dataPoint.timestamp);

                const params = {
                    latitude: [latitude],
                    longitude: [longitude],
                    start_date: DateTime.fromSeconds(startTimestamp).toFormat('yyyy-MM-dd'),
                    end_date: DateTime.fromSeconds(endTimestamp).toFormat('yyyy-MM-dd'),
                    hourly: 'temperature_2m,relative_humidity_2m'
                };
                const url = 'https://historical-forecast-api.open-meteo.com/v1/forecast';
                fetchWeatherApi(url, params)
                    .then((response) => {
                        const hourly = response[0].hourly()!;

                        const utcOffsetSeconds = response[0].utcOffsetSeconds();
                        const weatherData = {
                            hourly: {
                                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                                ),
                                temperature2m: hourly.variables(0)!.valuesArray()!,
                                humidity2m: hourly.variables(1)!.valuesArray()!,
                            },
                        };

                        const weatherHistory: WeatherHistory[] = [];
                        for (let i = 0; i < weatherData.hourly.time.length; i++) {
                            const timestamp = DateTime.fromJSDate(weatherData.hourly.time[i]).toSeconds();

                            // We only include the hourly values that are within the requested bounds.
                            // For the first and last values, we take the previous and next ones and do a linear interpolation
                            // to match our start and end points.
                            if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
                                weatherHistory.push({
                                    timestamp: DateTime.fromJSDate(weatherData.hourly.time[i]).toSeconds(),
                                    temperature: weatherData.hourly.temperature2m[i],
                                    humidity: weatherData.hourly.humidity2m[i]
                                });
                            } else if (timestamp + 3600 > startTimestamp && timestamp + 3600 < endTimestamp) {
                                const alpha: number = 1 - ((startTimestamp - timestamp) / 3600);
                                weatherHistory.push({
                                    timestamp: startTimestamp,
                                    temperature: linearInterpolation(weatherData.hourly.temperature2m[i], weatherData.hourly.temperature2m[i + 1], alpha),
                                    humidity: linearInterpolation(weatherData.hourly.humidity2m[i], weatherData.hourly.humidity2m[i + 1], alpha)
                                });
                            } else if (timestamp - 3600 < endTimestamp && timestamp - 3600 > startTimestamp) {
                                const alpha: number = (timestamp - endTimestamp) / 3600;
                                weatherHistory.push({
                                    timestamp: endTimestamp,
                                    temperature: linearInterpolation(weatherData.hourly.temperature2m[i - 1], weatherData.hourly.temperature2m[i], alpha),
                                    humidity: linearInterpolation(weatherData.hourly.humidity2m[i - 1], weatherData.hourly.humidity2m[i], alpha)
                                });
                            }

                        }

                        resolve(weatherHistory);
                    })
                    .catch((error) => {
                        resolve(undefined);
                    });

            });

        }

    });

}