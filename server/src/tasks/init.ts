import cron from "node-cron";
import {autoRefreshToken} from "../services/authentication";
import {archiveTemperatureHistory} from "./temperature-history";
import {archiveHumidityHistory} from "./humidity-history";
import {autoUpdateWeather} from "./weather-auto-update";

/**
 * This function is used to start all the CRON tasks in the application. It is called on init by the app.ts file.
 */
export function initCronTasks(): void {
    /**
     * By default, we start the following CRON tasks:
     * - Token auto refresh: to ensure we don't use an expired token.
     * - Temperature archival: to archive temperature values for all devices regularly. The interval is configurable
     * through the ARCHIVAL_CRON environment variable (basic CRON expression).
     * - Humidity archival: to archive humidity values for all devices regularly. The interval is configurable
     * through the ARCHIVAL_CRON environment variable (basic CRON expression).
     */
    cron.schedule('0 * * * *', autoRefreshToken);
    cron.schedule(process.env.ARCHIVAL_CRON ? process.env.ARCHIVAL_CRON : '* * * * *', archiveTemperatureHistory);
    cron.schedule(process.env.ARCHIVAL_CRON ? process.env.ARCHIVAL_CRON : '* * * * *', archiveHumidityHistory);

    /**
     * If we have provided the LATITUDE and LONGITUDE environment variables, we'll automatically fetch the current
     * weather every five minutes to update it on the frontend. That way, no need for a page refresh to see the current
     * weather.
     */
    if (process.env.LATITUDE && process.env.LONGITUDE) {
        cron.schedule('*/5 * * * *', autoUpdateWeather);
    }
}