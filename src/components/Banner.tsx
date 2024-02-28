import { Box } from "@mui/material";

const Banner = (props: any) => {
  return (
    <Box className="banner" sx={{ height: { lg: "40vh", xs: "auto" } }}>
      <Box
        component="img"
        src={props.image}
        sx={{ height: { lg: "100%", xs: "250px" } }}
      />
    </Box>
  );
};

export default Banner;
