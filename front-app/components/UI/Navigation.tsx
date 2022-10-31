import { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Typography from "@mui/material/Typography";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SearchIcon from "@mui/icons-material/Search";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import Box from "@mui/material/Box";

const Navigation = () => {
  const [drawer, setDrawer] = useState(false);

  const drawerOpen = () => {
    setDrawer(true);
  };

  const drawerClose = () => {
    setDrawer(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={drawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6">Crud App</Typography>
        </Toolbar>
      </AppBar>
      <Drawer variant="temporary" open={drawer} onClose={drawerClose}>
        <Box sx={{ width: 250 }} role="presentation">
          <List>
            <ListItem disablePadding>
              <ListItemIcon>
                <SearchIcon />
              </ListItemIcon>
              <Link href={"/"}>
                <a>
                  <ListItemText primary="検索" />
                </a>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <ListItemIcon>
                <AppRegistrationIcon />
              </ListItemIcon>
              <Link href={"/register"}>
                <a>
                  <ListItemText primary="登録" />
                </a>
              </Link>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navigation;
