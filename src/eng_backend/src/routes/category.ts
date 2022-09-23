import { Router } from "express";
import CategoryController from "./../controllers/category-controller";
const router = Router();

router.post("/get-category-list", CategoryController.getCategoryList);
router.post("/get-video-list", CategoryController.getVideoList);
export default router;

