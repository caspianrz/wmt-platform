import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'auth';

export interface AuthRequest {
	user: string;
	userid: string;
}

export default function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers["authorization"];
	const token = authHeader && authHeader.split(" ")[1];
	console.log(req.url);
	console.log(req.headers);
	console.log("TOKEN " + token);

	if (!token) return res.sendStatus(401);

	jwt.verify(token, JWT_SECRET, (err, payload) => {
		console.log(err);
		if (err) return res.sendStatus(403);
		const a = (req as (Request & AuthRequest));
		const p = payload as { user: string, userId: string };
		a.user = p.user;
		a.userid = p.userId;
		next();
	});
}
