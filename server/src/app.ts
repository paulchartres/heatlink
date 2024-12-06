import express, { Express, Request, Response } from "express";
import {getDeviceInfo, getDevices, login, updateDevice} from "./services/heatzy";
import {DeviceStripped} from "./models/device.stripped";
import {convertScheduleToReadable} from "./converters/schedule";
import {DeviceInfoStripped} from "./models/device-info.stripped";
import {heatingModeEnumToNumber, modeStringToEnum, specialModeNumberToEnum} from "./converters/enums";
import swaggerJsdoc from 'swagger-jsdoc';
import * as swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cron from 'node-cron';

// Schemas for OpenAPI spec
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

import {getHumidityHistory, getTemperatureHistory, openDatabase} from "./services/database";
import {archiveTemperatureHistory} from "./tasks/temperature-history";
import {archiveHumidityHistory} from "./tasks/humidity-history";
import {HeatingMode} from "./enums/heating-mode";

const app: Express = express();
const port = process.env.PORT || 3000;

// Auto generation of the swagger docs
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
                HumidityHistory: humidityHistory
            }
        },
    },
    apis: ['./src/app.ts'],
};

const openapiSpecification = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification));
app.get("/openapi.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(openapiSpecification);
});

// Middlewares
app.use(cors());
app.use(express.json());

/**
 * @swagger
 * /raw/devices:
 *   get:
 *     summary: Retrieves the raw Heazty list of devices associated to your account.
 *     description: Retrieves the full, unaltered list of devices linked to your account. Another endpoint is available with more concise and readable data.
 *     responses:
 *       200:
 *         description: A list of raw devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Device'
 */
app.get('/raw/devices', function (req: Request, res: Response) {
    getDevices().then((devices) => {
        res.send(devices);
    });
});

/**
 * @swagger
 * /devices:
 *   get:
 *     summary: Retrieves the stripped and readable list of devices associated to your account.
 *     description: Retrieves the stripped and readable list of devices linked to your account. Another endpoint is available to retrieve unaltered Heatzy data.
 *     responses:
 *       200:
 *         description: A list of stripped devices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/DeviceStripped'
 */
app.get('/devices', function (req: Request, res: Response) {
    getDevices().then((devices) => {
        res.send(
            devices.map((device): DeviceStripped => {
                return {
                    deviceId: device.did,
                    readableName: device.dev_alias,
                    macAddress: device.mac,
                    isOnline: device.is_online,
                    productName: device.product_name
                }
            })
        );
    });
});

/**
 * @swagger
 * /device/{deviceId}:
 *   get:
 *     summary: Retrieves the stripped and readable information relative to a specific device.
 *     description: Retrieves the stripped and readable information relative to a specific device, using the device's did (device ID). Another endpoint is available to retrieve raw data. The heating schedule is expressed in readable hours in this payload.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device to retrieve
 *     responses:
 *       200:
 *         description: Readable device information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceInfo'
 */
app.get('/raw/device/:deviceId', function (req: Request, res: Response) {
    getDeviceInfo(req.params.deviceId).then((deviceInfo) => {
        res.send(deviceInfo);
    });
});

/**
 * @swagger
 * /device/{deviceId}:
 *   get:
 *     summary: Retrieves the stripped and readable information relative to a specific device.
 *     description: Retrieves the stripped and readable information relative to a specific device, using the device's did (device ID). Another endpoint is available to retrieve raw data. The heating schedule is expressed in readable hours in this payload.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device to retrieve
 *     responses:
 *       200:
 *         description: Readable device information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeviceInfoStripped'
 */
app.get('/device/:deviceId', function (req: Request, res: Response) {
    getDeviceInfo(req.params.deviceId).then((deviceInfo) => {
        res.send(
            {
                schedule: convertScheduleToReadable(deviceInfo),
                mode: modeStringToEnum(deviceInfo.attr.mode),
                currentMode: modeStringToEnum(deviceInfo.attr.cur_mode),
                isHeating: deviceInfo.attr.Heating_state == 1,
                currentSignal: modeStringToEnum(deviceInfo.attr.cur_signal),
                isUsingTimer: deviceInfo.attr.timer_switch == 1,
                specialMode: specialModeNumberToEnum(deviceInfo.attr.derog_mode),
                specialModeRemainingTime: deviceInfo.attr.derog_time,
                isWindowDetectionOn: deviceInfo.attr.window_switch == 1,
                currentTemperature: deviceInfo.attr.cur_temp / 10,
                comfortTargetTemperature: deviceInfo.attr.cft_temp / 10,
                ecoTargetTemperature: deviceInfo.attr.eco_temp / 10,
                currentHumidity: deviceInfo.attr.cur_humi,
                isLocked: deviceInfo.attr.lock_switch == 1
            } as DeviceInfoStripped
        );
    });
});

/**
 * @swagger
 * /device/{deviceId}/history/temperature:
 *   post:
 *     summary: Retrieves the temperature history of a device in a requested interval.
 *     description: Retrieves the temperature history of a device in a requested interval. The start and end values should be specified as timestamps (seconds).
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose temperature history should be retrieved
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTimestamp:
 *                 type: integer
 *                 description: The start of the interval as a timestamp in seconds
 *                 example: 1672444800
 *               endTimestamp:
 *                 type: integer
 *                 description: The end of the interval as a timestamp in seconds
 *                 example: 1672531200
 *     responses:
 *       200:
 *         description: Temperature history for the requested device
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/TemperatureHistory'
 */
