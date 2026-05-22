import jwt from "jsonwebtoken";

export const protect=(req,res,next)=>{
    const bearerToken = req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;
    const token = req.cookies.token || bearerToken;

    if (!token) {
        return res.status(401).json({ message: "not authorized, no token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({ message: "jwt expired" });
        }

        return res.status(401).json({ message: "not authorized, invalid token" });
    }
}
