import express, { NextFunction, Request, Response } from "express";
import rateLimit from 'express-rate-limit'
import applicationJSON from '../package.json' assert {type:"json"}
import router from "./route.js";
import helmet from 'helmet'
import db from "./config/database.js";
import { MONGO_URL } from "./config/config.js";
import cors from 'cors'

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import errorMiddleware from "./middleware/errorHandler.js";

// Check if we are in development or production mode
const isProduction = process.env.NODE_ENV === 'production';

// Set the correct path based on the environment
const apiPath = isProduction ? './dist/src/route.js' : './src/route.ts';
const app = express();

// Enable CORS with specific options
app.use(cors({
  origin: isProduction ? "https://production_url.com" : "*",  // Allow specific domains in production
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  credentials: true, // Allow credentials like cookies or Authorization headers
}));

app.use(express.json());


app.use(helmet());


// Swagger configuration
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: applicationJSON.name,
      version: applicationJSON.version,
      description: 'API documentation',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [apiPath], // Path to your API route files
};

const specs = swaggerJsdoc(options);

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
//Connecting mongose
new db(console).connect(MONGO_URL as string);

//Routes
app.get('/', (req:Request, res:Response, next:NextFunction)=>{
  res.status(200).json({name:applicationJSON.name, version:applicationJSON.version} )
  })

app.use('/api/v1', router)



// Rate Limiting (Prevent abuse)
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests. Try again later.",
});

app.use(limiter);


const PORT: number = Number(process.env.PORT) || 5000;


// Use the error middleware (last in the middleware chain)
app.use(errorMiddleware);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


export default app


