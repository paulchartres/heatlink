import {Token} from "../models/token";
import {DateTime} from "luxon";

let currentToken: Token;

export function saveToken(token: string, expiry: number): void {
    currentToken = {
        token,
        expiry
    };
}

export function getToken(): Token {
    return currentToken;
}

export function autoRefreshToken(): void {
    console.log(`[authentication]: Checking authentication token expiry...`);
    if (DateTime.now().toSeconds() > currentToken.expiry) {
        console.log(`[authentication]: Requesting token refresh.`);
    } else {
        console.log(`[authentication]: No token refresh required.`);
    }
}