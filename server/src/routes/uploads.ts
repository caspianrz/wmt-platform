import { Request, Response, Router } from "express";
import path from "path";

const router: Router = Router();

const uploadDir = path.join(".", "uploads");

const getUpload = async (req: Request, res: Response) => {
	const kind = req.params['kind'];
	const id = req.params['id'];
	if (id == undefined || kind == undefined) {
		return res.sendStatus(400);
	}
	console.log(`${uploadDir}/${req.params['user']}/${req.params['kind']}/${req.params['id']}`);
	return res.sendFile(`${req.params['user']}/${req.params['kind']}/${req.params['id']}`, {
		root: uploadDir
	});
}

router.get('/:user/:kind/:id', getUpload);

export default router;
