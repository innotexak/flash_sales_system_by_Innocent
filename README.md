# Flash Sales API

Flash Sales API is a backend service built with Node.js, Express, and MongoDB. It provides features such as user management, payment integration via Paystack, and flash sales functionality.

## Project Structure

```
flash_sales_api/
│── src/
│   ├── config/       # Configuration files
│   ├── helpers/      # General utilities (includes generalService)
│   ├── middleware/   # Express middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   │   ├── flashSalesService.ts  # Flash sales service
│   │   ├── paystackPayService.ts # Paystack integration service
│   │   ├── userService.ts        # User-related operations
│   ├── app.ts        # Express app setup
│── dist/             # Compiled TypeScript code
│── package.json      # Project dependencies
│── tsconfig.json     # TypeScript configuration
│── .env              # Environment variables
```

## Prerequisites

Ensure you have the following installed:
- **Node.js** (16.x or 18.x recommended)
- **MongoDB** (running locally or cloud instance)
- **Git**

## Installation

Clone the repository:
```sh
git clone git@github.com:innotexak/flash_sales_system_by_Innocent.git
```

Navigate into the project directory:
```sh
cd flash_sales_api
```

Install dependencies:
```sh
yarn install
```

## Configuration

Create a `.env` file in the root directory and provide the required environment variables:
```env
MONGO_URL=<your-mongodb-connection-string>
NODE_ENV=development
PORT=5000
PAYSTACK_BASE_URL=https://api.paystack.co
PAYSTACK_SECRET_KEY=<your-paystack-secret-key>
ACCESS_SECRETKEY=<your-secret-key>
```

## Running the Server

For development mode with auto-restart:
```sh
yarn dev
```

For production mode:
```sh
yarn build
node dist/src/app.js
```

## API Documentation

After starting the server, access the Swagger documentation at:
```
http://localhost:5000/api-docs
```

## License

This project is licensed under the MIT License.

---
