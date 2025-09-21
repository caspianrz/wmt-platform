import { Router, Request, Response } from "express";

import { ApplyAttack } from "~/controller/attack";

const router: Router = Router();

router.post('/attack', async (req: Request, res: Response) => {
	const attackName: string = req.body.name;
	const attackArgs: string[] = req.body.args;
	attackArgs[0] = `uploads/${attackArgs[0]}`;

	const result = await ApplyAttack({
		name: attackName,
		args: attackArgs,
	});

	if (result) {
		res.send('OK');
	} else {
		res.send('NOK');
	}
});

export default router;
