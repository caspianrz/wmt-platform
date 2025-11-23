import { Box } from "@mui/material";
import AuthenticationForm from "../components/AuthenticationForm";

export default function Login() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Box>
        <AuthenticationForm />
      </Box>
    </div>
  );
}
