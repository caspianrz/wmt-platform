import PouchDB from 'pouchdb';
import bcrypt from 'bcrypt';

interface UserInfo {
	_id: string,
	password: string,
}

export default class DatabaseManager {
	private saltRound = 10;
	private static _instance: DatabaseManager;
	private _user_db = new PouchDB('db/users');

	constructor() {
		if (DatabaseManager._instance) {
			return;
		}
	}

	public static get instance() {
		return this._instance || (this._instance = new this());
	}

	public async createUser(user: string, password: string) {
		const record = await this._user_db.put({
			_id: user,
			password: await bcrypt.hash(password, this.saltRound)
		});
		return record;
	}

	public async authUser(user: string, password: string): Promise<boolean> {
		const userinfo: UserInfo = await this._user_db.get(user);
		return await bcrypt.compare(userinfo.password, password);
	}
}
