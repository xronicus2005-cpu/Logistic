import jwt from "jsonwebtoken";

export async function checkToken(req, res, next) {
    try {
        const token = req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const decoded = jwt.verify(token, process.env.MY_SECRET);

        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        req.user = decoded;

        next();
    } catch (err) {
        console.log("Error when checking access token:", err);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
}