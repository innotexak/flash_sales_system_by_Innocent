# Flash Sales API

This is the backend API for the Flash Sales System, built with Node.js, Express, and TypeScript. It includes authentication, payment integration, and a flash sales management system.

## Prerequisites

Ensure you have the following installed:
- Node.js (16.x or 18.x)
- npm (10.5.0 or later)
- MongoDB

## Project Structure

```
flash_sales_api/
│── src/
│   ├── config/       # Configuration files
│   ├── helpers/      # Utility services (generalService)
│   ├── middleware/   # Express middleware
│   ├── models/       # Mongoose schemas
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   │   ├── flashSalesService.ts
│   │   ├── paystackPayService.ts
│   │   ├── userService.ts
│   ├── app.ts        # Express app setup
│── dist/             # Compiled TypeScript code
│── package.json      # Project dependencies
│── tsconfig.json     # TypeScript configuration
│── .env              # Environment variables
```

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/flash_sales_api.git
   cd flash_sales_api
   ```

2. Install dependencies:
   ```sh
   yarn install
   ```

3. Create a `.env` file in the root directory and add your environment variables:
   ```env
   MONGO_URL=mongodb://127.0.0.1:27017/flash-sales
   NODE_ENV=development
   PORT=5000
   PAYSTACK_BASE_URL=https://api.paystack.co
   PAYSTACK_SECRET_KEY=your_paystack_secret_key
   ACCESS_SECRETKEY=your_access_secret_key
   ```

## Running the Server

### Development Mode
To start the server in development mode with hot-reloading:
```sh
yarn dev
```

### Production Mode
To build and start the server in production mode:
```sh
yarn build
yarn dev
```

## API Documentation

Swagger documentation is available at:
```
http://localhost:5000/api-docs
```


## License

This project is licensed under the MIT License.
