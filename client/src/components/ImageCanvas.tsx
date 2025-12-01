import { useEffect, useRef } from "react";
import { Card } from "@mui/material";
import { cpSync } from "fs";

interface ImageCanvasProps {
  imageData: string | null;
  width?: number;
  height?: number;
  useCanvas?: boolean;
}

export function ImageCanvas({
  imageData,
  width = 0,
  height = 0,
  useCanvas = true,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (imageData && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height
        );
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;

        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;
        console.log(
          x,
          y,
          scaledWidth,
          scaledHeight,
          canvas.width,
          canvas.height,
          img.width,
          img.height
        );
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
      };
      img.src = imageData;
    }
  }, [imageData, width, height]); // ← اینجا مهمه

  return (
    <Card
      style={{
        width: width,
        maxWidth: "500px",
        minWidth: "500px",
        overflow: "auto",
      }}
    >
      {useCanvas && <canvas ref={canvasRef} width={width} height={height} />}
      {!useCanvas && imageData != null && <img src={imageData} />}
    </Card>
  );
}
