import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    code?: number; // Allow custom status codes
}

// Error-handling middleware
const errorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(err.message); 

    const statusCode = err.code || 500; 
    res.status(statusCode).json({
        success: false,
        message: err.message || 'An unexpected error occurred',
    });
};

export default errorMiddleware;
