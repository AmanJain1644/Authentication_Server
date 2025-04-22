import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config();

const db = async()=>{
   await mongoose.connect(process.env.mongodb_url);
   console.log("mongodb got connected");
    // .then(()=>{
    //     console.log("Mongodb got connected")
    // })
    // .catch((err)=>{
    //     console.log("Error:",err);
    // })
}


export default db;