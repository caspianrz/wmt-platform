import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";

import DatabaseManager from "~/managers/DatabaseManager";
import { JWT_SECRET } from "~/middleware/AuthMiddleware";

const router: Router = Router();

const setToken = (res: Response, username: string) => {
	const token = jwt.sign(
		{ username: username },
		JWT_SECRET,
		{ expiresIn: "2h" }
	);
	return res.setHeader("Authorization", `Bearer ${token}`);
}

const loginHandler = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const auth = await DatabaseManager.instance.authUser(username, password);
	if (auth) {
		return setToken(res, username).sendStatus(200);
	}
	return res.sendStatus(401);
};

const registerHandler = async (req: Request, res: Response) => {
	const { username, password } = req.body;
	const db_res = await DatabaseManager.instance.createUser(username, password);
	if (db_res.ok) {
		return setToken(res, username).sendStatus(200);
	}
	return res.sendStatus(409);
};

router.post('/login', loginHandler);
router.post('/register', registerHandler);

export default router;
