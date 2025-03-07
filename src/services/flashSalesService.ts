import express, { Request, Response } from "express";
import __Product from "../models/product.js";
import __Purchase from "../models/purchase.js";
import __Payment, { ITransactionEnum } from '../models/payment.js'
import __Account from "../models/account.js";
import {  validationResult } from "express-validator";
import PaystackPaymentService from "./paystackPayService.js";
import { CustomRequest } from "./userService.js";
import payment from "../models/payment.js";

class ProductPurchaseController {
  //Get products details
  async getProductDetails(req: Request, res: Response): Promise<void> {

    try {
      const product = await __Product.findById(req.params.id);
      if (!product) {
        res.status(404).json({ success: false, error: { message: "Product not found" } });
        return;
      }
      res.json({ success: true, data: { stock: product.stock, price: product.price } });
    } catch (error) {
      console.error("Error getting product details:", error);
      res.status(500).json({ success: false, error: { message: "Internal Server Error" } });
    }
  }

  //Initialize payment
  async makePurchase(req: CustomRequest, res: Response): Promise<void> {

    const {user} = req
    const { productId, quantity } = req.body;

    try {

      const product = await __Product.findById(productId);
      if (!product) {
        res.status(404).json({ success: false, error: { message: "Product not found" } });
        return;
      }

      const now = new Date();
      if (now < product.saleStart || now > product.saleEnd) {
        res.status(400).json({ success: false, error: { message: "Sale is not active" } });
        return;
      }

      const updatedProduct = await __Product.findOneAndUpdate(
        { _id: productId, stock: { $gte: quantity } },
        { $inc: { stock: -quantity } },
        { new: true }
      );


      if (!updatedProduct) {
        res.status(400).json({ success: false, error: { message: "Stock unavailable" } });
        return;
      }

      const payload = {
        email:user.email, 
        amount:Number(product.price.toString()) * quantity,
        matadata: {
          userId: user.id, 
          purpose:`payment for ${product.name}`
        }
      }
      const initPayment = await new PaystackPaymentService().InitializePurchasePayment(payload)
      const commitPayment = await __Payment.create({status:ITransactionEnum.Pending, amount:product.price, userId:user.id, productId:product.id, paymentRef:initPayment.reference })
      const purchase = new __Purchase({ userId:user.id, productId, quantity, paymentId:commitPayment.id});
      await purchase.save();

      res.status(201).json({success:true, message:"Kindly complete the payment", data:initPayment})
    } catch (error) {
      console.error("Error making purchase:", error);
      res.status(500).json({ success: false, error: { message: "Internal Server Error" } });
    }
  }

//Get all available products
async getProducts(req: CustomRequest, res: Response){
  try {
    const product = await __Product.find({});
    if (!product) {
      res.status(404).json({ success: false, error: { message: "Product empty" } });
      return;
    }
    res.json({ success: true, data: product });
  } catch (error) {
    console.error("Error getting product details:", error);
    res.status(500).json({ success: false, error: { message: "Internal Server Error" } });
  }
}

async getLeaderboard(req: CustomRequest, res: Response) {
  try {
    const purchases = await __Purchase.aggregate([
      {
        $lookup: {
          from: "accounts", 
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      { $unwind: "$user" }, 
      { $sort: { createdAt: 1 } }, 
      {
        $project: {
          _id: 0,
          name: { $concat: ["$user.firstName", " ", "$user.lastName"] }, 
          timestamp: "$createdAt"
        }
      }
    ]);

    res.json({ success: true, data: purchases });
  } catch (error) {
    console.error("Error getting leaderboard:", error);
    res.status(500).json({ success: false, error: { message: "Internal Server Error" } });
  }
}


//Update payment
  async updateAndFinalizePurchase(req: Request, res: Response){
    const paymentRef = req.params.reference
    const payments = await __Payment.findOne({paymentRef})

    if(!payment) {
      res.status(400).json({success:false, message:"Invalid verification flow"})
      return 
    }

    if(payments.status === ITransactionEnum.Success){ 
      res.status(200).json({success:true, message:"payment already updated"})
      return
    }

      const verifyPay = await new PaystackPaymentService().verifyTransaction(paymentRef)
      if(verifyPay.status === ITransactionEnum.Success){
        payments.status = ITransactionEnum.Success
        await payments.save()
        res.status(200).json({success:true, message:"payment updated successfully"})
      }else{
        payments.status =verifyPay.status as ITransactionEnum
        await payments.save()
        res.status(400).json({success:false, message:`Payment not successful; Status:${verifyPay.status}`})
      }


  }

  //Add product
  async addProduct(req: CustomRequest, res: Response) {
    try {
      const { name, stock, price, saleStart, saleEnd } = req.body;
  
      // Create a new product
      const product = new __Product({
        name,
        stock,
        price,
        saleStart,
        saleEnd,
      });
  
      await product.save();
  
      res.status(201).json({
        success: true,
        message: "Product added successfully",
        data: product,
      });
    } catch (error) {
      console.error("Error adding product:", error);
      res.status(500).json({
        success: false,
        error: { message: "Internal Server Error" },
      });
    }
  }
  

  
}

export const flashService =  new ProductPurchaseController();

