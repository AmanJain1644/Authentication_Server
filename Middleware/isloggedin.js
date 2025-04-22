
const isLoggedIn = async (req,res,next)=>{
   try {
        const token = req.cookies.jwtToken;
        if(!token){
            return res.status(400).json({
                success:false,
                message:"jwt token is invalid!!",
            });
        }

        const decoded = jwt.verify(token,process.env.JWT_SCERET)
        req.user = decoded;
        next();
    
   } catch (error) {
        return res.status(400).json({
            success:false,
            message:"internal server error"
        });
   }
};

export default isLoggedIn;