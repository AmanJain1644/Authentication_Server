import express, { urlencoded } from "express"
import dotenv from "dotenv"
import cors from "cors"
import db from "./utils/db.js"
import userRoutes from "./routes/user.routes.js"
dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());


app.get("/",(req,res)=>{
    res.send("this is the home page");
});

app.use("/api/v1/user",userRoutes);

db().catch((err)=>{
    console.log("Got error while connecting",err);
});
app.listen(process.env.port,()=>{
    console.log("server listening");
})