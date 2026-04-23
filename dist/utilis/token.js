import { envVars } from "../config/env";
import { CookieUtils } from "./cookie";
import { jwtUtils } from "./jwt";
const isProduction = envVars.NODE_ENV === "production";
const getCookieBaseOptions = () => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax"),
    path: '/',
});
//Creating access token
const getAccessToken = (payload) => {
    const accessToken = jwtUtils.createToken(payload, envVars.ACCESS_TOKEN_SECRET, { expiresIn: envVars.ACCESS_TOKEN_EXPIRY });
    return accessToken;
};
const getRefreshToken = (payload) => {
    const refreshToken = jwtUtils.createToken(payload, envVars.REFRESH_TOKEN_SECRET, { expiresIn: envVars.REFRESH_TOKEN_EXPIRY });
    return refreshToken;
};
const setAccessTokenCookie = (res, token) => {
    CookieUtils.setCookie(res, 'accessToken', token, {
        ...getCookieBaseOptions(),
        //1 day
        maxAge: 60 * 60 * 24 * 1000,
    });
};
const setRefreshTokenCookie = (res, token) => {
    CookieUtils.setCookie(res, 'refreshToken', token, {
        ...getCookieBaseOptions(),
        //7d
        maxAge: 60 * 60 * 24 * 1000 * 7,
    });
};
const setBetterAuthSessionCookie = (res, token) => {
    const options = {
        ...getCookieBaseOptions(),
        //1 day
        maxAge: 60 * 60 * 24 * 1000,
    };
    CookieUtils.setCookie(res, "better-auth.session_token", token, options);
    CookieUtils.setCookie(res, "__Secure-better-auth.session_token", token, options);
};
export const tokenUtils = {
    getAccessToken,
    getRefreshToken,
    setAccessTokenCookie,
    setRefreshTokenCookie,
    setBetterAuthSessionCookie,
};
//# sourceMappingURL=token.js.map