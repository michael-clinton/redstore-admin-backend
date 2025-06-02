import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Box,
} from "@mui/material";

const OfferAdmin = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const [offer, setOffer] = useState(null);

  // Fetch existing offer
  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const { data } = await axios.get("http://localhost:7000/offers/offer-show");
        setOffer(data);
        if (data) {
          setForm({
            title: data.title || "",
            description: data.description || "",
            link: data.link || "",
            image: null, // API does not return the file itself
          });
        }
      } catch (err) {
        console.error("Error fetching offer:", err);
      }
    };

    fetchOffer();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("link", form.link);
    if (form.image) formData.append("image", form.image);

    try {
      const response = await axios.post("http://localhost:7000/offers/offer", formData);
      alert("Offer saved successfully");
      setOffer(response.data); // Update offer state after save
    } catch (err) {
      console.error("Error saving offer:", err);
      alert("Failed to save offer");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {offer ? "Update Offer" : "Create Offer"}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={4}
        />
        <TextField
          fullWidth
          label="Link"
          name="link"
          value={form.link}
          onChange={handleChange}
          margin="normal"
        />
        <Box sx={{ mt: 2 }}>
          <Button variant="contained" component="label">
            Upload Image
            <input type="file" hidden onChange={handleFileChange} />
          </Button>
        </Box>
        <Button
          fullWidth
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Save Offer"}
        </Button>
      </form>
    </Container>
  );
};

export default OfferAdmin;
