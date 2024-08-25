import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
import { loginUser, registerUser, clearMessage } from "./userSlice"; 
import { RootState } from "../app/store"; 
// import { throttle } from "lodash"

interface LoginRegisterProps {
  title: string;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ title }) => {
  const [board_user, setBoardUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { message, status } = useSelector((state: RootState) => state.user);

  

// const throttledNavigate = throttle(navigate, 1000);

useEffect(() => {
  if (status === "succeeded") {
    if (title === "Login") {
      navigate("/whiteboard");
    } else if (title === "Register") {
      navigate("/login");
    }
  }
}, [status, title, navigate]);

  const handleSubmit = () => {
    if (title === "Login") {
      dispatch(loginUser({ board_user, password }));
    } else {
      dispatch(registerUser({ board_user, password }));
    }
  };

  // Optionally clear the message on component mount
  useEffect(() => {
    dispatch(clearMessage());
  }, [dispatch]);

  return (
    <>
      <h2>{title}</h2>
      <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete="off">
        <TextField
          sx={{ m: 1 }}
          id="board_user"
          type="text"
          label="Enter username..."
          variant="outlined"
          onChange={(e) => setBoardUser(e.target.value)}
        />

        <TextField
          sx={{ m: 1 }}
          id="password"
          type="password"
          label="Enter password..."
          variant="outlined"
          onChange={(e) => setPassword(e.target.value)}
        />
      </Box>
      <Button variant="contained" onClick={handleSubmit} disabled={status === "loading"}>
        {title}
      </Button>
      <div>{message}</div>
    </>
  );
};

export default LoginRegister;
