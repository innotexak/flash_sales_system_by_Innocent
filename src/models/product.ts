import mongoose, { Document , Decimal128} from "mongoose";

export interface IProduct extends Document{
name:string,
stock:number,
price:Decimal128,
saleStart:Date,
saleEnd:Date
createdAt?:Date
updatedAt?:Date

}
const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type:String,
    index:true,
    required:true,
    lowercase:true
},
  stock: { 
    type: Number, 
    required: true 
},
 price: {
    type:mongoose.Types.Decimal128,
},
  saleStart:{
    type: Date
},
  saleEnd: {
    type: Date
},
},{
    timestamps:true
  });

  export default mongoose.model<IProduct>("Products", productSchema);

