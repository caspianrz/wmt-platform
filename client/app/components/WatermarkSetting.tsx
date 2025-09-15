import { useState } from "react";
import { Card } from "~/components/ui/Card";
import { Label } from "~/components/ui/Label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/Select";
import TextWatermarkSettings from "./TextWatermarkSettings";
import ImageWatermarkSettings from "./ImageWatermarkSettings";
import type WatermarkGenProps from "./WatermarkGenProps";


export default function WatermarkSetting(props: WatermarkGenProps) {
	const [ctype, setCType] = useState("text");
	return (
		<Card className="p-4">
			<h3 className="text-xl">Watermark Settings</h3>
			<div className="space-y-4">
				<Label htmlFor="watermark-type">Watermark Type</Label>
				<Select value={ctype} onValueChange={(value) => setCType(value)}>
					<SelectTrigger>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="text">Text</SelectItem>
						<SelectItem value="image">Image</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{ctype === "text" && <TextWatermarkSettings watermark={props.watermark} setWatermark={props.setWatermark} />}

			{ctype === "image" && <ImageWatermarkSettings />}
		</Card>
	);
}
