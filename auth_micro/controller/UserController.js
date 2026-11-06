import prisma from "../config/db.config.js";

class UserController {
    static async getUserById(req, res) {
        const { id } = req.params;
        try {
            const user = await prisma.user.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    mobile: true,
                    createdAt: true,
                    updatedAt: true
                }
            });

            if (!user) {
                return res.status(404).json({
                    message: "User not found"
                });
            }

            return res.status(200).json({
                message: "User found",
                user
            });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error", error: error.message });
            
        }
    
    }
}

export default UserController;