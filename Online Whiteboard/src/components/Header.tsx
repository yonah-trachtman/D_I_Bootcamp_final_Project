import React from "react";
import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import { logoutUser } from "./userSlice";

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((state: RootState) => state.user);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <Stack spacing={2} direction={"row"}>
      {status === "succeeded" ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <>
          <Button component={Link} to="/login">
            Login
          </Button>
          <Button component={Link} to="/register">
            Register
          </Button>
        </>
      )}
    </Stack>
  );
};

export default Header;