import { Router, Request, Response } from "express";
import { existsSync, mkdirSync } from "fs";
import { mkdirpSync, readdirSync, readJsonSync, readSync } from "fs-extra";
import path from "path";
import AuthMiddleware, { AuthRequest } from "~/middleware/AuthMiddleware";
import uuid from "uuid";
import { ChildProcess, exec } from "child_process";
import DatabaseManager from "~/managers/DatabaseManager";

interface StrategyDataExtras {
	kind: string,
	pos: number[],
	name?: string,
	value_range?: { min: number, max: number },
}

interface StrategyData {
	name: string,
	kind: string[],
	watermarking: {
		argc: number,
		input: {
			kind: string,
			pos: number[],
		},
		watermark: {
			kind: string,
			pos: number[],
		},
		output: {
			kind: string,
			pos: number[],
		},
		extra: StrategyDataExtras[],
	},
	unwatermarking: {
		argc: 3,
		image: {
			kind: string,
			pos: number[],
		},
		output: {
			kind: string,
			pos: number[],
		},
		extra: StrategyDataExtras[],
	}
}


const uploadDir = path.join(".", "uploads");
const strategiesData: Map<string, StrategyData> = new Map();

(() => {
	const strategies = readdirSync('./etc/wmtplatform/');
	strategies.forEach((strategyFile) => {
		strategiesData.set(strategyFile, readJsonSync(`./etc/wmtplatform/${strategyFile}/strategy.json`));
	});
})();

const router: Router = Router();
router.use(AuthMiddleware);

const currentQueue: string[] = [];

interface WatermarkingRequest {
	data: {
		strategy: string,
		image: string,
		watermark: string,
	}
	sha512: string,
}

const applyWatermarkHandler = async (req: Request, res: Response) => {
	const wmData: WatermarkingRequest = req.body as WatermarkingRequest;

	const aReq: AuthRequest & Request = req as Request & AuthRequest;

	if (aReq.user == undefined) {
		return res.sendStatus(401);
	}

	const strategyData = strategiesData.get(wmData.data.strategy);

	let wmText = undefined;
	if (strategyData?.watermarking.input.kind == 'text') {
		wmText = wmData.data.watermark;
	}

	const imagePath = path.join(uploadDir, `/${aReq.user}/assets/${wmData.data.image}`);
	const wmRecord = await DatabaseManager.instance.getWatermark(wmData.data.watermark);
	const watermarkPath = wmRecord.path;
	const outputuuid = uuid.v4();
	const outputDir = path.join(uploadDir, `/${aReq.user}/watermarked/${outputuuid}`);
	if (!existsSync(outputDir)) {
		mkdirpSync(outputDir);
	}

	const inputs = [imagePath];
	const watermarks = [wmText == undefined ? watermarkPath : wmText];
	const createdPaths: string[] = [];

	const inputArgs = strategyData!.watermarking.input.pos;
	const watermarkArgs = strategyData!.watermarking.watermark.pos;

	const args: string[] = [];

	if (inputArgs.length > inputs.length) {
		// TODO: we don't take more out of nowhere inputs. ?
	}
	inputArgs.forEach((pos, i) => {
		args[pos] = inputs[i]!;
	});

	if (watermarkArgs.length > watermarks.length) {
		// TODO: we still don't have any strategy that has more than one watermark??
	}

	watermarkArgs.forEach((pos, i) => {
		args[pos] = watermarks[i]!;
	});

	strategyData!.watermarking.output.pos.forEach((pos, i) => {
		const oput = path.join(outputDir, `raw-${i}`);
		createdPaths.push(oput);
		args[pos] = oput;
	});

	let proc: ChildProcess | undefined;
	switch (wmData.data.strategy) {
		case 'dwthdsvd':
			proc = exec(`./bin/dwthdsvdw ${args.join(' ')}`);
			proc.on('error', (err) => {
				console.log(err);
			});
			proc.on('exit', (code) => {
				if (code == 0) {
					return res.json({
						id: outputuuid,
						outputs: createdPaths,
					});
				}
			});
			break;
		case 'wmanything':
			proc = exec(`../../../analyzers/sharif-wm/embed.py ${args.join(' ')}`);
			proc.on('error', (err) => {
				console.log(err);
			});
			proc.on('exit', (code) => {
				if (code == 0) {
					return res.json({
						id: outputuuid,
						outputs: createdPaths,
					});
				}
			});
			break;
		default:
			return res.status(400).json({ message: `${wmData.data.strategy} strategy not found.` });
	}
};

router.post('/', applyWatermarkHandler);

export default router;
