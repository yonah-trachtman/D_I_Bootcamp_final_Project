import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";

// Define the props type (if props are needed)
interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  return (
    <Stack spacing={2} direction={"row"}>
      <Button component={Link} to="/">
        Login
      </Button>
      <Button component={Link} to="/register">
        Register
      </Button>
    </Stack>
  );
};

export default Header;