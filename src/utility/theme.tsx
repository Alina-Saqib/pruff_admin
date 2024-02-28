import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    button: {
      fontWeight: "600",
      textTransform: "capitalize",
    },
    h2: {
      fontSize: "24px",
      fontWeight: "600",
      color: "white",
    },
    h3: {
      fontSize: "20px",
      fontWeight: "500",
    },
  },
  palette: {
    text: {},
  },
});
