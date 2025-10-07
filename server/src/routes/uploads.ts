import { exec } from "child_process";
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
	return res.sendFile(`${req.params['user']}/${req.params['kind']}/${req.params['id']}`, {
		root: uploadDir
	});
}

const getWatermaked = async (req: Request, res: Response) => {
	const kind = req.params['kind'];
	const id = req.params['id'];
	const user = req.params['user'];
	if (id == undefined || kind == undefined) {
		return res.sendStatus(400);
	}

	if (kind == 'out') {
		const args: string[] = [];
		const path1 = path.join(uploadDir, `${user}/watermarked/${id}/raw-0`)
		const path2 = path.join(uploadDir, `${user}/watermarked/${id}/raw-1`)
		const out: string = path.join(uploadDir, `${user}/watermarked/${id}/out`);
		args.push(path1);
		args.push(path2);
		args.push(out);

		const proc = exec(`./bin/dwthdsvduw ${args.join(' ')}`);
		proc.on('error', (err) => {
			console.log(err);
		});
		proc.on('exit', (code) => {
			if (code == 0) {
				return res.sendFile(`${user}/watermarked/${id}/out`, {
					root: uploadDir
				});
			}
		})
	} else {
		return res.sendFile(`${user}/watermarked/${id}/${kind}`, {
			root: uploadDir
		});
	}
}

router.get('/:user/:kind/:id', getUpload);
router.get('/:user/watermarked/:id/:kind', getWatermaked);

export default router;
