import type { Route } from "./+types/watermark";
import { Box } from "@mui/material";
import WatermarkCreator from "@component/WatermarkCreator";
import Sidebar from "~/components/Sidebar";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Upload Endpoint Tests" },
    { name: "description", content: "Uploading Tests" },
  ];
}

export default function Watermark() {
  return (
    <Box>
     

      <WatermarkCreator />
    </Box>
  );
}
