import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Grid,
} from "@mui/material";
import MainCard from "components/MainCard";

const TestimonialManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Form States
  const [text, setText] = useState("");
  const [rating, setRating] = useState("");
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);

  // Delete Dialog States
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [testimonialToDelete, setTestimonialToDelete] = useState(null);

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
    if (newIndex === 1) fetchTestimonials();
  };

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:7000/testimonials");
      const data = await response.json();
      if (response.ok) setTestimonials(data);
      else setMessage(`Failed to fetch testimonials: ${data.error}`);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUserImageChange = (e) => {
    setUserImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("text", text);
    formData.append("rating", rating);
    formData.append("userName", userName);
    formData.append("userImage", userImage);

    try {
      const response = await fetch("http://localhost:7000/testimonials/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage("Testimonial added successfully!");
        setText("");
        setRating("");
        setUserName("");
        setUserImage(null);
        fetchTestimonials();
      } else {
        setMessage(`Failed to add testimonial: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const openDeleteDialog = (id) => {
    setTestimonialToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await fetch(
        `http://localhost:7000/testimonials/${testimonialToDelete}`,
        { method: "DELETE" }
      );

      if (response.ok) {
        setMessage("Testimonial deleted successfully.");
        setTestimonials(testimonials.filter((t) => t._id !== testimonialToDelete));
      } else {
        const result = await response.json();
        setMessage(`Failed to delete testimonial: ${result.error}`);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setTestimonialToDelete(null);
    }
  };

  return (
    <MainCard title="Testimonial Management">
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Add Testimonial" />
        <Tab label="View Testimonials" />
      </Tabs>

      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Testimonial Text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                multiline
                rows={4}
                required
              />
              <TextField
                label="Rating (1-5)"
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                inputProps={{ min: 1, max: 5 }}
                required
              />
              <TextField
                label="User Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
              <Button variant="contained" component="label">
                Upload User Image
                <input type="file" hidden onChange={handleUserImageChange} />
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Submit
              </Button>
            </Stack>
          </form>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : testimonials.length > 0 ? (
            <Grid container spacing={3}>
              {testimonials.map((testimonial) => (
                <Grid item xs={12} sm={6} md={4} key={testimonial._id}>
                  <Card>
                    <CardMedia
                      component="img"
                      image={testimonial.userImage}
                      alt={testimonial.userName}
                    />
                    <CardContent>
                      <Typography>{testimonial.text}</Typography>
                      <Typography>Rating: {testimonial.rating}/5</Typography>
                      <Typography>User: {testimonial.userName}</Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        color="error"
                        onClick={() => openDeleteDialog(testimonial._id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No testimonials found.</Typography>
          )}
        </Paper>
      )}

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this testimonial?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default TestimonialManagement;
