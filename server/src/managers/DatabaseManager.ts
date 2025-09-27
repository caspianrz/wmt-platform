import PouchDB from 'pouchdb';
import bcrypt from 'bcrypt';
import { mkdirpSync } from 'fs-extra';
import uuid from 'uuid';
import PouchDBFind from 'pouchdb-find'

interface UserInfo {
	_id: string,
	userId: string,
	email: string,
	password: string,
}

interface WatermarkRecord {
	_id: string,
	user: string,
	path: string,
};

export default class DatabaseManager {
	private saltRound = 10;
	private static _instance: DatabaseManager;
	private _user_db!: PouchDB.Database;
	private _watermark_db!: PouchDB.Database;

	constructor() {
		if (DatabaseManager._instance) {
			return;
		}
		PouchDB.plugin(PouchDBFind);
		mkdirpSync('db');

		this._user_db = new PouchDB('db/users');

		this._watermark_db = new PouchDB('db/watermark');
		this._watermark_db.createIndex({
			index: {
				fields: ['user'],
			},
		});
	}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	public async createUser(user: string, password: string, email: string) {
		const userId: string = uuid.v4();
		try {
			const record = await this._user_db.put({
				_id: user,
				userId: userId,
				email: email,
				password: await bcrypt.hash(password, this.saltRound)
			});
			return { record: record, userid: userId };
		} catch {
			return null;
		}
	}

	public async authUser(user: string, password: string): Promise<null | UserInfo> {
		try {
			const userinfo: UserInfo = await this._user_db.get(user);
			if (await bcrypt.compare(password, userinfo.password)) {
				return userinfo;
			}
		} catch (e: any) {
			return null;
		}
		return null;
	}

	public async addWatermark(user: string, path: string): Promise<string> {
		const dbq = await this._watermark_db.post({
			user: user,
			path: path
		});
		return dbq.id;
	}

	public async getUserWatermarks(user: string, limit: number = 10): Promise<WatermarkRecord[]> {
		const dbq = await this._watermark_db.find({
			selector: {
				user: { $eq: user },
			},
			fields: ['_id', 'user', 'path'],
			limit: limit
		});
		return dbq.docs as unknown as WatermarkRecord[];
	}

	public async deleteWatermark(id: string) {
		this._watermark_db.get(id).then((doc) => {
			return this._watermark_db.remove(doc);
		});
	}
}
