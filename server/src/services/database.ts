import sqlite3 from 'sqlite3'
import {Database, open} from 'sqlite'
import {DateTime} from "luxon";
import {TemperatureHistory} from "../models/temperature-history";
import {HumidityHistory} from "../models/humidity-history";
import {Preset} from "../models/preset";

let database: Database;

export function openDatabase(): Promise<void> {
    console.log(`[database]: Connecting to database...`);
    return new Promise((resolve, reject) => {
        open({
            filename: '/tmp/database.db',
            driver: sqlite3.Database
        }).then((db) => {
            console.log(`[database]: Database connection established.`);
            database = db;
            initDatabase().then(() => resolve());
        })
    });
}

export function initDatabase(): Promise<void> {
    return new Promise((resolve, reject) => {
        database.get(`SELECT name FROM sqlite_master WHERE type='table' AND name='temperatures'`).then((result) => {
            if (!result) {
                console.log(`[database]: Database has not been initialized. Creating schema...`);
                database.exec(`CREATE TABLE temperatures (timestamp INTEGER, temperature REAL, deviceId TEXT)`).then(() => {
                    console.log(`[database]: Temperatures table created.`);
                    database.exec(`CREATE TABLE humidity (timestamp INTEGER, humidity REAL, deviceId TEXT)`).then(() => {
                        console.log(`[database]: Humidity table created.`);
                        database.exec(`CREATE TABLE presets (name TEXT, description TEXT, json TEXT)`).then(() => {
                            console.log(`[database]: Presets table created.`);
                            resolve();
                        });
                    });
                });
            } else {
                resolve();
            }
        });
    });
}

export function archiveTemperature(temperature: number, deviceId: string): Promise<void> {
    const timestamp: number = DateTime.now().toSeconds();
    return new Promise((resolve, reject) => {
       database.run(`INSERT INTO temperatures VALUES (?, ?, ?)`, timestamp, temperature, deviceId).then(() => {
           resolve();
       });
    });
}

export function archiveHumidity(humidity: number, deviceId: string): Promise<void> {
    const timestamp: number = DateTime.now().toSeconds();
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO humidity VALUES (?, ?, ?)`, timestamp, humidity, deviceId).then(() => {
            resolve();
        });
    });
}

export function getTemperatureHistory(startTimestamp: number, endTimestamp: number, deviceId: string): Promise<TemperatureHistory[]> {
    return new Promise((resolve, reject) => {
       database.all(`SELECT * FROM temperatures WHERE deviceId = ? AND timestamp BETWEEN ? AND ?`, deviceId, startTimestamp, endTimestamp).then((result) => {
           resolve(result);
       });
    });
}

export function getHumidityHistory(startTimestamp: number, endTimestamp: number, deviceId: string): Promise<HumidityHistory[]> {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM humidity WHERE deviceId = ? AND timestamp BETWEEN ? AND ?`, deviceId, startTimestamp, endTimestamp).then((result) => {
            resolve(result);
        });
    });
}

export function getFirstTemperatureDataPoint(deviceId: string): Promise<TemperatureHistory> {
    return new Promise((resolve, reject) => {
       database.get(`SELECT * FROM temperatures WHERE deviceId = ? ORDER BY timestamp asc`, deviceId).then((result) => {
           resolve(result);
       })
    });
}

export function getPresets(): Promise<Preset[]> {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM presets`).then((result) => {
            resolve(result);
        });
    });
}

export function getPreset(name: string): Promise<Preset> {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM presets WHERE name = ?`, name).then((result) => {
            resolve(result);
        });
    });
}

export function savePreset(name: string, description: string, json: string): Promise<void> {
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO presets VALUES (?, ?, ?)`, name, description, json).then(() => {
            resolve();
        });
    });
}

export function deletePreset(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM presets WHERE name = ?`, name).then(() => {
           resolve();
        });
    });
}