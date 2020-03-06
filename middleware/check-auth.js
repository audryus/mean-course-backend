const jwt = require("jsonwebtoken");

var authDenial = res => res.status(401).json({ message: "Auth failed"});

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, "S2U!GVr@h6R7bBfm");
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        next();
    } catch (error) {
        authDenial(res);
    }
};