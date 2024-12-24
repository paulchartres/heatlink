import {fetchWeatherApi} from "openmeteo";
import {Weather} from "../models/weather";
import {DateTime} from "luxon";
import {WeatherHistory} from "../models/weather-history";
import {linearInterpolation} from "../helpers/math";
import {getFirstTemperatureDataPoint} from "./database";

/**
 * Helper function provided by OpenMeteo to parse time series from their API.
 * More info: https://www.npmjs.com/package/openmeteo#Usage
 * @param start The start timestamp of the data.
 * @param stop The end timestamp of the data.
 * @param step The step at which to retrieve the data.
 */
const range = (start: number, stop: number, step: number) =>
    Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);

/**
 * This function returns the weather (temperature and humidity) at a specific location by using the OpenMeteo API.
 * The LATITUDE and LONGITUDE environment variables need to be provided in order for it to work.
 * This is used to display the current weather on the webapp.
 */
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
                current: 'temperature_2m,weather_code' // We could retrieve more info, but we only need these two.
            };
            const url = 'https://api.open-meteo.com/v1/forecast';

            // We use the OpenMeteo npm package to retrieve data.
            fetchWeatherApi(url, params)
            .then((response) => {
                // Once we retrieve the data, we get the first response (because we only requested one dataset).
                const current = response[0].current()!;
                /**
                 * The data retrieval system isn't super clear, but it's straightforward.
                 * If you need more info, check the openmeteo npm package README.
                 */
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

/**
 * This function returns historical weather data within the provided bounds. It is used to compare Heatzy data to
 * external temperature/humidity values.
 * As for the current weather function, the LATITUDE and LONGITUDE environment variables are required.
 * @param startTimestamp The start timestamp for the historical weather data.
 * @param endTimestamp The end timestamp for the historical weather data.
 * @param deviceId The ID of the device that will be compared to this data. Used to ensure we already have a history for
 * said device.
 */
export function getWeatherInRange(startTimestamp: number, endTimestamp: number, deviceId: string): Promise<WeatherHistory[] | undefined> {

    return new Promise((resolve, reject) => {
        const latitude = process.env.LATITUDE;
        const longitude = process.env.LONGITUDE;

        if (!latitude || !longitude) {
            console.warn('[open-meteo]: No coordinates provided. Please provide the LATITUDE and LONGITUDE environment values.');
            resolve(undefined);
        } else {

            /**
             * We always make sure that the minimum time is the first available data point in our temperature history.
             * Prevents us from retrieving external weather data when we don't even have household data.
             */
            getFirstTemperatureDataPoint(deviceId).then((dataPoint) => {
                if (!dataPoint) {
                    console.warn('[open-meteo]: No data point found for this device. Aborting weather retrieval.');
                    resolve(undefined);
                    return;
                }

               startTimestamp = Math.max(startTimestamp, dataPoint.timestamp);

                console.log(DateTime.fromSeconds(startTimestamp).toFormat('yyyy-MM-dd'));
                console.log(DateTime.fromSeconds(endTimestamp).toFormat('yyyy-MM-dd'));

                const params = {
                    latitude: [latitude],
                    longitude: [longitude],
                    start_date: DateTime.fromSeconds(startTimestamp).toFormat('yyyy-MM-dd'),
                    end_date: DateTime.fromSeconds(endTimestamp).toFormat('yyyy-MM-dd'),
                    hourly: 'temperature_2m,relative_humidity_2m'
                };
                const url = 'https://historical-forecast-api.open-meteo.com/v1/forecast';

                // As stated above, we use the openmeteo npm package to retrieve data.
                fetchWeatherApi(url, params)
                    .then((response) => {
                        const hourly = response[0].hourly()!;

                        const utcOffsetSeconds = response[0].utcOffsetSeconds();

                        /**
                         * Data retrieval is, as stated above, a bit tricky and unreadable. This code has been taken
                         * from the openmeteo npm package documentation: https://www.npmjs.com/package/openmeteo#Usage
                         */
                        const weatherData = {
                            hourly: {
                                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                                ),
                                temperature2m: hourly.variables(0)!.valuesArray()!,
                                humidity2m: hourly.variables(1)!.valuesArray()!,
                            },
                        };

                        /**
                         * We then prepare our time series for use in the frontend. The default format retrieved from
                         * OpenMeteo isn't super easy to use, so I found it easier to work with a time series array.
                         */
                        const weatherHistory: WeatherHistory[] = [];

                        // We loop on each hourly value.
                        for (let i = 0; i < weatherData.hourly.time.length; i++) {
                            const timestamp = DateTime.fromJSDate(weatherData.hourly.time[i]).toSeconds();

                            /**
                             * We only include the hourly values that are within the requested bounds.
                             * For the first and last values, we take the previous and next ones and do a linear
                             * interpolation to match our start and end points.
                             */
                            if (timestamp >= startTimestamp && timestamp <= endTimestamp) {
                                weatherHistory.push({
                                    timestamp: DateTime.fromJSDate(weatherData.hourly.time[i]).toSeconds(),
                                    temperature: weatherData.hourly.temperature2m[i],
                                    humidity: weatherData.hourly.humidity2m[i]
                                });
                            } else if (timestamp + 3600 > startTimestamp && timestamp + 3600 < endTimestamp) {
                                // First value linear interpolation
                                const alpha: number = 1 - ((startTimestamp - timestamp) / 3600);
                                weatherHistory.push({
                                    timestamp: startTimestamp,
                                    temperature: linearInterpolation(weatherData.hourly.temperature2m[i], weatherData.hourly.temperature2m[i + 1], alpha),
                                    humidity: linearInterpolation(weatherData.hourly.humidity2m[i], weatherData.hourly.humidity2m[i + 1], alpha)
                                });
                            } else if (timestamp - 3600 < endTimestamp && timestamp - 3600 > startTimestamp) {
                                // Last value linear interpolation
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
                        console.log(error);
                        resolve(undefined);
                    });

            });

        }

    });

}