import bcrypt from "bcrypt";
import prisma from "../config/db.config.js";
import jwt from "jsonwebtoken";

class AuthController {
    static async register(req, res) {
        const { name, email, mobile, password } = req.body;



        try{

        
        // Validate input
        if (!name || !email || !mobile || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // email validation regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // password bcrypt hashing
        const salt= bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);



        //email and mobile uniqueness check
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { mobile }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email or mobile already exists" });
        }

        const user= await prisma.user.create({
            data: {
                name,
                email,
                mobile,
                password: hashedPassword
            }
        });

        return res.status(201).json({
            message: "User registered successfully",
            user
        });   
        
        }catch(error){
          return res.status(500).json({ message: "Internal server error" });
        }

    }

    // Login method can be added here in the future
static async login(req, res) {
    const { email, password } = req.body;

    try {
        // 1. Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        // 2. Find user by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        // 3. Check if user exists
        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 4. Compare password
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        // 5. Create JWT payload
        const payload = {
            id: user.id,
            name: user.name,
            email: user.email,
            mobile: user.mobile
        };

        // 6. Generate JWT token
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // 7. Return successful response
        return res.status(200).json({
            message: "Login successful",
            access_token: `Bearer ${token}`,
            user: payload
        });

    } catch (error) {

        return res.status(500).json({
            message: "Internal server error"
        });
    }
}

// 

static async getUser (req, res) {
    try {
            // 1. Extract user ID from request (set by authMiddleware)
        const userId = req.user.id;

        // 2. Find user by ID
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({
            message: "User found",
            user
        });
    }catch (error) {
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}
}

export default AuthController;