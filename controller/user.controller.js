import { sourceMapsEnabled } from "process";
import sendVerificationEmail from "../utils/sendMiail.utils.js";
import User from "../models/user_model.js";
import crypto from "crypto"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config();

const resgister = async(req,res)=>{
   const {name,email,password} = req.body;

   if(!name || !email || !password){
    return res.status(400).json({
        "success":false,
        "message":"required all fields",
    })
   }

   
   if(password.length<8){
    return res.status(400).json({
        success:false,
        message:"Password is not valid"
    })

   }

   try {

    const checker =  await User.findOne({
        email
       });
       
       if(checker){
           return  res.status(400).json({
                "success":false,
                "message":"User already exist",
            })
       }

       const token = crypto.randomBytes(32).toString("hex");
       const tokenExpiry = Date.now() + 10*60*60*1000;

       const user = await User.create({
        name,
        email,
        password,
        VerificationToken:token,
        VerificationTokenExpiry:tokenExpiry,
       });

       if(!user){
        return res.status(200).json({
            success:false,
            message:"user not created",
        })
       }

    //    send mail
       await sendVerificationEmail(user.email,token);

       //response to user
       return res.status(200).json({
        success:true,
        message:"user registered successfully,now verify the email "
       
    })
    
    
   } catch (error) {
    return res.status(500).json({
        success:true,
        message:`internal server error : ${error}`
    });
     
   }

}; 


const verify = async(req,res)=>{
    try {
        const token = req.params.token  

        // get user
        const user = await User.findOne({
            VerificationToken:token,
            VerificationTokenExpiry:{$gt: Date.now()}
        })

        if(!user){
            return res.status(200).json({
                success:false,
                message:"token invalid"
            })
        }

        user.isVerified = true;
        user.VerificationToken=undefined;
        user.VerificationTokenExpiry=undefined;
        await user.save();

        return res.status(200).json({
            success:true,
            message:"User account is verified",
        })
    } catch (error) {
        return res.status(500).json({
            success:true,
            message:"internal server error",
        });
                 
        
    }
};

// login 

const login = async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!",
        });
    }

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid user! Email or password is incorrect",
            });
        }

        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "User email not verified",
            });
        }

        const isPasswordMatch = user.comparePassword(password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password!",
            });
        }

        // const jwtToken = jwt.sign(
        //     { id: user._id },
        //     process.env.JWT_SCERET,
        //     { expiresIn: "15m" }
        // );

        const accessToken = jwt.sign(
            { id: user._id },
            process.env.Access_SCERET,
            { expiresIn:process.env.ACESSTOKEN_EXPIRY }
        );

        const refreshToken = jwt.sign(
            { id: user._id },
            process.env.Refresh_SCERET,
            { expiresIn:process.env.REFRESHTOKEN_EXPIRY }
        );
        
        user.RefreshToken = refreshToken;
        await user.save();

        
        const cookieOptions = {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
            httpOnly: true,
        };
        
        res.cookie("accessToken",accessToken, cookieOptions);
        res.cookie("refreshToken",refreshToken, cookieOptions);

        
        return res.status(200).json({
            success: true,
            message: "Login successful",
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: `Internal server error: ${error}`,
        });
    }
};

//get profile
const getProfile = async (req,res)=>{
    const userId =  req.user.id;

    const user = await User.findById(userId).select("-password"); // by putting this - we are removing password from the coming user objectFit: 

    if(!user){
        return res.status(400).json({
            success:false,
            message:"Please login again",
        })
    }

    return res.status(200).json({
        success:true,
        message:"user profile accessed!",
    })
};

export {resgister,verify,login,getProfile};

