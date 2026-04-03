import { Response } from "express";
import { JwtPayload, SignOptions } from "jsonwebtoken";
import { envVars } from "../config/env";
import { CookieUtils } from "./cookie";
import { jwtUtils } from "./jwt";

// Detect environment
const isProduction = envVars.NODE_ENV === "production";

// Cookie config helper
const cookieConfig = {
  httpOnly: true,
  secure: false,        // LOCALHOST এ ALWAYS false
  sameSite: "lax",      // LOCALHOST এ ALWAYS lax
  domain: "localhost",  // 🔥 REQUIRED
  path: "/",
};



// Create access token
const getAccessToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envVars.ACCESS_TOKEN_SECRET,
    { expiresIn: envVars.ACCESS_TOKEN_EXPIRY } as SignOptions
  );
};

// Create refresh token
const getRefreshToken = (payload: JwtPayload) => {
  return jwtUtils.createToken(
    payload,
    envVars.REFRESH_TOKEN_SECRET,
    { expiresIn: envVars.REFRESH_TOKEN_EXPIRY } as SignOptions
  );
};

// Set access token cookie
const setAccessTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "accessToken", token, {
    ...cookieConfig,
    maxAge: 60 * 60 * 24 * 1000, // 1 day
  });
};

// Set refresh token cookie
const setRefreshTokenCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "refreshToken", token, {
    ...cookieConfig,
    maxAge: 60 * 60 * 24 * 1000 * 7, // 7 days
  });
};

// Set BetterAuth session cookie
const setBetterAuthSessionCookie = (res: Response, token: string) => {
  CookieUtils.setCookie(res, "better-auth.session_token", token, {
    ...cookieConfig,
    maxAge: 60 * 60 * 24 * 1000, // 1 day
  });
};

export const tokenUtils = {
  getAccessToken,
  getRefreshToken,
  setAccessTokenCookie,
  setRefreshTokenCookie,
  setBetterAuthSessionCookie,
};