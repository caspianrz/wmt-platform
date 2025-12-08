import { Request, Router } from "express";
import { mkdirpSync } from "fs-extra";
import multer from "multer";
import path from "path";
import uuid from "uuid";
import {
  fileDeleteHandler,
  fileGetHandler,
  fileListHandler,
  fileSendHandler,
  fileUpdateHandler,
} from "~/handlers/files";
import AuthMiddleware, { AuthRequest } from "~/middleware/AuthMiddleware";

const router: Router = Router();

router.use(AuthMiddleware);

const uploadDir = path.join(".", "uploads");

export const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req: Request & AuthRequest, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const userid: string = req.userid;
    const id = uuid.v4();
    mkdirpSync(`${uploadDir}/${userid}/assets/`);
    cb(null, `${userid}/assets/${id}${fileExt}`);
  },
});

const mu = multer({ storage: storage });

// CRUD
router.post("/", mu.single("file"), fileSendHandler);
router.get("/", fileListHandler);
router.get("/:id", fileGetHandler);
router.put("/:id", mu.single("file"), fileUpdateHandler);
router.delete("/:id", fileDeleteHandler);

export default router;
