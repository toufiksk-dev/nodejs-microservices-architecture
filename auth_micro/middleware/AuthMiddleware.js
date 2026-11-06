import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // 1. Check authorization header
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authorization header missing or malformed"
        });
    }

    // 2. Extract token
    const token = authHeader.split(" ")[1];

    try {

        // 3. Verify JWT token
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 4. Attach user information to request
        req.user = payload;

        // 5. Continue to next middleware/controller
        next();

    } catch (error) {

        return res.status(401).json({
            message: "Invalid or expired token"
        });

    }
};

export default authMiddleware;