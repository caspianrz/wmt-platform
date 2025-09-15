import axios, { type AxiosResponse } from "axios";
import type Size from "~/components/Size";

interface WatermarkUploadData {
	image: string; // dataURL of base image
	imageSize: Size,
	watermark: string; // dataURL of watermark
	watermarkSize: Size,
	alpha: number;
}

class EnvironmentManager {
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

function dataURLtoBlob(dataURL: string) {
	const arr = dataURL.split(',');
	const x = arr[0].match(/:(.*?);/);
	if (x == null || x[1] == null) {
		return;
	}
	const mime = x[1];
	const bstr = atob(arr[1]);
	let n = bstr.length;
	const u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}

	return new Blob([u8arr], { type: mime });
}

export default function ImageUploaderToWatermark(data: WatermarkUploadData, onFulfilled: (response: AxiosResponse) => void, onError: ((reason: any) => void) | null) {
	const serverURL = new URL("/api/watermark", document.location.origin);
	const formData = new FormData();
	formData.append('image', new File([dataURLtoBlob(data.image) as BlobPart], 'image.png', { type: 'image/png' }));
	formData.append('watermark', new File([dataURLtoBlob(data.watermark) as BlobPart], 'watermark.png', { type: 'image/png' }));
	formData.append('alpha', `${data.alpha}`);
	serverURL.port = EnvironmentManager.Instance.SERVER_PORT;
	axios.post(serverURL.href, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	})
		.then(onFulfilled)
		.catch(onError);
}
