import {
  Button,
  FormControl,
  Grid,
  Input,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  Stack,
} from "@mui/material";
import React, { useEffect, type FormEvent } from "react";
import { ImageUploader } from "./ImageUploader";
import { ImageCanvas } from "./ImageCanvas";
import EnvironmentManager from "../models/EnvironmentManager";
import axios from "axios";
import type OutputFile from "../models/OutputFile";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate, useSearchParams } from "react-router";

function dataURLtoFile(dataUrl: string, filename: string): File {
  const [header, base64] = dataUrl.split(",");
  const mimeMatch = header.match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
  const binary = atob(base64);
  const len = binary.length;
  const u8arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    u8arr[i] = binary.charCodeAt(i);
  }

  return new File([u8arr], filename, { type: mime });
}

function BasicTextWatermark(props: OutputFile) {
  const [image, setImage] = React.useState<string | null>(null);
  const [width, setWidth] = React.useState(512);
  const [height, setHeight] = React.useState(512);
  const [watermarkText, setWatermarkText] = React.useState("");
  const [fontSize, setFontSize] = React.useState(48);
  const [background, setBackground] = React.useState("#FFFFFF");
  const [foreground, setForeground] = React.useState("#000000");
  const [offX, setOffX] = React.useState(0);
  const [offY, setOffY] = React.useState(0);

  useEffect(() => {
    //🔥 به‌جای createCanvas از خود مرورگر استفاده می‌کنیم
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- پس‌زمینه ---
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    // --- متن ---
    ctx.font = `${fontSize}px serif`;
    ctx.textBaseline = "top";
    ctx.fillStyle = foreground;

    const textMeasures = ctx.measureText(watermarkText);
    const textH =
      (textMeasures.actualBoundingBoxAscent || 0) +
      (textMeasures.actualBoundingBoxDescent || 0);

    const off_x = (width * offX) / 100;
    const off_y = (height * offY) / 100;

    ctx.fillText(watermarkText, off_x, off_y);

    const output = canvas.toDataURL("image/png");
    setImage(output);

    props.setFile?.(dataURLtoFile(output, "textwatermark.png"));
  }, [
    width,
    height,
    watermarkText,
    offX,
    offY,
    fontSize,
    background,
    foreground,
  ]);

  const handleOffXChange = (_: Event, newValue: number | number[]) => {
    setOffX(newValue as number);
  };

  const handleOffYChange = (_: Event, newValue: number | number[]) => {
    setOffY(newValue as number);
  };

  return (
    <Grid container columns={2} columnSpacing={2}>
      <Stack spacing={1} justifyContent="center">
        <InputLabel shrink htmlFor="watermark-text">
          Text
        </InputLabel>
        <Input
          value={watermarkText}
          type="text"
          id="watermark-text"
          onChange={(e) => setWatermarkText(e.target.value)}
        />

        <InputLabel shrink htmlFor="watermark-fontsize">
          Font Size
        </InputLabel>
        <Input
          value={fontSize}
          type="number"
          id="watermark-fontsize"
          onChange={(e) => setFontSize(parseInt(e.target.value))}
        />

        <InputLabel shrink htmlFor="watermark-width">
          Width
        </InputLabel>
        <Input
          value={width}
          type="number"
          id="watermark-width"
          onChange={(e) => setWidth(parseInt(e.target.value))}
        />

        <InputLabel shrink htmlFor="watermark-height">
          Height
        </InputLabel>
        <Input
          value={height}
          type="number"
          id="watermark-height"
          onChange={(e) => setHeight(parseInt(e.target.value))}
        />

        <Stack justifyContent="center" direction="row" spacing={2}>
          <InputLabel htmlFor="watermark-bg">Background</InputLabel>
          <Input
            sx={{ width: 20 }}
            value={background}
            type="color"
            id="watermark-bg"
            onChange={(e) => setBackground(e.target.value)}
          />
        </Stack>

        <Stack justifyContent="center" direction="row" spacing={2}>
          <InputLabel htmlFor="watermark-fg">Foreground</InputLabel>
          <Input
            sx={{ width: 20 }}
            value={foreground}
            type="color"
            id="watermark-fg"
            onChange={(e) => setForeground(e.target.value)}
          />
        </Stack>

        <InputLabel htmlFor="watermark-xoff">X Offset</InputLabel>
        <Slider
          id="watermark-xoff"
          value={offX}
          min={0}
          max={100}
          onChange={handleOffXChange}
        />

        <InputLabel htmlFor="watermark-yoff">Y Offset</InputLabel>
        <Slider
          id="watermark-yoff"
          value={offY}
          min={0}
          max={100}
          onChange={handleOffYChange}
        />
      </Stack>

      <Grid>
        <InputLabel shrink>Preview</InputLabel>
        <ImageCanvas imageData={image} />
      </Grid>
    </Grid>
  );
}

/**
 * This is the component that allows only uploading an image as watermark,
 * or placing a text in a watermark.
 */
function BasicWatermarkCreator() {
  const [type, setType] = React.useState(0);
  const [filename, setFileName] = React.useState("");
  const [file, setFile] = React.useState<File | undefined>(undefined);
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  const nav = useNavigate();

  const handleUploadWatermark = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const endpoint = EnvironmentManager.Instance.endpoint("/api/watermark");
    const formData = new FormData();
    formData.append("file", file!, file?.name);
    axios
      .post(endpoint.href, formData, {
        headers: {
          Authorization: auth.token!,
        },
      })
      .then((response) => {
        const redirect = searchParams.get("redirect");
        if (response.status == 200 && redirect != undefined) {
          nav(redirect);
        }
      });
  };

  return (
    <Stack
      spacing={1}
      mt={4}
      alignItems="center"
      justifyContent="center"
      component={"form"}
      onSubmit={(e) => handleUploadWatermark(e)}
    >
      <FormControl fullWidth>
        <InputLabel id="select-watermark-kind-label">Type</InputLabel>
        <Select
          labelId="select-watermark-kind-label"
          id="select-watermark-kind"
          value={type}
          label="Type"
          onChange={(e) => setType(e.target.value)}
        >
          <MenuItem value={0}>Image</MenuItem>
          <MenuItem value={1}>Text</MenuItem>
        </Select>
      </FormControl>

      {type == 0 && <ImageUploader file={file} setFile={setFile} />}

      {type == 1 && <BasicTextWatermark file={file} setFile={setFile} />}
      <Button sx={{ maxWidth: 300 }} variant="contained" type="submit">
        Save
      </Button>
    </Stack>
  );
}

export default function WatermarkCreator() {
  return (
    <div className="flex justify-center">
      <BasicWatermarkCreator />
    </div>
  );
}
