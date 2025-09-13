import { useEffect, useRef, useState } from "react";
import { ImageUploader } from "~/components/ImageUploader";
import { Card } from "~/components/ui/Card";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Slider } from "~/components/ui/Slider";
import loadImage from "~/components/ImageProcessor";
import { ImageCanvas } from "~/components/ImageCanvas";
import { createCanvas } from "canvas";
import ColorUtil from "~/utils/ColorUtil";
import { Colorful } from "@uiw/react-color";
import type FontProps from "~/components/FontProps";
import { FontWeight } from "~/components/FontProps";

export default function TextWatermarkSettings() {
  const [text, setText] = useState("Hello");
  const [type, setType] = useState("absolute");
  const [relativePosition, setRelativePosition] = useState("center");
  const [imageData, setImageData] = useState<string | null>(null);
  const [background, setBackground] = useState("#ffffff");
  const [foreground, setForeground] = useState("#000000");
  const [xOffset, setXOffset] = useState(0);
  const [yOffset, setYOffset] = useState(0);
  const [imageWidth, setImageWidth] = useState(512);
  const [imageHeight, setImageHeight] = useState(512);
  const [fontProps, setFontProps] = useState<FontProps>({
    family: undefined,
    size: 48,
    weight: FontWeight.Regular,
  });

  const createFromText = () => {
    const width = imageWidth;
    const height = imageHeight;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");
    let fontWeight = "";
    switch (fontProps.weight) {
      case FontWeight.Regular:
        fontWeight = "";
        break;
      case FontWeight.Bold:
        fontWeight = "bold";
        break;
      case FontWeight.Italic:
        fontWeight = "italic";
        break;
    }
    const fontSize = `${fontProps.size}px`;
    const fontFamily = `"${fontProps.family}"`;

    ctx.fillStyle = ColorUtil.isValid(background) ? background : "#ffffff";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;
    const textMeasures = ctx.measureText(text);
    let textW = textMeasures.width / 2;
    let textH =
      textMeasures.fontBoundingBoxAscent + textMeasures.fontBoundingBoxDescent;

    let off_x: number = 0,
      off_y: number = 0;
    switch (type) {
      case "absolute": {
        off_x = (width * xOffset) / 100;
        off_y = (height * yOffset) / 100 + textH;
        break;
      }
      case "relative": {
        switch (relativePosition) {
          case "bottom-right":
            off_x = width - textW * 2;
            off_y = height - textH;
            break;
          case "bottom-left":
            off_x = 0;
            off_y = height - textH;
            break;
          case "top-right":
            off_x = width - textW * 2;
            off_y = textH * 2;
            break;
          case "top-left":
            off_x = 0;
            off_y = textH * 2;
            break;
          case "center":
            off_x = width / 2 - textW;
            off_y = height / 2 + textH;
            break;
        }
      }
    }
    ctx.fillStyle = foreground;
    ctx.fillText(text, off_x, off_y);
    const output = canvas.toDataURL();
    setImageData(output);
  };

  useEffect(() => {
    createFromText();
  });

  return (
    <div>
      <Label htmlFor="watermark-text">Watermark Text</Label>
      <Input
        id="watermark-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter watermark text"
      />

      <Label htmlFor="watermark-size-width">Width</Label>
      <Input
        id="watermark-size-width"
        value={imageWidth}
        onChange={(e) => setImageWidth(parseFloat(e.target.value))}
        placeholder="400"
      />

      <Label htmlFor="watermark-size-height">Height</Label>
      <Input
        id="watermark-size-height"
        value={imageHeight}
        onChange={(e) => setImageHeight(parseFloat(e.target.value))}
        placeholder="400"
      />

      <Label>Font</Label>
      <Input
        value={fontProps.family}
        onChange={(e) =>
          setFontProps({
            ...fontProps,
            family: e.target.value,
          })
        }
        placeholder="Arial"
      />

      <Input
        value={fontProps.size}
        onChange={(e) =>
          setFontProps({
            ...fontProps,
            size: parseFloat(e.target.value),
          })
        }
        placeholder="48"
      />

      <Label htmlFor="watermark-background">Background</Label>
      <Colorful
        id="watermark-background"
        style={{ margin: "1em" }}
        color={background}
        onChange={(color) => {
          setBackground(color.hex);
        }}
        disableAlpha
      />

      <Label htmlFor="watermark-foreground">Foreground</Label>
      <Colorful
        id="watermark-foreground"
        style={{ margin: "1em" }}
        color={foreground}
        onChange={(color) => {
          setForeground(color.hex);
        }}
        disableAlpha
      />

      <Label htmlFor="watermark-position-type">Position Type</Label>
      <Select
        value={type}
        onValueChange={(value) => {
          setType(value);
        }}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relative">Relative</SelectItem>
          <SelectItem value="absolute">Absolute</SelectItem>
        </SelectContent>
      </Select>

      {type === "relative" && (
        <div>
          <Label htmlFor="watermark-position">Position</Label>
          <Select
            value={relativePosition}
            onValueChange={(value) => setRelativePosition(value)}
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
            </SelectContent>
          </Select>
        </div>
      )}

      {type === "absolute" && (
        <div className="space-y-3">
          <div>
            <Label htmlFor="watermark-x">X Position (%): {xOffset}%</Label>
            <Slider
              id="watermark-x"
              min={0}
              max={100}
              step={1}
              value={[xOffset]}
              onValueChange={([value]) => setXOffset(value)}
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="watermark-y">Y Position (%): {yOffset}%</Label>
            <Slider
              id="watermark-y"
              min={0}
              max={100}
              step={1}
              value={[yOffset]}
              onValueChange={([value]) => setYOffset(value)}
              className="mt-2"
            />
          </div>
        </div>
      )}

      <ImageCanvas imageData={imageData} />
    </div>
  );
}
