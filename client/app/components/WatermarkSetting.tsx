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
import { Slider } from "~/components/ui/Slider";
import TextWatermarkSettings from "./TextWatermarkSettings";
import ImageWatermarkSettings from "./ImageWatermarkSettings";

interface WatermarkSettingProps {
  type: string;
  setType: (v: string) => void;
  opacity: number;
  setOpacity: (v: number) => void;
}

export default function WatermarkSetting(props: WatermarkSettingProps) {
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

      {ctype === "text" && <TextWatermarkSettings />}

      {ctype === "image" && <ImageWatermarkSettings />}

      <Label htmlFor="watermark-opacity">Opacity: {props.opacity}%</Label>
      <Slider
        id="watermark-opacity"
        min={10}
        max={100}
        step={5}
        value={[props.opacity]}
        onValueChange={(value) => props.setOpacity(value[0])}
        className="mt-2"
      />
    </Card>
  );
}
