import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Slider,
  Stack,
} from "@mui/material";
import { useParams } from "react-router";
import { useEffect, useState } from "react";
import EnvironmentManager from "../models/EnvironmentManager";
import { useAuth } from "..//providers/AuthProvider";

export default function AnalyzePage() {
  const { kind, uuid } = useParams();
  const auth = useAuth();

  const [watermarkedImage, setWatermarkdImage] = useState<string | undefined>(
    undefined
  );
  const [exWat, setExWat] = useState<string | undefined>(undefined);
  useEffect(() => {
    if (auth.user != null) {
      const actual = EnvironmentManager.Instance.endpoint(
        `/api/uploads/${auth.user}/watermarked/${uuid}/${kind}-0`
      ).href;
      setWatermarkdImage(actual);
      const extracted = EnvironmentManager.Instance.endpoint(
        `/api/uploads/${auth.user}/watermarked/${uuid}/out`
      ).href;
      setExWat(extracted);
    }
  }, [auth.user]);

  // const extractedWatermark = EnvironmentManager.Instance.endpoint(`/api/uploads/watermarked/${uuid}/out-0`).href;

  // filter settings
  const [blur, setBlur] = useState(0);
  const [scale, setScale] = useState(1);

  // placeholder metrics
  const analysis = {
    psnr: 38.5,
    ssim: 0.92,
    mse: 0.0012,
  };

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top 3-column layout */}
        <Grid container spacing={2} sx={{ flex: 1, p: 2 }}>
          {/* Left: watermarked image */}
          <Grid sx={{ flex: 2 }}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                image={watermarkedImage}
                alt="Watermarked Image"
                sx={{
                  flex: 1,
                  objectFit: "contain",
                  filter: `blur(${blur}px) scale(${scale})`,
                }}
              />
              <CardContent>
                <Typography variant="subtitle1">Watermarked Image</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Middle: extracted watermark */}
          <Grid sx={{ flex: 2 }}>
            <Card
              sx={{ height: "100%", display: "flex", flexDirection: "column" }}
            >
              <CardMedia
                component="img"
                image={exWat}
                alt="Extracted Watermark"
                sx={{ flex: 1, objectFit: "contain" }}
              />
              <CardContent>
                <Typography variant="subtitle1">Extracted Watermark</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Right: filter controls */}
          <Grid sx={{ flex: 3 }}>
            <Card sx={{ height: "100%", p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Filters
              </Typography>
              <Stack spacing={3}>
                {/* Blur filter */}
                <Box>
                  <Typography variant="body2">Blur</Typography>
                  <Slider
                    value={blur}
                    onChange={(_: any, v: any) => setBlur(v as number)}
                    min={0}
                    max={10}
                    step={0.5}
                  />
                </Box>

                {/* Scale filter */}
                <Box>
                  <Typography variant="body2">Scale</Typography>
                  <Slider
                    value={scale}
                    onChange={(_: any, v: any) => setScale(v as number)}
                    min={0.5}
                    max={2}
                    step={0.1}
                  />
                </Box>

                <Button variant="contained" color="primary">
                  Apply Filters
                </Button>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        {/* Bottom analysis results */}
        <Box
          sx={{
            borderTop: "1px solid #444",
            p: 2,
            bgcolor: "background.paper",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Analysis Results
          </Typography>
          <Typography>PSNR: {analysis.psnr} dB</Typography>
          <Typography>SSIM: {analysis.ssim}</Typography>
          <Typography>MSE: {analysis.mse}</Typography>
        </Box>
      </Box>
    </Box>
  );
}