app.post('/device/:deviceId/history/temperature', function (req: Request, res: Response) {
    const startTimestamp: number = req.body?.startTimestamp;
    const endTimestamp: number = req.body?.endTimestamp;

    if (!startTimestamp || !endTimestamp) {
        res.sendStatus(400);
        return;
    }

    getTemperatureHistory(startTimestamp, endTimestamp, req.params.deviceId).then((history) => {
        res.send(history);
    });
});

/**
 * @swagger
 * /device/{deviceId}/history/humidity:
 *   post:
 *     summary: Retrieves the humidity history of a device in a requested interval.
 *     description: Retrieves the humidity history of a device in a requested interval. The start and end values should be specified as timestamps (seconds).
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose humidity history should be retrieved
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               startTimestamp:
 *                 type: integer
 *                 description: The start of the interval as a timestamp in seconds
 *                 example: 1672444800
 *               endTimestamp:
 *                 type: integer
 *                 description: The end of the interval as a timestamp in seconds
 *                 example: 1672531200
 *     responses:
 *       200:
 *         description: Humidity history for the requested device
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HumidityHistory'
 */
app.post('/device/:deviceId/history/humidity', function (req: Request, res: Response) {
    const startTimestamp: number = req.body?.startTimestamp;
    const endTimestamp: number = req.body?.endTimestamp;

    if (!startTimestamp || !endTimestamp) {
        res.sendStatus(400);
        return;
    }

    getHumidityHistory(startTimestamp, endTimestamp, req.params.deviceId).then((history) => {
        res.send(history);
    });
});

/**
 * @swagger
 * /device/{deviceId}/mode:
 *   post:
 *     summary: Changes the current heating mode of a specific device.
 *     description: Changes the current heating mode of a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose mode should be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               mode:
 *                 $ref: '#/components/schemas/HeatingMode'
 *     responses:
 *       200:
 *         description: The heating mode has been updated
 */
app.post('/device/:deviceId/mode', function (req: Request, res: Response) {
    const mode: HeatingMode = req.body?.mode as HeatingMode;

    if (!mode) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            mode: heatingModeEnumToNumber(mode)
        }
    }).then((history) => {
        res.send(history);
    });
});

/**
 * @swagger
 * /device/{deviceId}/target/comfort:
 *   post:
 *     summary: Changes the target comfort temperature of a specific device.
 *     description: Changes the target comfort temperature of a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose target comfort temperature should be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 format: float
 *                 description: The target temperature of the comfort mode
 *                 example: 18
 *     responses:
 *       200:
 *         description: The comfort target temperature has been updated
 */
app.post('/device/:deviceId/target/comfort', function (req: Request, res: Response) {
    const targetTemperature: number = parseFloat(req.body?.temperature);

    if (!targetTemperature) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            cft_temp: targetTemperature * 10
        }
    }).then((history) => {
        res.send(history);
    });
});

/**
 * @swagger
 * /device/{deviceId}/target/eco:
 *   post:
 *     summary: Changes the target eco temperature of a specific device.
 *     description: Changes the target eco temperature of a specific device.
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device whose target eco temperature should be changed
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 format: float
 *                 description: The target temperature of the eco mode
 *                 example: 15
 *     responses:
 *       200:
 *         description: The eco target temperature has been updated
 */
app.post('/device/:deviceId/target/eco', function (req: Request, res: Response) {
    const targetTemperature: number = parseFloat(req.body?.temperature);

    if (!targetTemperature) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            eco_temp: targetTemperature * 10
        }
    }).then((history) => {
        res.send(history);
    });
});

/**
 * @swagger
 * /device/{deviceId}/vacancy:
 *   post:
 *     summary: Enables vacancy mode for a specific device.
 *     description: Enables vacancy mode for a specific device, for a certain amount of time (in days).
 *     parameters:
 *       - in: path
 *         name: deviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the device that should be set to vacancy mode.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               temperature:
 *                 type: number
 *                 format: float
 *                 description: The target temperature of the eco mode
 *                 example: 15
 *     responses:
 *       200:
 *         description: The eco target temperature has been updated
 */
app.post('/device/:deviceId/vacancy', function (req: Request, res: Response) {
    const targetTemperature: number = parseFloat(req.body?.temperature);

    if (!targetTemperature) {
        res.sendStatus(400);
        return;
    }

    updateDevice(req.params.deviceId, {
        attrs: {
            eco_temp: targetTemperature * 10
        }
    }).then((history) => {
        res.send(history);
    });
});

// CRON jobs
cron.schedule('* * * * *', archiveTemperatureHistory);
cron.schedule('* * * * *', archiveHumidityHistory);

openDatabase().then(() => {
    // When we start the app, we always start with a sign-in to populate the authentication service.
    login()
        .catch((err: Error) => {
            return Promise.reject(err);
        })
        .then(() => {
            app.listen(port, () => {
                console.log(`[server]: Server is running at http://localhost:${port}`);
            });
        });
});