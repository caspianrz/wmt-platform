import {
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import { useEffect, useState } from "react";
import { ImageUploader } from "../components/ImageUploader";
import EnvironmentManager from "../models/EnvironmentManager";
import axios, { type AxiosResponse } from "axios";
import { useAuth } from "../providers/AuthProvider";
import { useNavigate } from "react-router";
import api from "../axios_config";
import toast from "react-hot-toast";

export default function Assets() {
  const auth = useAuth();
  const nav = useNavigate();


  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | undefined>(undefined);


  useEffect(() => {
    const loadImages = async () => {
      const endpoint = EnvironmentManager.Instance.endpoint("/api/upload/");

      try {
        const res = await api.get(endpoint.href);
        setImages(res.data);
        if (res.data.length === 0) {
          toast.error("Images not exist!");
        } else {
          toast.success("Images loaded successfully!");
        }
      } catch (error) {
        toast.error("Failed to load images!");
      }
    };

    loadImages();
  }, []);



  useEffect(() => { }, [images]);

  const handleUpload = () => {
    if (!file) return;
    const endpoint = EnvironmentManager.Instance.endpoint("/api/upload");
    const form = new FormData();
    form.append("file", file);
    axios
      .post(endpoint.href, form, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((res: AxiosResponse) => {
        setImages(images.concat([{ id: res.data.id, url: res.data.url }]));
        setFile(undefined);
        setOpen(false);
      });
  };

  const handleDelete = (id: string) => {
    const endpoint = EnvironmentManager.Instance.endpoint(`/api/upload/${id}`);
    axios
      .delete(endpoint.href, {
        headers: { Authorization: auth.token },
      })
      .then(() => {
        setImages(
          images.filter((d) => {
            return d.id != id;
          })
        );
      });
  };

  const handleAddWatermark = (id: string) => {
    nav(`/watermarking/${id}`);
  };


  console.log(images, 'images')

  return (
    <Box sx={{position:'relative'}}>
      {
        images.length === 0 ?
          <Grid sx={{position:"absolute" , top:'50%' , right:'50%' , }}>
            <Typography variant="h6" color="primary">Assets Not Exist</Typography>
          </Grid>
          :
          <Box>
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <Grid container justifyContent="center" spacing={2}>
                {images.map((i) => (
                  <Grid key={`img-${i.id}`}>
                    <Card>
                      <CardMedia
                        component="img"
                        image={`${EnvironmentManager.Instance.endpoint("/api/" + i.url).href
                          }`}
                        alt={`Uploaded ${i.id}`}
                        sx={{ height: 256, objectFit: "cover" }}
                      />
                      <CardContent>
                        <Typography variant="subtitle2">Image {i.id}</Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => handleAddWatermark(i.id)}>
                          Add Watermark
                        </Button>
                        <Button
                          color="error"
                          size="small"
                          onClick={() => handleDelete(i.id)}
                        >
                          Delete Image
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Container>
          </Box>
      }
      <Fab
        color="primary"
        aria-label="upload"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => setOpen(true)}
      >
        <AddIcon />
      </Fab>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Upload Image</DialogTitle>
        <DialogContent>
          <ImageUploader file={file} setFile={setFile} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleUpload} variant="contained" disabled={!file}>
            Upload
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
