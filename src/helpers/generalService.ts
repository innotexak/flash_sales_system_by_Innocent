
import jwt from "jsonwebtoken";
import __Account from '../models/account.js'
import mongoose from "mongoose";
import { ACCESS_SECRETKEY } from "../config/config.js";
import {v4 as uuid} from 'uuid'




export default class GeneralController  {

    decodeToken(token: string) {
    try{
    return jwt.verify(token, ACCESS_SECRETKEY as string)

    }catch(err){
       console.log({err}, "auth error")
       return null

    }
   }

   isTokenExpired(decoded: any) {
       const currentTimeInSeconds = Math.floor(Date.now() / 1000);
       return decoded?.exp < currentTimeInSeconds;
   }

   async extractUserDetails(token: string) {

       const payload: any = this.decodeToken(token)
    

       const tokenExpired = this.isTokenExpired(payload)
       if (!tokenExpired && payload?.id) {
  
           const userData: any = await __Account.findById(payload.id)

           return userData
       }

       return
   }

   bankersRound(number: number): string {
       // Function to check if a number is exactly halfway between two integers
       const isHalfway = (num: number) => Math.abs(num - Math.round(num)) === 0.5;
       
       let rounded: number;
       if (isHalfway(number)) {
           // If the number is halfway, determine if the integer part is even
           if (Math.floor(number) % 2 === 0) {
               rounded = Math.floor(number);
           } else {
               rounded = Math.ceil(number);
           }
       } else {
           // For non-halfway numbers, use standard rounding and apply two decimal rounding here
           rounded = Math.round(number * 100) / 100;
       }
       
       // Format the rounded number to always have two decimal places
       return rounded.toFixed(2);
   }
   
   generateUniqueId(){ return uuid() }
}
