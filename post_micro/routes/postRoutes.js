import {Router} from "express"; 
import authMiddleware from "../middleware/AuthMiddleware.js";
import PostController from "../controller/PostController.js";
const router= Router();

router.get("/post",PostController.index);
router.post("/post",authMiddleware,PostController.store);

export default router;