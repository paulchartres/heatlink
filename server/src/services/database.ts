import sqlite3 from 'sqlite3'
import {Database, open} from 'sqlite'
import {DateTime} from "luxon";
import {TemperatureHistory} from "../models/temperature-history";
import {HumidityHistory} from "../models/humidity-history";

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
                        resolve();
                    })
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