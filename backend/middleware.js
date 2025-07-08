const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const authMiddleware = (req,res,next)=>{
    //check if the headeer has authorization bearer token
    const authHeader = req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(403).json({
            message: "Forbidden: No token provided"
        })
    }
    //Verify the token is valid
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;
        //Put the userId in request object if user checks out
        req.userId = userId;;

        next();
    } catch (err) {
        return res.status(403).json({});
    }
    
}

module.exports = authMiddleware;
