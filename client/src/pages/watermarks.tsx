import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Typography,
  Box,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import EnvironmentManager from "../models/EnvironmentManager";
import { useAuth } from "../providers/AuthProvider";
import CircularProgress from '@mui/material/CircularProgress';

interface WatermarkPreviewData {
  id: string;
  url: string;
}

export default function WatermarksPage() {

  const [loading, setLoading] = useState(false);

  const auth = useAuth();
  const [watermarks, setWatermarks] = useState<WatermarkPreviewData[]>([]);

  const deleteWatermark = (id: string) => {
    const endpoint = EnvironmentManager.Instance.endpoint("/api/watermark");
    axios
      .delete(endpoint.href, {
        headers: {
          Authorization: auth.token,
        },
        data: {
          id: id,
        },
      })
      .then((_: any) => {
        setWatermarks(
          watermarks.filter((wm) => {
            return wm.id != id;
          })
        );
      });
  };

  useEffect(() => {
    const endpoint = EnvironmentManager.Instance.endpoint("/api/watermark");
    setLoading(true)
    axios
      .get(endpoint.href, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((res: any) => {
        if (res.status == 200) {
          const wd: WatermarkPreviewData[] = res.data.map((d: any) => {
            return {
              id: d._id,
              url: EnvironmentManager.Instance.endpoint(`/api/${d.path}`),
            };
          });
          setWatermarks(wd);
          setLoading(false)
        }
      });
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {
        loading &&
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'fixed', opacity: 0.9, top: "0", zIndex: 1000, width: '100%', height: '100vh', backgroundColor: '#EFECE3' }}>
          <CircularProgress />
        </Box>
      }
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {watermarks.length > 0 ? (
          <Grid
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {watermarks.map((wm) => (
              <Grid key={wm.id}>
                <Card>
                  <CardMedia
                    component="img"
                    image={wm.url}
                    alt={wm.id}
                    sx={{ height: 256, objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="subtitle1">{wm.id}</Typography>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => deleteWatermark(wm.id)}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid sx={{ position: "absolute", top: '50%', left: '50%', transform: "translate(-50%, -50%)", display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Grid sx={{ width: '250px', height: '250px' }}>
              <img src="./assets/svg/not-found.svg" alt="" style={{ width: '100%', height: '100%' }} />
            </Grid>
            <Typography variant="h5" fontWeight={700} color="warning">No watermarks yet.</Typography>
          </Grid>
        )}
      </Container>
    </Box>
  );
}
