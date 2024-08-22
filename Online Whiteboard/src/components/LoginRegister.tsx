// import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";

interface LoginRegisterProps {
  title: string;
}

const LoginRegister: React.FC<LoginRegisterProps> = ({ title } ) => {
  const [user, setUser] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const navigate = useNavigate()

  // const loginregister = async () => {
  //   if (title === "Login") {
  //     try {
  //       const response = await axios.post(
  //         "http://localhost:5000/user/login",
  //         { email, password },
  //         { withCredentials: true }
  //       );

  //       if (response.status === 200) {
  //         setMessage(response.data.message);
  //         console.log(response.data);
  //         navigate('/')
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       setMessage(error.response.data.message);
  //     }
  //   }
  //   else{
  //       try {
  //           const response = await axios.post(
  //             "http://localhost:5000/user/register",
  //             { email, password },
  //             { withCredentials: true }
  //           );
    
  //           if (response.status === 201) {
  //             setMessage(response.data.message);
  //             console.log(response.data);
  //             // context
  //             navigate('/login')
  //           }
  //           else if(response.status === 200 ){
  //               setMessage(response.data.message);
  //             console.log(response.data);
  //           }
  //         } catch (error) {
  //           console.log(error);
  //           setMessage(error.response.data.message);
  //         }
  //   }
  // };

  const loginregister = (): void => {
    if (user === "J" && password === "me") {
      navigate("/whiteboard");
    } else {
      setMessage("failed login");
    }
  };

  return (
    <>
      <h2>{title}</h2>
      <Box component={"form"} sx={{ m: 1 }} noValidate autoComplete="off">
        <TextField
          sx={{ m: 1 }}
          id="user"
          type="text"
          label="Enter user..."
          variant="outlined"
          onChange={(e) => setUser(e.target.value)}
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
      <Button variant="contained" onClick={loginregister}>
        {title}
      </Button>
      <div>{message}</div>
    </>
  );
};

export default LoginRegister;
