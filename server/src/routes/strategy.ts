import { Request, Response, Router } from "express";
import { existsSync, readdirSync, readFileSync } from "fs";

const router: Router = Router();

/**
	* This function returns list of all strategies available.
	*/
router.get('/', async (req: Request, res: Response) => {
	const strategies = readdirSync('./etc/wmtplatform');
	res.json(strategies);
});

router.get('/:strategy', async (req: Request, res: Response) => {
	const strategy = req.params['strategy'];
	if (strategy == undefined) {
		return res.status(401).json({ message: "No strategy specified." });
	}

	if (!existsSync(`./etc/wmtplatform/${strategy}`)) {
		return res.status(404).json({ message: "Strategy not found." });
	}

	const data = readFileSync(`./etc/wmtplatform/${strategy}/strategy.json`, 'utf8');

	return res.status(200).json(JSON.parse(data));
});

export default router;
