import {
  Box,
  Grid,
  Typography,
  Card,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogContent,
  DialogTitle,
  ImageList,
  ImageListItem,
  Skeleton,
} from "@mui/material";
import axios from "axios";

import { sha512 } from "js-sha512";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import EnvironmentManager from "../models/EnvironmentManager";
import { useAuth } from "../providers/AuthProvider";

interface Watermark {
  id: string;
  url: string;
}

interface StrategyDataExtras {
  kind: string;
  pos: number[];
  name?: string;
  value_range?: { min: number; max: number };
}

interface StrategyData {
  name: string;
  kind: string[];
  watermarking: {
    argc: number;
    input: {
      kind: string;
      pos: number[];
    };
    watermark: {
      kind: string;
      pos: number[];
    };
    output: {
      kind: string;
      pos: number[];
    };
    extra: StrategyDataExtras[];
  };
  unwatermarking: {
    argc: 3;
    image: {
      kind: string;
      pos: number[];
    };
    output: {
      kind: string;
      pos: number[];
    };
    extra: StrategyDataExtras[];
  };
}

function WatermarkList({
  watermarks,
  onSelect,
}: {
  watermarks: Watermark[];
  onSelect: (id: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const { uuid } = useParams();

  return (
    <Box
      sx={{
        overflowY: "auto",
        border: "1px solid #ccc",
        borderRadius: 2,
        p: 1,
        scrollbarColor: "#555 #1e1e2e",
        scrollbarWidth: "thin",
      }}
    >
      {watermarks.length > 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            Select a Watermark
          </Typography>

          <ImageList
            variant="masonry"
            sx={{
              // display: "flex",
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              flexWrap: "wrap",
              // height: "80vh",
              overflowY: "scroll",

            }}
          >
            {watermarks.map((wm) => (
              <ImageListItem
                key={wm.id}
                onClick={() => {
                  setSelected(wm.id);
                  onSelect(wm.id);
                }}
                sx={{
                  cusor: "pointer",
                  border:
                    selected === wm.id
                      ? "2px solid #1976d2"
                      : "2px solid transparent",
                  borderRadius: 1,
                  transition: "border 0.2s",
                  maxWidth: 512,
                }}
              >
                <img src={wm.url} alt={wm.id} style={{ objectFit: "cover" }} />
              </ImageListItem>
            ))}
          </ImageList>
        </Box>
      )}
      <Box sx={{ marginTop: "auto" }}>
        <Button href={`/watermark?redirect=/watermarking/${uuid}`}>
          Upload Watermark
        </Button>
      </Box>
    </Box>
  );
}

export default function WatermarkingPage() {
  const [selectedImage, setSelectedImage] = useState("");
  const [strategies, setStrategies] = useState<string[]>([]);
  const [strategyData, setStrategyData] = useState<Map<string, StrategyData>>(
    new Map()
  );

  // Placeholder watermarks
  const [watermarks, setWatermarks] = useState<Watermark[]>([]);
  const { uuid } = useParams();
  const auth = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedWatermark, setSelectedWatermark] = useState<Watermark>(
    watermarks[0]
  );
  const [watermarkedid, setWatermarkedid] = useState<string | undefined>(
    undefined
  );

  const selectWatermark = (id: string) => {
    let i = 0;
    for (i = 0; i < watermarks.length; i++) {
      if (watermarks[i].id == id) {
        setSelectedWatermark(watermarks[i]);
        break;
      }
    }
  };

  const populateWatermarks = () => {
    const endpoint = EnvironmentManager.Instance.endpoint("/api/watermark");
    axios
      .get(endpoint.href, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((res: any) => {
        if (res.status == 200) {
          const wd: Watermark[] = res.data.map((d: any) => {
            return {
              id: d._id,
              url: EnvironmentManager.Instance.endpoint(`/api/${d.path}`),
            };
          });
          setWatermarks(wd);
        }
      });
  };

  const populateStrategies = () => {
    const endpoint = EnvironmentManager.Instance.endpoint("/api/strategy");

    axios
      .get(endpoint.href, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((response: any) => {
        if (response.status == 200) {
          setStrategies(response.data);
          setStrategyData(new Map());
          response.data.forEach((strategy: string) => {
            axios
              .get(
                EnvironmentManager.Instance.endpoint(
                  `/api/strategy/${strategy}`
                ).href,
                {
                  headers: {
                    Authorization: auth.token,
                  },
                }
              )
              .then((response: any) => {
                console.log(response);
                if (response.status == 200) {
                  setStrategyData(strategyData.set(strategy, response.data));
                }
              });
          });
        }
      });
  };

  useEffect(() => {
    populateWatermarks();
    populateStrategies();
  }, []);

  useEffect(() => {
    setSelectedImage(
      EnvironmentManager.Instance.endpoint(
        `/api/uploads/${auth.user}/assets/${uuid}`
      ).href
    );
  });

  const [selectedStrategy, setSelectedStrategy] = useState<null | string>(null);
  const [watermarkedImageReady, setWatermarkedImageReady] = useState(false);
  const [watermarkedImage, setWatermarkedImage] = useState<string | null>(null);

  const queueImageForWatermarking = () => {
    const sData = strategyData.get(selectedStrategy!);
    if (sData == null) {
      return;
    }

    let request = {
      strategy: selectedStrategy,
      image: uuid,
      watermark: selectedWatermark.id,
    };

    if (sData.watermarking.input.kind == "path") {
      request.image = uuid;
    }

    if (sData.watermarking.watermark.kind == "path") {
      request.watermark = selectedWatermark.id;
    }

    const endpoint = EnvironmentManager.Instance.endpoint(`/api/apply`);

    axios
      .post(
        endpoint.href,
        {
          data: request,
          sha512: sha512(JSON.stringify(request)),
        },
        {
          headers: {
            Authorization: auth.token,
          },
        }
      )
      .then((res: any) => {
        if (res.status == 200) {
          const watermarkedEP = EnvironmentManager.Instance.endpoint(
            `/api/${res.data.outputs[0]}`
          );
          setWatermarkedImageReady(true);
          setWatermarkedImage(watermarkedEP.href);
          setWatermarkedid(res.data.id);
        }
      });
  };

  return (
    <Box>
      <Grid sx={{ display: 'flex' , flexWrap:{xs:"wrap" ,  lg:'nowrap'}, alignItems: 'flex-start', gap: '16px' }}>
        <Grid
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            // m: 1,
            marginTop: '0px',
            width: {
              xs: '100%',
              md: '25%'
            }
          }}
        >
          <Typography variant="h6" gutterBottom>
            Selected Image
          </Typography>
          <Card sx={{ maxWidth: "100%" }}>
            {selectedImage == null && (
              <Skeleton variant="rectangular" width={256} height={256} />
            )}
            {selectedImage != null && (
              <CardMedia
                component="img"
                sx={{ height: 256 }}
                image={selectedImage}
                alt="Selected user image"
              />
            )}
          </Card>
        </Grid>

        <Grid
          sx={{
            width: {
              xs: '100%',
              md: '50%'
            }
          }}
        >
          <WatermarkList
            watermarks={watermarks}
            onSelect={(id) => selectWatermark(id)}
          />
        </Grid>

        {/* Right column: strategies + options */}
        <Grid
          sx={{
            border: "1px solid #ccc",
            borderRadius: 2,
            p: 2,
            // m: 1,
            marginTop: '0px',
            width: {
              xs: '100%',
              md: '25%'
            }
          }}
        >
          <Typography variant="h6" gutterBottom>
            Watermarking Strategy
          </Typography>
          <List>
            {strategies.map((s: string) => (
              <ListItem key={s} disablePadding>
                <ListItemButton
                  onClick={() => setSelectedStrategy(s)}
                  selected={selectedStrategy == s}
                >
                  <ListItemText primary={strategyData.get(s)?.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              setOpen(true);
              queueImageForWatermarking();
            }}
          >
            Apply Watermark
          </Button>
        </Grid>
      </Grid>

      {/* Overlay for watermarked result */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Watermarked Image</DialogTitle>
        <DialogContent>
          <Card>
            <Box display="flex" justifyContent="center">
              {!watermarkedImageReady && (
                <Skeleton variant="rectangular" width={512} height={512} />
              )}
              {watermarkedImageReady && (
                <CardMedia
                  component="img"
                  image={`${watermarkedImage}`}
                  alt="Watermarked result"
                />
              )}
            </Box>
          </Card>
          <Box mt={2} display="flex" gap={2}>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Close
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                if (watermarkedid != undefined) {
                  nav(`/analyze/raw/${watermarkedid}`);
                }
              }}
            >
              Go to Analysis
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
