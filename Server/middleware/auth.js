import jwt from "jsonwebtoken";

export const protect=(req,res,next)=>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

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