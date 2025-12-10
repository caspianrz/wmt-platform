import { Router } from "express";
import {
  deleteProjectHandler,
  getProjectFileHandler,
  getProjectHandler,
  projectListHandler,
} from "~/handlers/project";
import AuthMiddleware from "~/middleware/AuthMiddleware";

const router: Router = Router();
router.use(AuthMiddleware);

router.get("/", projectListHandler);
router.get("/info/:id", getProjectHandler);
router.get("/file/:id/:stack", getProjectFileHandler);
router.delete("/:id", deleteProjectHandler);

export default router;
