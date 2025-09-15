import type Size from "./Size";

export default interface WatermarkGenProps {
	watermark: string | null;
	setWatermark: ((v: string | null) => void) | null;
	size: Size;
	setSize: ((v: Size | null) => void) | null;
}
