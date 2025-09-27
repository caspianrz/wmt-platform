import { Request } from "express";

export default interface FileRequest extends Request {
	file: Express.Multer.File;
};
