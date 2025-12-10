import { Router } from "express";

import Apply from "@routes/apply";
import Auth from "@routes/auth";
import Strategy from "@routes/strategy";
import Upload from "@routes/upload";
import project from "@routes/project";

const router: Router = Router();

// router.use("/attack", Attack);
// router.use("/watermark", Watermark);
router.use("/upload", Upload);
router.use("/auth", Auth);
router.use("/strategy", Strategy);
router.use("/apply", Apply);
router.use("/project", project);

export default router;
