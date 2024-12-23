/**
 * Application imports
 */
import express from "express";
import path from "path";
import {login} from "./services/heatzy";
import swaggerJsdoc from 'swagger-jsdoc';
import expressWs from "express-ws";
import * as swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import figlet from 'figlet';
import { openDatabase } from "./services/database";
import {connectToWebsockets} from "./websocket-clients/heatzy-websocket";
import {setupDevicesWebsocket} from "./websockets/devices.websocket";
import {setupWeatherWebsocket} from "./websockets/weather.websocket";
import {setupHistoryWebsocket} from "./websockets/history.websocket";

/**
 * Schemas for OpenAPI spec
 * These are generated using the following command:
 * npx typescript-json-schema tsconfig.json ModelName --required --out model-name.json
 */
import deviceSchema from './schemas/device-schema.json';
import deviceStripped from './schemas/device-stripped-schema.json';
import deviceInfo from './schemas/device-info-schema.json';
import deviceInfoStripped from './schemas/device-info-stripped-schema.json';
import weekDay from './schemas/weekday.json';
import heatingMode from './schemas/heating-mode.json';
import heatingSchedule from './schemas/heating-schedule.json';
import specialMode from './schemas/special-mode.json';
import temperatureHistory from './schemas/temperature-history.json';
import humidityHistory from './schemas/humidity-history.json';
import weather from './schemas/weather.json';
import weatherHistory from './schemas/weather-history.json';
import presetRequest from './schemas/preset-request.json';
import preset from './schemas/preset.json';

/**
 * Route imports
 * Those are all used below, each route is split into a separate file for clarity.
 * It's also easier to manage incremental API versions like that.
 */
import getRawDevices from './routes/raw-devices.route';
import getRawDevice from './routes/raw-device.route';
import getDevices from './routes/devices.route';
import getDevice from './routes/device.route';
import getTemperatureHistory from './routes/temperature-history.route';
import getHumidityHistory from './routes/humidity-history.route';
import getWeather from './routes/weather.route';
import getWeatherRange from './routes/weather-range.route';
import getPresets from './routes/presets.route';
import setDeviceMode from './routes/device-mode.route';
import setDeviceComfortTemperature from './routes/device-comfort-temperature.route';
import setDeviceEcoTemperature from './routes/device-eco-temperature.route';
import setDeviceVacancy from './routes/device-vacancy.route';
import setDeviceBoost from './routes/device-boost.route';
import setDeviceLock from './routes/device-lock.route';
import setDeviceUnlock from './routes/device-unlock.route';
import setDeviceMotionDetection from './routes/device-motion-detection.route';
import setDeviceResetSpecialMode from './routes/device-reset-special-mode.route';
import setDeviceSchedule from './routes/device-schedule.route';
import setDeviceScheduleMode from './routes/device-schedule-mode.route';
import setDeviceName from './routes/device-name.route';
import createPreset from './routes/preset.route';
import deletePreset from './routes/preset-delete.route';
import {initCronTasks} from "./tasks/init";

/**
 * Application definition
 * We create the global app here.
 * While technically you could change the app's port using the PORT environment variable, it's generally not
 * needed since you can just change the Docker port mapping in production.
 */
const app: expressWs.Application = expressWs(express()).app;
const port = process.env.PORT || 3000;

/**
 * OpenAPI Specification
 * We create an OpenAPI spec from the configuration from the options defined below.
 * The comments in the code allow us to auto generate it.
 * We then serve the openapi.json file on the /openapi.json path, so that we can autogenerate our Angular services.
 * The actual Swagger UI is served at the /docs path.
 */
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Heatlink API',
            version: '1.0.0',
        },
        components: {
            schemas: {
                Device: deviceSchema,
                DeviceStripped: deviceStripped,
                DeviceInfo: deviceInfo,
                DeviceInfoStripped: deviceInfoStripped,
                WeekDay: weekDay,
                HeatingMode: heatingMode,
                HeatingSchedule: heatingSchedule,
                SpecialMode: specialMode,
                TemperatureHistory: temperatureHistory,
                HumidityHistory: humidityHistory,
                Weather: weather,
                WeatherHistory: weatherHistory,
                PresetRequest: presetRequest,
                Preset: preset
            }
        },
    },
    apis: ['./src/routes/*.ts', '/app/server/app.js'],
};
const openapiSpecification = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.get("/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openapiSpecification);
});

/**
 * Middlewares
 * The classic middlewares: CORS to allow requests from another domain, JSON to work with JSON payloads.
 * The last one allows us to serve the built Angular frontend files. This is useful in production, not in dev.
 */
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/**
 * App routes
 * All paths are defined within the *.route.ts files, which is why they all appear as a base path here.
 */
app.use('', getRawDevices);
app.use('', getRawDevice);
app.use('', getDevices);
app.use('', getDevice);
app.use('', getTemperatureHistory);
app.use('', getHumidityHistory);
app.use('', setDeviceMode);
app.use('', setDeviceComfortTemperature);
app.use('', setDeviceEcoTemperature);
app.use('', setDeviceVacancy);
app.use('', setDeviceBoost);
app.use('', setDeviceLock);
app.use('', setDeviceUnlock);
app.use('', setDeviceMotionDetection);
app.use('', setDeviceResetSpecialMode);
app.use('', setDeviceSchedule);
app.use('', setDeviceScheduleMode);
app.use('', getWeather);
app.use('', getWeatherRange);
app.use('', getPresets);
app.use('', setDeviceName);
app.use('', createPreset);
app.use('', deletePreset);

/**
 * Websockets
 * To make things clearer, websockets are separated into individual files in the websockets folder.
 */
setupDevicesWebsocket(app);
setupWeatherWebsocket(app);
setupHistoryWebsocket(app);

/**
 * Frontend static files
 * If none of the paths declared above match, this wildcard interprets the request as a frontend one.
 * It serves files from the public folder, where the built Angular app should be (in production, at least).
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/**
 * CRON jobs
 * For more information on what each CRON job does, check the cron/init.ts file.
 */
initCronTasks();

// We start the app with a nice little Heatlink ASCII art, because style matters.
figlet('Heatlink', { horizontalLayout: 'full', font: 'Big' }, (err, data) => {
    console.log(data);
    // We then open the database. This will ensure the schema is properly created, and establish a connection.
    openDatabase().then(() => {
        // When we start the app, we always start with a sign-in to populate the authentication service.
        login()
            .catch((err: Error) => {
                return Promise.reject(err);
            })
            .then(() => {
                /**
                 * Once we're connected, we'll automatically subscribe to the Gizwits websocket in order to get updates
                 * for each device the Heatzy account owns. All that data will be piped into our own devices websocket,
                 * so that we can have full control over its format.
                 */
                connectToWebsockets();
                app.listen(port, () => {
                    console.log(`[server]: Server is running at http://localhost:${port}`);
                });
            });
    });
});
