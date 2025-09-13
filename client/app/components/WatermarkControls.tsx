import { useCallback, useEffect, useState } from "react";
import { Button } from "./ui/Button";
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/Select";
import { Slider } from "./ui/Slider";
import { ImageUploader } from "./ImageUploader";
import loadImage from "./ImageProcessor";
import { createCanvas } from "canvas";

interface WatermarkControlsProps {
  watermarkText: string;
  setWatermarkText: (text: string) => void;
  watermarkOpacity: number;
  setWatermarkOpacity: (opacity: number) => void;
  watermarkPosition: string;
  setWatermarkPosition: (position: string) => void;
  watermarkType: string;
  setWatermarkType: (type: string) => void;
  watermarkPositionType: string;
  setWatermarkPositionType: (type: string) => void;
  watermarkX: number;
  setWatermarkX: (x: number) => void;
  watermarkY: number;
  setWatermarkY: (y: number) => void;
  onApplyWatermark: (data : string) => void;
  disabled: boolean;
}

export function WatermarkControls({
  watermarkText,
  setWatermarkText,
  watermarkOpacity,
  setWatermarkOpacity,
  watermarkPosition,
  setWatermarkPosition,
  watermarkType,
  setWatermarkType,
  watermarkPositionType,
  setWatermarkPositionType,
  watermarkX,
  setWatermarkX,
  watermarkY,
  setWatermarkY,
  onApplyWatermark,
  disabled,
}: WatermarkControlsProps) {
  return (
    <Card className="p-6">
      <h3 className="mb-4">Watermark Settings</h3>

      <div className="space-y-4">
        <div>
          <Label htmlFor="watermark-type">Watermark Type</Label>
          <Select value={watermarkType} onValueChange={setWatermarkType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Watermark</SelectItem>
              <SelectItem value="logo">Logo Pattern</SelectItem>
              <SelectItem value="invisible">Invisible LSB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {watermarkType === "text" && (
          <div>
            <Label htmlFor="watermark-text">Watermark Text</Label>
            <Input
              id="watermark-text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
              placeholder="Enter watermark text"
            />
          </div>
        )}

        <div>
          <Label htmlFor="watermark-position-type">Position Type</Label>
          <Select
            value={watermarkPositionType}
            onValueChange={setWatermarkPositionType}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relative">Relative</SelectItem>
              <SelectItem value="absolute">Absolute</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {watermarkPositionType === "relative" && (
          <div>
            <Label htmlFor="watermark-position">Position</Label>
            <Select
              value={watermarkPosition}
              onValueChange={setWatermarkPosition}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bottom-right">Bottom Right</SelectItem>
                <SelectItem value="bottom-left">Bottom Left</SelectItem>
                <SelectItem value="top-right">Top Right</SelectItem>
                <SelectItem value="top-left">Top Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="tiled">Tiled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {watermarkPositionType === "absolute" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="watermark-x">X Position (%): {watermarkX}%</Label>
              <Slider
                id="watermark-x"
                min={0}
                max={100}
                step={1}
                value={[watermarkX]}
                onValueChange={(value) => setWatermarkX(value[0])}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="watermark-y">Y Position (%): {watermarkY}%</Label>
              <Slider
                id="watermark-y"
                min={0}
                max={100}
                step={1}
                value={[watermarkY]}
                onValueChange={(value) => setWatermarkY(value[0])}
                className="mt-2"
              />
            </div>
          </div>
        )}

        <div>
          <Label htmlFor="watermark-opacity">
            Opacity: {watermarkOpacity}%
          </Label>
          <Slider
            id="watermark-opacity"
            min={10}
            max={100}
            step={5}
            value={[watermarkOpacity]}
            onValueChange={(value) => setWatermarkOpacity(value[0])}
            className="mt-2"
          />
        </div>

        <Button
          onClick={()=> {}}
          disabled={disabled}
          className="w-full"
        >
          Apply Watermark
        </Button>
      </div>
    </Card>
  );
}