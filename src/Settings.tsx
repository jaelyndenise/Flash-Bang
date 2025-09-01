import React, { useState } from "react";
import type { Schema } from "../amplify/data/resource";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Switch,
  FormControlLabel,
  TextField,
  Button,
} from "@mui/material";
import { generateClient } from "aws-amplify/data";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const client = generateClient<Schema>();

const Settings: React.FC = () => {
  const navigate = useNavigate();
  
  // Example state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [username, setUsername] = useState("User123");
  const [openMenu, setOpenMenu] = useState(false);
  
  const handleMenu = () => {
    if (openMenu == true) {
      setOpenMenu(false)
      return
    }
    setOpenMenu(true);
  };

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    // Save logic here
     event.preventDefault(); // Prevent page reload

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries()) as { front: string; back: string };

    // Call createFlashcard with typed object
    console.log(formJson);
    saveSettings(formJson);
    console.log("Settings saved:", { notificationsEnabled, username });
  };

    const saveSettings = async (card: { front: string; back: string }) => {
    try {
      const response = await client.models.Flashcard.create({
        front: card.front,
        back: card.back,
      });

      if (!response.data) {
        throw new Error("Failed to create flashcard");
      }

      console.log(response);
    } catch (err) {
      console.error("Error creating flashcard:", err);
    }
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        maxWidth: 800,
        margin: "auto",
      }}
    >
      <Button 
        onClick={() => navigate("/")}>
        <ArrowLeft />
        Return to Home
      </Button>

      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      {/* Account Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Account
          </Typography>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email"
            value="user@example.com"
            disabled
            fullWidth
            sx={{ mb: 2 }}
          />
        </CardContent>
      </Card>

      {/* Preferences Section */}
      {/* <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Preferences
          </Typography>
          <FormControlLabel
            control={
              <Switch
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
            }
            label="Enable Notifications"
          />
        </CardContent>
      </Card> */}

      {/* Danger Zone */}
      <Card sx={{ mb: 3, borderColor: "error.main", borderWidth: 1, borderStyle: "solid" }}>
        <CardContent>
          <Typography variant="h6" color="error" gutterBottom>
            Danger Zone
          </Typography>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Deleting your account is irreversible.
          </Typography>
          <Button variant="contained" color="error">
            Delete Account
          </Button>
        </CardContent>
      </Card>

      {/* Save Button */}
      <Box sx={{ textAlign: "right" }}>
        <Button variant="contained" color="primary" onClick={() => handleSave}>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
