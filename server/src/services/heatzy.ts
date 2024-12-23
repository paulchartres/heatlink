import axios from 'axios';
import {getToken, saveToken} from "./authentication";
import {Device} from "../models/device";
import {DeviceInfo} from "../models/device-info";
import {DeviceInfoPartial} from "../models/device-info-partial";
import {renameKey} from "../helpers/json";

/**
 * These two values are hardcoded because they will not change. They're provided by Heatzy and allow us to access
 * their data through the Gizwits API (which is what they use to manage their heating devices).
 */
const appUrl: string = 'http://euapi.gizwits.com';
const appId: string = 'c70a66ff039d41b4a220e198b0fcc8b3';

/**
 * This function returns the appId for Heatzy.
 */
export function getAppId(): string {
    return appId;
}

/**
 * This function sends a login request to the Heatzy services at the Gizwits API.
 * The USERNAME and PASSWORD environment variables need to be provided for it to work.
 * Once the login succeeds, the received token is stored in the authentication service.
 */
export function login(): Promise<void> {
    return new Promise((resolve, reject) => {

        const username = process.env.USERNAME;
        const password = process.env.PASSWORD;

        if (!username || !password) {
            console.error('[heatzy]: No credentials provided. Please provide the USERNAME and PASSWORD environment values.');
            reject();
        }

        axios.post(`${appUrl}/app/login`, {
                username,
                password
        },
        {
            headers: {
                'X-Gizwits-Application-Id': appId // This header is necessary to tell Gizwits we are working with Heatzy
            }
        })
        .then((res) => {
            console.log('[heatzy]: Login successful.');

            saveToken(res.data.token, res.data.expire_at, res.data.uid);
            resolve();
        })
        .catch((err) => {
            console.error('[heatzy]: Login failed. Please check your credentials.');
            reject();
        });
    });
}

/**
 * This function returns the list of devices linked to the currently logged in account.
 * The raw format isn't very convenient, so Heatlink provides extra endpoints to convert that data to a readable format.
 */
export function getDevices(): Promise<Device[]> {
    return new Promise((resolve, reject) => {

        axios.get(`${appUrl}/app/bindings?limit=20&skip=0`, {
            headers: {
                'X-Gizwits-Application-Id': appId,
                'X-Gizwits-User-token': getToken().token // This header is necessary to access data linked to the user account
            }
        })
        .then((res) => {
            resolve(res.data.devices);
        })
        .catch((err) => {
            console.error('[heatzy]: Could not retrieve devices.');
            reject();
        });

    });
}

/**
 * This function returns detailed information about a specific device. The device ID provided in the endpoint path
 * can be retrieved with the getDevices function.
 * @param deviceId The ID of the device whose information should be returned.
 */
export function getDeviceInfo(deviceId: string): Promise<DeviceInfo> {
    return new Promise((resolve, reject) => {

        axios.get(`${appUrl}/app/devdata/${deviceId}/latest`, {
            headers: {
                'X-Gizwits-Application-Id': appId,
                'X-Gizwits-User-token': getToken().token
            }
        })
        .then((res) => {
            /**
             * For some reason, receiving the attributes through that endpoint puts them in 'attr' and not 'attrs', as
             * is the case for other data points (like the websocket). I renamed it for convenience, so it matches
             * the typings we use throughout the app.
             */
            resolve(renameKey(res.data, 'attr', 'attrs'));
        })
        .catch((err) => {
            console.error(`[heatzy]: Could not retrieve device ${deviceId}.`);
            reject();
        });

    });
}

/**
 * This function allows a partial update of a specific device's properties. This is particularly handy to avoid making
 * a function for each type of data (heating mode, heating schedule...).
 * @param deviceId The ID of the device whose configuration should be updated
 * @param attributes A partial DeviceInfo object, containing the properties that should be updated and their values.
 */
export function updateDevice(deviceId: string, attributes: Partial<DeviceInfoPartial>): Promise<void> {
    return new Promise((resolve, reject) => {

        axios.post(`${appUrl}/app/control/${deviceId}`, attributes, {
            headers: {
                'X-Gizwits-Application-Id': appId,
                'X-Gizwits-User-token': getToken().token
            },
        })
        .then((res) => {
            resolve();
        })
        .catch((err) => {
            console.error(`[heatzy]: Could not update device ${deviceId}.`);
            reject();
        });

    });
}

/**
 * This function allows an update of a specific device's name. Device names cannot be updated through the
 * /app/control/did endpoint, hence the separate function solely for device names.
 * @param deviceId The ID of the device whose name should be updated.
 * @param name The new name for the device.
 */
export function updateDeviceName(deviceId: string, name: string): Promise<void> {
    return new Promise((resolve, reject) => {

        axios.put(`${appUrl}/app/bindings/${deviceId}`, { dev_alias: name }, {
            headers: {
                'X-Gizwits-Application-Id': appId,
                'X-Gizwits-User-token': getToken().token
            },
        })
            .then((res) => {
                resolve();
            })
            .catch((err) => {
                console.error(`[heatzy]: Could not update device name for ${deviceId}.`);
                reject();
            });

    });
}