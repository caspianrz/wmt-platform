import GaussianNoise from "./gaussian_noise";
import Scale from "./scale";

export interface Attack {
	name: string,
	args: string[],
}

export async function ApplyAttack(a: Attack) {
	console.log(a);
	switch (a.name) {
		case 'scale':
			if (a.args[0] != undefined && a.args[1] != undefined) {
				await Scale(a.args[0], parseInt(a.args[1]));
				return true;
			}
		case 'gaussian_noise':
			if (a.args[0] != undefined) {
				await GaussianNoise(a.args[0], a.args[1] as (number | undefined));
				return true;
			}
		default:
			return false;
	}
}
