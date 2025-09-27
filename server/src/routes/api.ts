import { Router } from "express";

import Attack from "@routes/attack";
import Watermark from "@routes/watermark";
import Upload from "@routes/upload";
import Auth from "@routes/auth";
import Uploads from "@routes/uploads";

const router: Router = Router();

router.use('/attack', Attack);
router.use('/watermark', Watermark);
router.use('/upload', Upload);
router.use('/auth', Auth);
router.use('/uploads', Uploads);

export default router;
