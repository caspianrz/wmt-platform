import { Router } from "express";

import Attack from "@routes/attack";
import Watermark from "@routes/watermark";
import Upload from "@routes/upload";
import Auth from "@routes/auth";
import Strategy from "@routes/strategy";
import Apply from "@routes/apply";

const router: Router = Router();

// router.use("/attack", Attack);
// router.use("/watermark", Watermark);
router.use("/upload", Upload);
router.use("/auth", Auth);
router.use("/strategy", Strategy);
// router.use('/apply', Apply);

export default router;
