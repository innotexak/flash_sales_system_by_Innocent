import mongoose, { Document,ObjectId , Decimal128} from "mongoose";

export enum ITransactionEnum{
    Pending='pending',
    Success='success',
    Failed="failed",
    Fraud='fraud'
}
export interface IPayment extends Document{
userId:ObjectId
amount:Decimal128,
productId:ObjectId,
paymentRef:string
status:ITransactionEnum
createdAt?:Date
updatedAt?:Date

}
const paymentSchema = new mongoose.Schema<IPayment>({

 amount: {
    type:mongoose.Types.Decimal128,

},
  productId:{
    type: mongoose.Types.ObjectId, 
    index:true
},

status:{
    type:String,
    enum:Object.values(ITransactionEnum),
    default:ITransactionEnum.Pending
},
paymentRef:{
    type:String,
    trim:true,
    unique:true
}
},{
    timestamps:true
  });

  export default mongoose.model<IPayment>("Payments", paymentSchema);

