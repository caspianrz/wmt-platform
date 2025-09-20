import { spawn } from "child_process";

function on(strategy:string, callback: (props:any) => void) {
	switch (strategy) {
		case 'watermark':
			const proc = spawn('bin/diwatermark', [
				
			]);
		case 'unwatermark':
		
		default:
	}
}

function DWTSVDStrategy() {
	on('watermark', ()=> {

	});

	return null;
}
