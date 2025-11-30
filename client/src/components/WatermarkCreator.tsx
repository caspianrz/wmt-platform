import {
  Button,
  Card,
  CardContent,
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
import toast from "react-hot-toast";
import api from "../axios_config";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ClearIcon from "@mui/icons-material/Clear";

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
    <Grid sx={{display:'flex' , alignItems:'flex-start' , gap:'16px' , flexDirection: { xs: 'column', md: 'row' },}}
    >
      <Stack sx={{width:{xs:'100%' , md:'50%'}}} spacing={1} justifyContent="center">
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

      <Grid sx={{width:{xs:'100%' , md:'50%'}}}>
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


  const handleUploadWatermark = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const endpoint = EnvironmentManager.Instance.endpoint("/api/watermark");
    const formData = new FormData();
    formData.append("file", file!, file?.name);

    try {
      const response = await api.post(endpoint.href, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: auth.token!,
        },
      });

      toast.success("Watermark uploaded successfully!");
      setFile(undefined);
      setFileName("");

      const redirect = searchParams.get("redirect");
      if (response.status == 200 && redirect != undefined) {
        nav(redirect);
      }
    } catch (error: any) {
      // ❗️Do NOT show toast here — interceptor already shows it.
      console.error("Upload failed:", error);
    }
  };


  const handleClearWatermark = () => {
    setFile(undefined);
    setFileName("");
    toast.success("Watermark cleared!");
  }


  return (
    <Card sx={{ width: "100%", maxWidth: 800, mt: 4, mb: 4, borderRadius: 4, boxShadow: 6, margin: '48px auto' }}>
      <CardContent>
        <Stack
          spacing={1}
          mt={4}
          alignItems="center"
          justifyContent="center"
          component={"form"}
          onSubmit={(e) => handleUploadWatermark(e)}
        >
          <FormControl style={{marginBottom:'24px'}} fullWidth>
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
          <Grid style={{marginTop:'24px'}} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', width: "100%" }}>
            <Button disabled={!file} sx={{ width: '100%', maxWidth: 200, fontSize: "14px", padding: '8px 0px', margin: "16px 0px" }} variant="contained" color="success" type="submit" startIcon={<SaveOutlinedIcon />}>
              Save
            </Button>
            <Button
              onClick={handleClearWatermark}
              sx={{ width: '100%', maxWidth: 200, fontSize: "14px", padding: '8px 0px', margin: "16px 0px", display: file && type == 0 ? 'flex' : 'none' }} variant="contained" color="error" type="button" startIcon={<ClearIcon />}>
              Clear
            </Button>
          </Grid>
        </Stack>
      </CardContent>
    </Card>

  );
}

export default function WatermarkCreator() {
  return (
    <div className="flex justify-center">
      <BasicWatermarkCreator />
    </div>
  );
}
