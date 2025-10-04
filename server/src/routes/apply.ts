import { Router, Request, Response } from "express";
import { mkdirSync } from "fs";
import { mkdirpSync, readdirSync, readJsonSync, readSync } from "fs-extra";
import path from "path";
import { AuthRequest } from "~/middleware/AuthMiddleware";
import uuid from "uuid";
import { exec } from "child_process";

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

const currentQueue: string[] = [];

interface WatermarkingRequest {
	data: {
		strategy: string,
		image: string,
		watermark: string,
	}
	sha512: string,
}

const applyWatermarkHandler = (req: Request, res: Response) => {
	const aReq = req as (Request & AuthRequest);
	const wmData: WatermarkingRequest = req.body as WatermarkingRequest;

	const imagePath = path.join(uploadDir, `/${aReq.user}/assets/${wmData.data.image}`);
	const watermarkPath = path.join(uploadDir, `/${aReq.user}/watermark/${wmData.data.watermark}`);
	const outputDir = path.join(uploadDir, `/${aReq.user}/watermarked/raw`);
	mkdirpSync(outputDir);
	const strategyData = strategiesData.get(wmData.data.strategy);

	mkdirSync(outputDir);

	const inputs = [imagePath];
	const watermarks = [watermarkPath];
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

	const outputuuid = uuid.v4();
	strategyData!.watermarking.output.pos.forEach((pos, i) => {
		const oput = path.join(outputDir, `${outputuuid}-${i}`);
		createdPaths.push(oput);
		args[pos] = oput;
	});

	switch (wmData.data.strategy) {
		case 'dwthdsvd':
			const proc = exec(`./bin/dwtsvdw ${args.join(' ')}`);
			proc.on('exit', (code) => {
				if (code == 0) {
					res.json({
						outputs: createdPaths,
					});
				}
			});
			break;
		default:
			return res.status(400).json({ message: `${wmData.data.strategy} strategy not found.` });
	}

	res.json(wmData);
};

router.post('/', applyWatermarkHandler);

export default router;
