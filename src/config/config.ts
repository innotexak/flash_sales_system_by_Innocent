import {config} from "dotenv";

config({path:'.env'} )

export const isDev = process.env.NODE_ENV !== "production";

const requiredEnvs = [
    "PORT",
    "MONGO_URL",
    "PAYSTACK_BASE_URL", 
    "PAYSTACK_SECRET_KEY",
    "ACCESS_SECRETKEY" 
] as const;


interface Envs {
    [key: string]: string;
}

const envs: Envs = requiredEnvs.reduce((acc: Envs, key: string) => {
    acc[key] = process.env[key] as string;
    return acc;
}, {});

const missingEnvs: string[] = requiredEnvs.filter((key) => !envs[key]);

if (missingEnvs.length > 0) {
    console.error("ENV Error, the following ENV variables are not set:");
    console.table(missingEnvs);
    throw new Error("Fix Env and rebuild");
}


export const {
    MONGO_URL,
    PORT,
    PAYSTACK_BASE_URL, 
    PAYSTACK_SECRET_KEY,
    ACCESS_SECRETKEY 
} = process.env;
