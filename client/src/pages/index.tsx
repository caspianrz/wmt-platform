import { Box, Typography } from "@mui/material";
import axios from "axios";
import { useAuth } from "../providers/AuthProvider";
import { useEffect } from "react";
import EnvironmentManager from "..//models/EnvironmentManager";

export default function Index() {
  const auth = useAuth();

  useEffect(() => {
    axios
      .get(EnvironmentManager.Instance.endpoint("/api/strategy").href, {
        headers: {
          Authorization: auth.token,
        },
      })
      .then((res: any) => {
        (res.data as string[]).forEach((strategy) => {
          axios
            .get(
              EnvironmentManager.Instance.endpoint(`/api/strategy/${strategy}`)
                .href,
              {
                headers: {
                  Authorization: auth.token,
                },
              }
            )
            .then((s: any) => {
              console.log(s);
            });
        });
      });
  });

  return (
    <Box>
      <Box className="flex items-center justify-center" alignContent="center">
        <Typography variant="h1">Home</Typography>
      </Box>
    </Box>
  );
}
