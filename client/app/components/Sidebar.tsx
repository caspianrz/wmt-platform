import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import routes from "~/routes";

const drawerWidth = 240;
const HIDDEN_ROUTES = ["/login", "/watermarking", "/analyze"];

export default function Sidebar({ title }: { title: string }) {
  const location = useLocation();
  const [open, setOpen] = useState(false); // default بسته

  const toggleDrawer = () => setOpen(!open);

  const visibleRoutes = routes.filter((r) => {
    const path = r.path ?? "/";
    return !HIDDEN_ROUTES.includes(path);
  });

  return (
    <>
      {/* دکمه باز کردن sidebar */}
      <IconButton
        onClick={toggleDrawer}
        sx={{
          position: "fixed",
          top: open ? 16 : 16,
          left: open ? 150 : 16,
          zIndex: 1300,
        }}
      >
        <Menu />
      </IconButton>

      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: open ? drawerWidth : 56,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : 56,
            overflowX: "hidden",
            transition: "width 0.3s",
          },
        }}
      >
        <Toolbar>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
        <Box sx={{ overflow: "auto" }}>
          <List>
            {visibleRoutes.map((r) => {
              const path = r.path ?? "/";
              const label = path.replace("/", "") || "Home";

              return (
                <ListItemButton
                  key={path}
                  component={Link}
                  to={path}
                  selected={location.pathname === path}
                  onClick={() => setOpen(false)} // بعد کلیک ببنده
                >
                  <ListItemText primary={label} />
                </ListItemButton>
              );
            })}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
