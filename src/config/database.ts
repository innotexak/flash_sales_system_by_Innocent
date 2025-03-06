import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const options = {
    serverSelectionTimeoutMS: 30000, // Defaults to 30000 (30 seconds)
};

class db {
    private readonly log: any;

    constructor(log: any) {
        this.log = log;
    }

    public connect(DB_URL: string) {
        const log = this.log;
        mongoose.set("strictQuery", false);

        const connectWithRetry = () => {
            log.info('Attempting MongoDB connection (will retry if needed)');
            mongoose
                .connect(DB_URL, options)
                .then(async () => {
                    log.info(`Successfully connected to `, DB_URL);
                })
                .catch((err: any) => {
                    log.error(`There was a db connection error `, err);
    
                    setTimeout(connectWithRetry, 5000); // Retry connection after 5 seconds
                });
        };


        connectWithRetry();

        mongoose.connection.on("disconnected", () => {
            log.error(`Successfully disconnected from ${DB_URL}`);
        });

        process.on("SIGINT", () => {
            mongoose.connection.close().then(() => {
                log.error("dBase connection closed due to app termination");
            });
        });
    }
}

export default db;
