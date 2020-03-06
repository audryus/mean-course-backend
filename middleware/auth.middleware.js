const jwt = require("jsonwebtoken");

var authDenial = res => res.status(401).json({ message: "You are not authorized."});

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        authDenial(res);
    }
};