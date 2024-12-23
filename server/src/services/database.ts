import sqlite3 from 'sqlite3'
import {Database, open} from 'sqlite'
import {DateTime} from "luxon";
import {TemperatureHistory} from "../models/temperature-history";
import {HumidityHistory} from "../models/humidity-history";
import {Preset} from "../models/preset";
import fs from 'fs';

// Variable that keeps a reference to the database connection.
let database: Database;

/**
 * This function initiates the connection to the SQLite database.
 * It then stores that connection in this service, and calls the initDatabase function to ensure the schema is properly
 * created.
 */
export function openDatabase(): Promise<void> {
    console.log(`[database]: Connecting to database...`);
    return new Promise((resolve, reject) => {

        if (!fs.existsSync('./data')) {
            fs.mkdirSync('./data');
        }

        open({
            filename: './data/database.db',
            driver: sqlite3.Database
        }).then((db) => {
            console.log(`[database]: Database connection established.`);
            database = db;
            initDatabase().then(() => resolve());
        })
    });
}

/**
 * This function initializes the SQLite database if it detects that the schema hasn't been created.
 * It starts by checking if the "temperatures" table exists. If it doesn't, it creates the following tables:
 * - temperatures: the history values for device temperatures
 * - humidity: the history values for device humidity
 * - presets: the table used to store user-created presets
 */
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

/**
 * This function archives a temperature value for a specific device in the "temperatures" table.
 * @param temperature Current temperature in degrees Celsius for the provided device.
 * @param deviceId Device ID for which the temperature should be archived.
 */
export function archiveTemperature(temperature: number, deviceId: string): Promise<void> {
    const timestamp: number = DateTime.now().toSeconds();
    return new Promise((resolve, reject) => {
       database.run(`INSERT INTO temperatures VALUES (?, ?, ?)`, timestamp, temperature, deviceId).then(() => {
           resolve();
       });
    });
}

/**
 * This function archives a humidity value for a specific device in the "humidity" table.
 * @param humidity Current humidity in percent for the provided device.
 * @param deviceId Device ID for which the humidity should be archived.
 */
export function archiveHumidity(humidity: number, deviceId: string): Promise<void> {
    const timestamp: number = DateTime.now().toSeconds();
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO humidity VALUES (?, ?, ?)`, timestamp, humidity, deviceId).then(() => {
            resolve();
        });
    });
}

/**
 * This function returns the temperature history values within a provided range for a specific device, as an array.
 * @param startTimestamp The start timestamp for the requested range.
 * @param endTimestamp The end timestamp for the requested range.
 * @param deviceId The ID of the device for which the history should be returned.
 */
export function getTemperatureHistory(startTimestamp: number, endTimestamp: number, deviceId: string): Promise<TemperatureHistory[]> {
    return new Promise((resolve, reject) => {
       database.all(`SELECT * FROM temperatures WHERE deviceId = ? AND timestamp BETWEEN ? AND ?`, deviceId, startTimestamp, endTimestamp).then((result) => {
           resolve(result);
       });
    });
}

/**
 * This function returns the humidity history values within a provided range for a specific device, as an array.
 * @param startTimestamp The start timestamp for the requested range.
 * @param endTimestamp The end timestamp for the requested range.
 * @param deviceId The ID of the device for which the history should be returned.
 */
export function getHumidityHistory(startTimestamp: number, endTimestamp: number, deviceId: string): Promise<HumidityHistory[]> {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM humidity WHERE deviceId = ? AND timestamp BETWEEN ? AND ?`, deviceId, startTimestamp, endTimestamp).then((result) => {
            resolve(result);
        });
    });
}

/**
 * This function returns the first history temperature value for a specific device.
 * This is mainly used to ensure we have value for said device, to avoid loading data for no reason.
 * @param deviceId The ID of the device whose history's first value should be returned.
 */
export function getFirstTemperatureDataPoint(deviceId: string): Promise<TemperatureHistory> {
    return new Promise((resolve, reject) => {
       database.get(`SELECT * FROM temperatures WHERE deviceId = ? ORDER BY timestamp asc`, deviceId).then((result) => {
           resolve(result);
       })
    });
}

/**
 * This function returns all the presets that have been created for this instance of Heatlink as an array.
 */
export function getPresets(): Promise<Preset[]> {
    return new Promise((resolve, reject) => {
        database.all(`SELECT * FROM presets`).then((result) => {
            resolve(result);
        });
    });
}

/**
 * This function returns a preset with a specific name. If it doesn't exist, it returns null.
 * Note: the preset name acts as the primary key.
 * @param name The name of the preset that should be returned.
 */
export function getPreset(name: string): Promise<Preset> {
    return new Promise((resolve, reject) => {
        database.get(`SELECT * FROM presets WHERE name = ?`, name).then((result) => {
            resolve(result);
        });
    });
}

/**
 * This function persists a preset in the database using the provided values.
 * @param name The name of the preset that should be persisted.
 * @param description The optional description of the preset that should be persisted.
 * @param json The stringified JSON of the schedule for the preset that should be persisted.
 */
export function savePreset(name: string, description: string, json: string): Promise<void> {
    return new Promise((resolve, reject) => {
        database.run(`INSERT INTO presets VALUES (?, ?, ?)`, name, description, json).then(() => {
            resolve();
        });
    });
}

/**
 * This function deletes a preset with a specific name.
 * @param name The name of the preset that should be deleted.
 */
export function deletePreset(name: string): Promise<void> {
    return new Promise((resolve, reject) => {
        database.run(`DELETE FROM presets WHERE name = ?`, name).then(() => {
           resolve();
        });
    });
}