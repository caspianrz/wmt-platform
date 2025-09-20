export default class EnvironmentManager {
	public readonly SERVER_PORT: string = '9990';
	private static _instance: EnvironmentManager;

	constructor() {
		if (EnvironmentManager._instance) {
			return;
		}
	}

	public static get Instance() {
		return this._instance || (this._instance = new this());
	}
}
