import mongoose from 'mongoose'
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,  
        lowercase:true,     
    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:8,
    },
    isVerified:{
        type:Boolean,
         default:false,
    },
    role:{
        type:String,
        enum:["user","admin"],
        default:"user", 
    },
    VerificationToken: String,
    VerificationTokenExpiry:Date,
    RefreshToken:String,
});

UserSchema.pre('save',async function(next){
   if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10);  // we are not using arrow function with mongo db schema beacause unka this ka scope 
       console.log("this.password ",this.password);
        next();
   } 
});

UserSchema.methods.comparePassword =  async function(password){
    return await bcrypt.compare(password,this.password)
}

const User = mongoose.model("User",UserSchema);

export default User