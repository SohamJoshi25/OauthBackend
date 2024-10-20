const jwt = require('jsonwebtoken');
require("dotenv").config()

const decodeJwt = (req, res, next) => {

    const token = req.query.token;

    if(!token) {
        return res.status(400).json({error:"Token Not Found : Express"})
    }
    
    try {

        const decoded =  jwt.decode(token, process.env.JWTSecret);
        const userId = decoded.id;
        if (userId) {
            req.session.userId = userId;
        }
       

    } catch (err) {
        console.log(process.env.JWTSecret)
        console.log(token)
        console.log(err)
        return res.status(400).json({ error: 'Invalid token format : Express' });
    }



    next();
};

module.exports = decodeJwt;
