import mongoose, { ObjectId , Document} from "mongoose";


export interface IPurchase extends Document{
  userId:ObjectId
  productId:ObjectId
  quantity:number
  paymentId:ObjectId
  createdAt?:Date
  updatedAt?:Date
}
 const purchaseSchema = new mongoose.Schema<IPurchase>({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account" },

  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product" 
  },
  paymentId:{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Payment" 
  },
  quantity: {
    type:Number

  }
},{
  timestamps:true
});

export default mongoose.model<IPurchase>("Purchase", purchaseSchema);
