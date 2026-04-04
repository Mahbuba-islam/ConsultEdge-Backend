import { Request, Response } from "express";

import { authService } from "./auth.service";

import status from "http-status";
import { tokenUtils } from "../../utilis/token";
import AppError from "../../errorHelpers/AppError";


import { catchAsync } from "../../shared/catchAsync";
import { sendResponse } from "../../shared/sendResponsr";
import { envVars } from "../../config/env";
import { auth } from "../../lib/auth";
import { CookieUtils } from "../../utilis/cookie";

const registeredUser = catchAsync(
    async(req:Request, res:Response)=>{
        const payload = req.body
        console.log(payload);
        const result = await authService.registerClient(payload)
        sendResponse(res, {
            httpStatusCode:status.CREATED,
            success:true,
            message:"user registered successfully",
            data:result
        })
    }
)


const loginUser = catchAsync(async (req: Request, res: Response) => {
  const payload = req.body;

  // 1) Call service
  const result = await authService.loginUser(payload);

  const {
    accessToken,
    refreshToken,
    token,        // BetterAuth session token
    user,         // MUST be included
    ...rest       // role, emailVerified, needPasswordChange, redirect, etc.
  } = result;

  // 2) Set your own JWT cookies
  tokenUtils.setAccessTokenCookie(res, accessToken);
  tokenUtils.setRefreshTokenCookie(res, refreshToken);

  // 3) Set BetterAuth session cookie
  tokenUtils.setBetterAuthSessionCookie(res, token);

  // 4) Send response EXACTLY how frontend expects it
  sendResponse(res, {
    httpStatusCode: status.OK,
    success: true,
    message: "login successfully",
    data: {
      accessToken,
      refreshToken,
      token,
      user,     // REQUIRED
      ...rest,  // role, emailVerified, needPasswordChange, redirect
    },
  });
});


// get me
const getMe = catchAsync(
    async(req:Request, res:Response)=>{
        const user = req.user;
        const result = await authService.getMe(user)
       
      sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"user profile fetched successfully",
        data: result
      })
    }
)


//get new token
const getNewToken = catchAsync(async(req:Request, res:Response)=>{
    const refreshToken = req.cookies.refreshToken
    const betterAuthSessionToken = req.cookies["better-auth.session_token"]

    if(!refreshToken){
        throw new AppError(status.UNAUTHORIZED, "refresh token is missing")
    }
    const results = await authService.getNewToken(refreshToken, betterAuthSessionToken)
    const {accessToken, refreshToken:newRefreshToken, sessionToken} = results

    tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie (res, newRefreshToken)
    tokenUtils.setBetterAuthSessionCookie(res, sessionToken)

    sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"new tokens successfully",
        data:{
            accessToken,
            refreshToken:newRefreshToken,
            sessionToken,

        }
    })
})




//change password
const changePassword = catchAsync(async(req:Request, res:Response)=> {
    const payload = req.body
    const betterAuthSessionToken = req.cookies["better-auth.session_token"]
    const result = await authService.changePassword(payload, betterAuthSessionToken)
    const {accessToken, refreshToken, token} = result

      tokenUtils.setAccessTokenCookie(res, accessToken)
    tokenUtils.setRefreshTokenCookie (res, refreshToken)
    tokenUtils.setBetterAuthSessionCookie(res, token as string)

  sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"password changed successfully",
        data:result
    })

})



//logOut User
const logOutUser = catchAsync(async(req:Request, res:Response)=>{
    const betterAuthSessionToken = req.cookies["better-auth.session_token"]
    const result = await authService.logOutUser(betterAuthSessionToken)
    CookieUtils.clearCookie(res, 'accessToken', {
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
    CookieUtils.clearCookie(res, 'refreshToken', {
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
    CookieUtils.clearCookie(res, 'better-auth.session_token', {
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
     sendResponse(res,{
        httpStatusCode:status.OK,
        success:true,
        message:"successfully Logout",
        data:result
    })
})


//verify email
const verifyEmail = catchAsync(async(req:Request, res:Response)=> {
    const {email,otp} = req.body
     await authService.verifyEmail(email,otp)

    sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"email verified successfully",
        
    })
})

  // forget password
const forgetPassword = catchAsync(async(req:Request, res:Response)=> {
    const {email} = req.body
     await authService.forgetPassword(email)

    sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"password reset OTP sent to email successfully",
        
    })
})


   //reset password
const resetPassword = catchAsync(async(req:Request,  res:Response)=> {
    const {email, otp,  newPassword} = req.body
     await authService.resetPassword(email, otp,  newPassword)

    sendResponse(res, {
        httpStatusCode:status.OK,
        success:true,
        message:"password reset successfully",
        
    })
})


 //google login

// /api/v1/auth/login/google?redirect=/profile
const googleLogin = catchAsync((req: Request, res: Response) => {
    const redirectPath = req.query.redirect || "/dashboard";

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", {
        callbackURL : callbackURL,
        betterAuthUrl : envVars.BETTER_AUTH_URL,
    })
})

const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
    const redirectPath = req.query.redirect as string || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if(!sessionToken){
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers:{
            "Cookie" : `better-auth.session_token=${sessionToken}`
        }
    })

    if (!session) {
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session_found`);
    }


    if(session && !session.user){
        return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_user_found`);
    }

    const result = await authService.googleLoginSuccess(session);

    const {accessToken, refreshToken} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
 // ?redirect=//profile -> /profile
    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

    res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
})
// const googleLoginSuccess = catchAsync(async (req: Request, res: Response) => {
//   const redirectPath = req.query.redirect as string || "/dashboard";

//   const sessionToken = req.cookies["better-auth.session_token"];

//   if (!sessionToken) {
//     return res.redirect(`${envVars.FRONTEND_URL}/login?error=oauth_failed`);
//   }

//   const session = await auth.api.getSession({
//     headers: {
//       Cookie: `better-auth.session_token=${sessionToken}`,
//     },
//   });

//   if (!session || !session.user) {
//     return res.redirect(`${envVars.FRONTEND_URL}/login?error=no_session`);
//   }

//   // Your existing logic
//   const { accessToken, refreshToken } =
//     await authService.googleLoginSuccess(session);

//   tokenUtils.setAccessTokenCookie(res, accessToken);
//   tokenUtils.setRefreshTokenCookie(res, refreshToken);

//   const isValidRedirectPath =
//     redirectPath.startsWith("/") && !redirectPath.startsWith("//");

//   const finalRedirectPath = isValidRedirectPath
//     ? redirectPath
//     : "/dashboard";

//   return res.redirect(`${envVars.FRONTEND_URL}${finalRedirectPath}`);
// });



const handlerOAuthError = catchAsync(async(req:Request, res:Response)=>{
  const error = req.query.error as string || "oauth failed"
  res.redirect(`${envVars.FRONTEND_URL}/login?error=${error}`)
})



 const checkEmailAvailability = catchAsync(async (req, res) => {
    const email = req.query.email as string;

    const exists = await authService.checkEmailExists(email);

    if (exists) {
      return sendResponse(res, {
        httpStatusCode: 400,
        success: false,
        message: "Email already exists",
      });
    }

    return sendResponse(res, {
      httpStatusCode: 200,
      success: true,
      message: "Email available",
    });
  })



export const authControler = {
    registeredUser,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logOutUser,
    verifyEmail,
    forgetPassword,
    resetPassword,
    googleLogin,
    googleLoginSuccess,
    handlerOAuthError,
    checkEmailAvailability
}