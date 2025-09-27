import type { Route } from "./+types/assets";

import React from "react";
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
} from "@mui/material";

export function meta({ }: Route.MetaArgs) {
	return [
		{ title: "Assets" },
		{ name: "description", content: "Assets List." },
	];
}

export default function Assets() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Watermarks Section */}
      <Typography variant="h5" gutterBottom>
        Your Watermarks
      </Typography>
      <Grid container spacing={2} mb={4}>
        {[1, 2, 3].map((id) => (
          <Grid  key={`wm-${id}`}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">Watermark {id}</Typography>
                <Box
                  sx={{
                    width: "100%",
                    height: 120,
                    backgroundColor: "grey.200",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="body2">Preview</Typography>
                </Box>
              </CardContent>
              <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small">Delete</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Uploaded Images Section */}
      <Typography variant="h5" gutterBottom>
        Uploaded Images
      </Typography>
      <Grid container spacing={2}>
        {[1, 2, 3, 4].map((id) => (
          <Grid key={`img-${id}`}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={`https://picsum.photos/200/200?random=${id}`}
                alt={`Uploaded ${id}`}
              />
              <CardContent>
                <Typography variant="subtitle2">Image {id}</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Add Filter</Button>
                <Button size="small">Use Watermark</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
