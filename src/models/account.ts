import mongoose, { Document }  from "mongoose";
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { ACCESS_SECRETKEY } from "../config/config.js";

export interface IAccount extends Document{
    name:string
    email:string
    firstName:string
    lastName:string
    phoneNumber:number
    password:string
    createdAt?:Date
    updatedAt?:Date
    comparePassword(plainPassword: string): Promise<boolean>;
    generateAuthToken(): string;
}
const accountSchema = new mongoose.Schema<IAccount>({
  name: {
    type:String,
    index:true,
    require:true,
},
  email: { 
    type: String, 
    unique: true,
    index:true,
    require:true,
},
phoneNumber:{
    type:Number
},
firstName:{
    type:String,   
},
lastName:{
    type:String,   
},
password: { 
    type: String, 
    required: true,
     minlength: 6 
    },
},{
    timestamps:true
});

// ✅ Hash password before saving
accountSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });
  
  // ✅ Method to compare passwords
  accountSchema.methods.comparePassword = async function (plainPassword: string) {
    return bcrypt.compare(plainPassword, this.password);
  };
  
  // ✅ Method to generate JWT token
  accountSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, role: this.role }, ACCESS_SECRETKEY!, {
      expiresIn: "7d",
    });
  };

export default mongoose.model<IAccount>("Accounts", accountSchema);

