import { Router } from "express";

import Attack from "@routes/attack";
import Watermark from "@routes/watermark";
import Upload from "@routes/upload";
import Auth from "@routes/auth";
import Uploads from "@routes/uploads";
import Strategy from "@routes/strategy";

const router: Router = Router();

router.use('/attack', Attack);
router.use('/watermark', Watermark);
router.use('/upload', Upload);
router.use('/auth', Auth);
router.use('/uploads', Uploads);
router.use('/strategy', Strategy);

export default router;
