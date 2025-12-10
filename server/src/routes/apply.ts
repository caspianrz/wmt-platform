import { Router } from "express";
import {
  applyWatermarkHandler,
  extractHandlerSharifWm,
} from "~/handlers/apply";
import AuthMiddleware from "~/middleware/AuthMiddleware";

const router: Router = Router();
router.use(AuthMiddleware);

router.post("/embed/:strategy", applyWatermarkHandler);
router.post("/extract/:strategy/:id", extractHandlerSharifWm);

export default router;
