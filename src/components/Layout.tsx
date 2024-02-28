import { Box } from "@mui/material";
import Navbar from "./Navbar";

const Layout = (props: any) => {
  return (
    <Box className="layoutMain">
      <Box className="navbarMain">
        <Navbar />
      </Box>
      <Box className="layoutContentMain" sx={{ m: "0 auto" }}>
        {props.children}
      </Box>
    </Box>
  );
};

export default Layout;
