import User from "../models/user_model";
import jwt from "jsonwebtoken";


const isLoggedIn = async(req,res,next)=>{
   try {
        // const token = req.cookies.jwtToken;
        // if(!token){
        //     return res.status(400).json({
        //         success:false,
        //         message:"jwt token is invalid!!",
        //     });
        // }
        //if there is accesstoken give direct access and generate new access and refresh token
        //if there no accesstoken check for refresh token verify and give access and generate new access and refresh token
        //if both are not there ask for relogin

        const accessToken = req.cookies.accessToken;
        const refreshToken = req.cookies.refreshToken;
        if(accessToken){
            try {                
                const decodeAccess = jwt.verify(accessToken,process.env.Access_SCERET);
                req.user = decodeAccess.id;
                return next();
            } catch (error) {
                return res.status(400).json({
                    success:false,
                    message:"internal server error"
                });
                                
            }
        }

        if(!refreshToken){
            return res.status(400).json({
                success:false,
                message:"Not valid tokens"
            });
        }

        try {
            const decodeRefresh = jwt.verify(refreshToken,process.env.Refresh_SCERET);
               
        } catch (error) {
            return res.status(400).json({
                success:false,
                message:"Unauthorized access refresh token is invalid"
            });
        }

        const user = await User.findById(decodeRefresh.id);
            if(!user){
                return res.status(400).json({
                    success:false,
                    message:"Unauthorized Access User not found !",
                });
            }     
            
            const newAccessToken = jwt.sign(
                { id: user._id },
                process.env.Access_SCERET,
                { expiresIn: process.env.ACESSTOKEN_EXPIRY || "15m" }
              );
          
              const newRefreshToken = jwt.sign(
                { id: user._id },
                process.env.Refresh_SCERET,
                { expiresIn: process.env.REFRESHTOKEN_EXPIRY || "24h" }
              );
          
              user.RefreshToken = newRefreshToken;
              await user.save();
          
              const cookieOptions = {
                httpOnly: true,
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
              };
          
              res.cookie("accessToken", newAccessToken, cookieOptions);
              res.cookie("refreshToken", newRefreshToken, cookieOptions);
          
              req.user = user._id;
              next();

        // const decoded = jwt.verify(token,process.env.JWT_SCERET)
        // req.user = decoded;
        // next();
    
   } catch (error) {
        return res.status(400).json({
            success:false,
            message:"internal server error"
        });
   }
};

export default isLoggedIn;