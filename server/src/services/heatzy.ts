import axios from 'axios';
import {getToken, saveToken} from "./authentication";
import {Token} from "../models/token";
import {Device} from "../models/device";
import {DeviceInfo} from "../models/device-info";
import {DeviceInfoPartial} from "../models/device-info-partial";

const appUrl: string = 'http://euapi.gizwits.com';
const appId: string = 'c70a66ff039d41b4a220e198b0fcc8b3';

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
                'X-Gizwits-Application-Id': appId
            }
        })
        .then((res) => {
            console.log('[heatzy]: Login successful.');

            saveToken(res.data.token, res.data.expire_at);
            resolve();
        })
        .catch((err) => {
            console.error('[heatzy]: Login failed. Please check your credentials.');
            reject();
        });
    });
}

export function getDevices(): Promise<Device[]> {
    return new Promise((resolve, reject) => {

        axios.get(`${appUrl}/app/bindings?limit=20&skip=0`, {
            headers: {
                'X-Gizwits-Application-Id': appId,
                'X-Gizwits-User-token': getToken().token
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

export function getDeviceInfo(deviceId: string): Promise<DeviceInfo> {
    return new Promise((resolve, reject) => {

        axios.get(`${appUrl}/app/devdata/${deviceId}/latest`, {
            headers: {
                'X-Gizwits-Application-Id': appId,
                'X-Gizwits-User-token': getToken().token
            }
        })
        .then((res) => {
            resolve(res.data);
        })
        .catch((err) => {
            console.error(`[heatzy]: Could not retrieve device ${deviceId}.`);
            reject();
        });

    });
}

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