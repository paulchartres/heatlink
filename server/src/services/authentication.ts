import {Token} from "../models/token";
import {DateTime} from "luxon";
import {login} from "./heatzy";

/**
 * At first, the app stored the token in the database. But truth is, that's not really needed.
 * We just keep it in memory and re-request it when the application starts.
 */
let currentToken: Token;

/**
 * This function saves the provided information in the in-memory variable for the current token.
 * @param token The actual token string from Heatzy.
 * @param expiry The timestamp at which the token will expire.
 * @param uid The ID of the currently logged user.
 */
export function saveToken(token: string, expiry: number, uid: string): void {
    currentToken = {
        token,
        expiry,
        uid
    };
}

/**
 * This function returns the currently stored token.
 */
export function getToken(): Token {
    return currentToken;
}

/**
 * This function is run every hour and ensures the token we currently have stored is still valid.
 * If the current date is past the token's expiration date, we request a new login.
 */
export function autoRefreshToken(): void {
    console.log(`[authentication]: Checking authentication token expiry...`);
    if (DateTime.now().toSeconds() > currentToken.expiry) {
        console.log(`[authentication]: Requesting token refresh.`);
        login().then(() => {
            console.log(`[authentication]: Token refreshed.`);
        });
    } else {
        console.log(`[authentication]: No token refresh required.`);
    }
}