import React from "react";
import ReactDOM from "react-dom/client";
import { Authenticator } from "@aws-amplify/ui-react";
import App from "./App.tsx";
import Settings from "./Settings.tsx"; // import your settings page
import "./index.css";
import "@aws-amplify/ui-react/styles.css";
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme.ts";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Authenticator>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Authenticator>
  </React.StrictMode>
);

