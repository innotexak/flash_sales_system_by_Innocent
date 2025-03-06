import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import {flashService} from "./services/flashSalesService.js";
import { userService } from "./services/userService.js"; // ✅ Import UserService
import __Account, { IAccount } from "./models/account.js";
import { authMiddleware } from "./middleware/authMiddleware.js"; // ✅ Import authentication middleware
import PaystackPaymentService from "./services/paystackPayService.js";


export interface CustomRequest extends Request {
  user?: IAccount; // You can specify the type more explicitly for user
}

const router = express.Router();


// ✅ Create a new user (Signup)
router.post(
  "/register",
  [
    body("firstName").isString().withMessage("First name is required"),
    body("lastName").isString().withMessage("Last name is required"),
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  async (req: Request, res: Response) => {
     /**
 * @swagger
 * /api/v1/register:
 *   post:
 *     summary: Create a new user (Signup)
 *     description: Register a new user by providing first name, last name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: First name of the user
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Last name of the user
 *                 example: "Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Password for the account (minimum 6 characters)
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "507f1f77bcf86cd799439011"
 *                 firstName:
 *                   type: string
 *                   example: "John"
 *                 lastName:
 *                   type: string
 *                   example: "Doe"
 *                 email:
 *                   type: string
 *                   example: "johndoe@example.com"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

    await userService.createUser(req, res);
  }
);

// ✅ Login a user
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").isString().withMessage("Password is required"),
  ],
  async (req: Request, res: Response) => {

    /**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login a user
 *     description: Authenticate user by providing email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: User's password
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "507f1f77bcf86cd799439011"
 *                     email:
 *                       type: string
 *                       example: "johndoe@example.com"
 *                 token:
 *                   type: string
 *                   description: JWT token for authentication
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI..."
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal server error
 */

   
      await userService.loginUser(req, res);
     
  }
);


// ✅ Product and Purchase Routes (No changes, they are already authenticated in your logic)
// Get product details by ID
router.get(
  "/product/:id",
  param("id").isMongoId().withMessage("Invalid product ID"),
  async(req:CustomRequest, res:Response)=>{
  /**
   * @swagger
   * /api/v1/product/{id}:
   *   get:
   *     summary: Get product details
   *     description: Retrieve the details of a product using the product ID.
   *     parameters:
   *       - name: id
   *         in: path
   *         required: true
   *         description: Product's unique ID
   *         schema:
   *           type: string
   *           example: "507f1f77bcf86cd799439011"
   *     responses:
   *       200:
   *         description: Product details retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: object
   *                   properties:
   *                     stock:
   *                       type: integer
   *                       example: 50
   *                     price:
   *                       type: number
   *                       format: float
   *                       example: 29.99
   *       400:
   *         description: Invalid product ID
   *       404:
   *         description: Product not found
   *       500:
   *         description: Internal server error
   */
  await flashService.getProductDetails(req, res)
}
);



// Get the purchase leaderboard
router.get("/leaderboard", authMiddleware, async (req:CustomRequest, res:Response)=>{
  /**
   * @swagger
   * /api/v1/leaderboard:
   *   get:
   *     summary: Get the purchase leaderboard
   *     description: Retrieve the leaderboard of users based on their purchase history.
   *     responses:
   *       200:
   *         description: Successfully retrieved leaderboard
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       name:
   *                         type: string
   *                         example: "John Doe"
   *                       timestamp:
   *                         type: string
   *                         format: date-time
   *                         example: "2025-03-05T12:34:56Z"
   *       500:
   *         description: Internal server error
   */
  await flashService.getLeaderboard(req, res)
}
);



// Initialize Payment
router.post('/init/pay', 
  [
    body("productId").isMongoId().withMessage("Invalid product ID"),
    body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be greater than zero"),
  ],
  authMiddleware, 
  async (req: CustomRequest, res: Response) => {

  /**
 * @swagger
 * /api/v1/init/pay:
 *   post:
 *     summary: Initialize a payment with Paystack
 *     description: Initialize a purchase payment using Paystack, verify stock availability, and update inventory.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product being purchased
 *                 example: "65f1e9b03a6d4e001e89cbbb"
 *               quantity:
 *                 type: integer
 *                 description: The number of items to purchase
 *                 example: 2
 *     responses:
 *       201:
 *         description: Payment initialized successfully. User should complete the payment.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Kindly complete the payment"
 *                 data:
 *                   type: object
 *                   properties:
 *                     reference:
 *                       type: string
 *                       example: "paystack-payment-reference"
 *                     authorization_url:
 *                       type: string
 *                       example: "https://paystack.com/pay/xyz123"
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Validation errors"
 *                     details:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           msg:
 *                             type: string
 *                             example: "Quantity must be greater than zero"
 *                           param:
 *                             type: string
 *                             example: "quantity"
 *                           location:
 *                             type: string
 *                             example: "body"
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Product not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Internal Server Error"
 */

  await flashService.makePurchase(req, res)
});

//Process paystack webhook
router.post("/webhook", async (req: Request, res: Response) => {
  /**
   * @swagger
   * /api/v1/webhook:
   *   post:
   *     summary: Paystack payment webhook
   *     description: Handle the webhook from Paystack after a payment is completed.
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               event:
   *                 type: string
   *                 example: "charge.success"
   *               data:
   *                 type: object
   *                 properties:
   *                   reference:
   *                     type: string
   *                     example: "paystack-payment-reference"
   *                   amount:
   *                     type: number
   *                     example: 2999
   *                   status:
   *                     type: string
   *                     example: "success"
   *     responses:
   *       200:
   *         description: Webhook processed successfully
   *       500:
   *         description: Internal server error
   */
  await new PaystackPaymentService().processWebhook(req.body);
});



/**
 * @swagger
 * /api/v1/complete/{reference}:
 *   post:
 *     summary: Finalize and update a purchase after payment verification
 *     description: Verifies a payment using Paystack and updates the purchase status accordingly.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reference
 *         required: true
 *         schema:
 *           type: string
 *         description: The payment reference to verify
 *     responses:
 *       200:
 *         description: Payment updated successfully or already updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payment updated successfully"
 *       400:
 *         description: Payment not successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Payment not successful; Status: Failed"
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Server error
 */
router.post('/complete/:reference', authMiddleware, async (req:CustomRequest, res:Response)=> await flashService.updateAndFinalizePurchase(req, res));

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Retrieve all products
 *     description: Fetches a list of all available products from the database.
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of products.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60c72b2f5f1b2c001c8e4d1e"
 *                       name:
 *                         type: string
 *                         example: "Sample Product"
 *                       price:
 *                         type: number
 *                         example: 100
 *                       description:
 *                         type: string
 *                         example: "A high-quality product"
 *                       category:
 *                         type: string
 *                         example: "Electronics"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2024-03-06T12:00:00Z"
 *       404:
 *         description: No products found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Product empty"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: "Internal Server Error"
 */
router.get('/products', async (req:CustomRequest, res:Response)=> await flashService.getProducts(req,res));


router.post(
  "/products",
  [
    body("name").isString().withMessage("Product name is required"),
    body("stock").isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
    body("saleStart").optional().isISO8601().toDate().withMessage("Sale start must be a valid date"),
    body("saleEnd").optional().isISO8601().toDate().withMessage("Sale end must be a valid date"),
  ],
  async (req:Request, res:Response) => {

    /**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Add a new product
 *     description: Adds a new product with details including name, stock, price, and optional sale start/end dates.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Organic Fertilizer"
 *               stock:
 *                 type: integer
 *                 example: 50
 *               price:
 *                 type: number
 *                 format: float
 *                 example: 1499.99
 *               saleStart:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-03-10T00:00:00Z"
 *               saleEnd:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-04-10T00:00:00Z"
 *     responses:
 *       201:
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Product added successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "65f23c2b8a934f0012abcd34"
 *                     name:
 *                       type: string
 *                       example: "Organic Fertilizer"
 *                     stock:
 *                       type: integer
 *                       example: 50
 *                     price:
 *                       type: number
 *                       format: float
 *                       example: 1499.99
 *                     saleStart:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-03-10T00:00:00Z"
 *                     saleEnd:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-04-10T00:00:00Z"
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized - Token missing or invalid
 *       500:
 *         description: Internal server error
 */
    await flashService.addProduct(req, res);
  }
);

export default router;
