export default interface WatermarkGenProps {
	watermark: string | null;
	setWatermark: ((v: string | null) => void) | null;
}
