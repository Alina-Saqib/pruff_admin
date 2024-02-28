import React from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  Typography,
 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
// import { adminLogin } from "../../api_calls/LoginApi";

const initialState = {
  email: "",
  password: "",
};
const Login = ({handleLogin}: any) => {
  const [formValues, setFormValues] = React.useState(initialState);
  const navigate = useNavigate();



  const changeHandler = (e: any) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitHandler = async (e: any) => {
    e.preventDefault();
    if (
      formValues.email === "admin@pruuf.pro" &&
      formValues.password === "admin"
    ) {
      // Authentication successful
      localStorage.setItem('isAdminAuthenticated', 'true');
      handleLogin()
      navigate('/');
    } else {
      toast.error('Invalid credentials');
    }
    // const data = {
    //   email: formValues.email,
    //   password: formValues.password,
    //   role: "user",
    // };
    // adminLogin(data)
    //   .then((response: any) => {
    //     console.log(response)
    //     const token = localStorage.getItem('userToken')
    //     if(token)
    //    { navigate('/contact')
    //    console.log(token)
    // }else
    //   { toast.error('Invalid credentials')}
  
    //   })
    //   .catch((err: any) => {
    //     return toast.error(err.response?.message);
        
    //   });
  
  };

  

  return (
    <Box
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      minHeight: { lg: "100vh", xs: "95vh" },
      flexDirection: { lg: "column", xs: "column" },
      maxWidth: { lg: "inherit", xs: "90%" },
      gap: "20px",
      m: { xs: "0 auto", lg: "20px 0px" },
    }}
  >
   
    <Box className="authImage">
      <Typography
        sx={{ color: "white", fontSize: "40px", fontWeight: "900" }}
      >
        PRUUF.pro
      </Typography>
    </Box>
    <Box
      sx={{
        maxWidth: { lg: "40%", xs: "100%" },
        m: { lg: "0 auto", xs: "40px auto" },
        minHeight: { lg: "auto", xs: "auto" },
        display: { lg: "inherit", xs: "flex" },
        alignItems: { lg: "inherit", xs: "center" },
        justifyContent: { lg: "inherit", xs: "center" },
        flexDirection: { lg: "inherit", xs: "column" },
        background: "#e5e5e5",
        borderRadius: "10px",
      }}
    >
      {/* <Banner image={BannerImage} /> */}
      <Box sx={{ p: "30px 20px" }}>
        <Box component="form" onSubmit={onSubmitHandler}>
          <Typography
            variant="h2"
            sx={{ textAlign: "center", marginBottom: "20px", color: "black" }}
          >
            Admin Login
          </Typography>
          <Grid
            container
            sx={{
              rowGap: "15px",
            }}
          >
            <Grid item xs={12}>
              <TextField
                label="Email"
                type="email"
                name="email"
                value={formValues.email}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Password"
                name="password"
                value={formValues.password}
                onChange={changeHandler}
                fullWidth
                required
              />
            </Grid>
         

            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Button variant="contained" size="large" type="submit">
                Submit
              </Button>
            </Grid>
          </Grid>
        </Box>

        {/* <Box sx={{ textAlign: "center", m: "10px 0px" }}>
          <Link
            to="/forgot-password/provider"
            style={{ color: "#1b9ad1", fontWeight: "600" }}
          >
            Forgot Password
          </Link>
        </Box> */}
        
      </Box>
    </Box>
  </Box>
  );
};

export default Login;
