import React, { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { generateClient } from "aws-amplify/data";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Divider,
  Drawer,
  TextField,
  Typography
} from '@mui/material';
import { ChevronLeft, ChevronRight, Edit, Menu, Trash } from 'lucide-react';
import theme from "./theme.ts";

const client = generateClient<Schema>();

function App() {
  const { signOut } = useAuthenticator();
  const [flashcards, setFlashcards] = useState<Array<Schema["Flashcard"]["type"]>>([]);
  
  useEffect(() => {
    console.log(client.models);
    client.models.Flashcard.observeQuery().subscribe({
      next: (data) => setFlashcards([...data.items]),
    });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent page reload

    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries()) as { front: string; back: string };

    // Call createFlashcard with typed object
    console.log(formJson);
    createFlashcard(formJson);
    closeForm();
  };

  const createFlashcard = async (card: { front: string; back: string }) => {
    try {
      const response = await client.models.Flashcard.create({
        front: card.front,
        back: card.back,
      });

      if (!response.data) {
        throw new Error("Failed to create flashcard");
      }

      // Close the form after successful submission
      closeForm();
      console.log(response);
    } catch (err) {
      console.error("Error creating flashcard:", err);
    }
  };

  const deleteFlashcard = async (card: { id: string }) => {
    try {
      const response = await client.models.Flashcard.delete({ id: card.id });

      if (!response.data) {
        throw new Error("Failed to delete flashcard");
      }

      console.log("Deleted flashcard:", response.data);
    } catch (err) {
      console.error("Error deleting flashcard:", err);
    }
  };

  const handleEditSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries()) as { front: string; back: string };

    await editFlashcard({
      id: currentCard.id,
      front: formJson.front,
      back: formJson.back,
    });

    closeForm();
  };

  const editFlashcard = async (card: { id: string; front?: string; back?: string; }) => {
    try {
      const response = await client.models.Flashcard.update({
        id: card.id,       // required
        front: card.front, // optional, only update if provided
        back: card.back,   // optional
      });

      if (!response.data) {
        throw new Error("Failed to edit flashcard");
      }

      console.log("Edited flashcard:", response.data);
    } catch (err) {
      console.error("Error editing flashcard:", err);
    }
  };

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [formStatus, setFormStatus] = useState(false);
  const [formType, setFormType] = useState<string>('add');

  const handleMenu = () => {
    if (openMenu == true) {
      setOpenMenu(false)
      return
    }
    setOpenMenu(true);
  };

  const openForm = () => {
    setFormStatus(true);
  }

  const closeForm = () => {
    setFormStatus(false);
  }

  const nextCard = () => {
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    setShowBack(false);
  };

  const prevCard = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? flashcards.length - 1 : prev - 1
    );
    setShowBack(false);
  };

  const selectCard = (id: string) => {
    const index = flashcards.findIndex(c => c.id === id);
    if (index >= 0) {
      setCurrentIndex(index);
      setShowBack(false);
    }
  };


  const currentCard = flashcards[currentIndex];

  return (
    <Box>
      {flashcards.length === 0 ? 
      <Box>
        <Typography variant="h1">Your Flashcards</Typography>
        <Typography>No flashcards available.</Typography>
          <Button onClick={() => {
            setFormType('add'); 
            openForm();
            }}>
              + Add a Flashcard
          </Button>
          <Divider/>
        <Button onClick={signOut}>Sign out</Button>
        <Dialog open={formStatus} onClose={closeForm}>
          <DialogTitle>Add a Flashcard</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Complete the form to add your flashcard!
            </DialogContentText>
            <form onSubmit={handleSubmit} id="add-form">
              <TextField
                autoFocus
                required
                margin="dense"
                id="front"
                name="front"
                label="Question"
                type="text"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                required
                margin="dense"
                id="back"
                name="back"
                label="Answer"
                type="text"
                fullWidth
                variant="standard"
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeForm}>Cancel</Button>
            <Button type="submit" form="add-form">
              Submit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      :
      <Box>
        <Menu 
         onClick={handleMenu}
          style={{
            cursor: "pointer",
            position: "fixed",   // fix to viewport
            top: 10,             // distance from top
            left: 10,            // distance from left
            zIndex: 1,        // above other content
          }}
          size={32}              // optional, make it bigger
        />
        <Typography variant="h1">Your Flashcards</Typography>

        {/* Sidebar Navigation */}
        <Drawer 
          open={openMenu} 
          onClose={handleMenu}
          PaperProps={{
            sx: {
              width: 300,             
              height: "100%",         
              backgroundColor: "#1e293b", 
              color: "white",        
              padding: 2,            
            },
          }}
        >
          <ChevronLeft size={38} onClick={handleMenu} 
            style={{
              zIndex: 1000,
              position: "relative",
              left: 240,
              cursor: "pointer",
              paddingBottom: 10,
            }}/>
          {flashcards.map((card, index) => (
              <Typography
                key={card.id}
                onClick={() => selectCard(card.id)}
                sx={{
                  cursor: "pointer",
                  margin: 1
                }}
              >
                {index + 1}. {card.front}
              </Typography>
            ))}
          <Button onClick={signOut} sx={{ mt: "auto", color: theme.palette.text.secondary }}>Sign out</Button>
        </Drawer>

        {/* Flashcard Display */}
        <Box>        
          <Box onClick={() => setShowBack(!showBack)}>
            <Card
              variant="outlined"
              sx={{
                position: "relative",
                width: { xs: "90vw", sm: "600px", md: "900px" },
                height: { xs: "300px", sm: "400px", md: "600px" },
                margin: "auto",
                padding: 2,
                overflow: "visible", // allow buttons to stick out if needed
              }}
            >
              {/* Top-right Edit/Delete buttons */}
              <Box
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  display: "flex",
                  gap: 1,
                  zIndex: 1,
                }}
              >
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<Edit />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFormType("edit");
                    openForm();
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  startIcon={<Trash />}
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlashcard({ id: currentCard.id });
                  }}
                >
                  Delete
                </Button>
              </Box>

              {/* Card content */}
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: { xs: "1.2rem", sm: "1.5rem", md: "2rem" },
                  textAlign: "center",
                }}
              >
                {showBack ? currentCard.back : currentCard.front}
              </CardContent>

              {/* Left Chevron */}
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: -20, // more space from card edge
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  padding: 1, // extra clickable area
                  zIndex: 1,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  prevCard();
                }}
              >
                <ChevronLeft size={48} />
              </Box>

              {/* Right Chevron */}
              <Box
                 sx={{
                  position: "absolute",
                  top: "50%",
                  right: -20, // more space from card edge
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  padding: 1, // extra clickable area
                  zIndex: 1,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  nextCard();
                }}
              >
                <ChevronRight size={48} />
              </Box>
            </Card>
          </Box>

          <Divider 
            sx={{
              display: "flex",         // make it a flex container
              justifyContent: "center", // horizontal centering
              gap: 2,                   // spacing between buttons
              mt: 2,                    // optional top margin
            }}
          />

          <Box
            sx={{
              display: "flex",         // make it a flex container
              justifyContent: "center", // horizontal centering
              gap: 2,                   // spacing between buttons
              mt: 2,                    // optional top margin
            }}
          >
            <Button onClick={() => {
              setFormType('add'); 
              openForm();
              }}>
                + Add a Flashcard
          </Button>
          </Box>
        </Box>

        {formType === 'edit' ? 
          <Dialog open={formStatus} onClose={closeForm}>
            <DialogTitle>Edit Flashcard</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Complete the form to add your flashcard!
              </DialogContentText>
              <form onSubmit={handleEditSubmit} id="edit-form">
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="front"
                  name="front"
                  label="Question"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={currentCard.front}
                />
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="back"
                  name="back"
                  label="Answer"
                  type="text"
                  fullWidth
                  variant="standard"
                  defaultValue={currentCard.back}
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeForm}>Cancel</Button>
              <Button type="submit" form="edit-form">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
          :
            <Dialog open={formStatus} onClose={closeForm}>
            <DialogTitle>Add Flashcard</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Complete the form to add your flashcard!
              </DialogContentText>
              <form onSubmit={handleSubmit} id="add-form">
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="front"
                  name="front"
                  label="Question"
                  type="text"
                  fullWidth
                  variant="standard"
                />
                <TextField
                  autoFocus
                  required
                  margin="dense"
                  id="back"
                  name="back"
                  label="Answer"
                  type="text"
                  fullWidth
                  variant="standard"
                />
              </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={closeForm}>Cancel</Button>
              <Button type="submit" form="add-form">
                Submit
              </Button>
            </DialogActions>
          </Dialog>
        }
      </Box>
    }
    </Box>
  );
}

export default App;

