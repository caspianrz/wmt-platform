import { Router } from "express";
import { applyWatermarkHandler } from "~/handlers/apply";
import AuthMiddleware from "~/middleware/AuthMiddleware";

const router: Router = Router();
router.use(AuthMiddleware);

router.post("/:strategy", applyWatermarkHandler);

export default router;
