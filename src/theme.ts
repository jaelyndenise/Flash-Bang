import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light", // Change to 'dark' for dark mode
    primary: {
      main: "#4f46e5", // Indigo-600
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#f43f5e", // Rose-500
      contrastText: "#ffffff",
    },
    background: {
      default: "#f9fafb", // Light gray
      paper: "#ffffff",
    },
    text: {
      primary: "#111827", // Dark gray
      secondary: "#6b7280", // Medium gray
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    button: {
      textTransform: "none", // Modern buttons without uppercase
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, // Rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          padding: "8px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "16px",
          boxShadow: "0px 4px 20px rgba(0,0,0,0.05)",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid #e5e7eb", // subtle divider
        },
      },
    },
  },
});

export default theme;

