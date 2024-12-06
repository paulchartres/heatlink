import {Token} from "../models/token";

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