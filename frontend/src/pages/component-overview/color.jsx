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

const FeaturedManagement = () => {
  // Tab control: 0 = Add Featured, 1 = View Featured
  const [tabIndex, setTabIndex] = useState(0);

  // Featured products list & loading state
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);

  // Form state for new featured product
  const [form, setForm] = useState({
    name: "",
    price: "",
    rating: "",
    description: "",
    singleImage: null,
    multipleImages: [],
    sizes: [{ size: "", available: true }],
  });

  // Message to display success/error
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Handle tab switching
  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
    if (newIndex === 1) fetchFeatured();
  };

  // Fetch featured products from backend
  const fetchFeatured = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:7000/products/view-featured");
      const data = await res.json();
      if (res.ok) setFeatured(data);
      else setMessage(`Failed to fetch featured products: ${data.error}`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes for form fields
  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes in sizes array
  const handleSizeChange = (index, key, value) => {
    const updatedSizes = [...form.sizes];
    updatedSizes[index][key] = value;
    setForm((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  // Add new size input field
  const addSizeField = () => {
    setForm((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { size: "", available: true }],
    }));
  };

  // Remove size input field
  const removeSizeField = (index) => {
    setForm((prev) => ({
      ...prev,
      sizes: prev.sizes.filter((_, i) => i !== index),
    }));
  };

  // Single image file change
  const handleSingleImageChange = (e) => {
    setForm((prev) => ({ ...prev, singleImage: e.target.files[0] }));
  };

  // Multiple images file change
  const handleMultipleImagesChange = (e) => {
    setForm((prev) => ({
      ...prev,
      multipleImages: [...e.target.files],
    }));
  };

  // Submit new featured product to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("rating", form.rating);
    formData.append("description", form.description);
    if (form.singleImage) formData.append("singleImage", form.singleImage);
    form.multipleImages.forEach((img) =>
      formData.append("multipleImages", img)
    );
    formData.append("sizes", JSON.stringify(form.sizes));

    try {
      const res = await fetch("http://localhost:7000/upload/upload-featured", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (res.ok) {
        setMessage("Featured product uploaded successfully!");
        // Reset form
        setForm({
          name: "",
          price: "",
          rating: "",
          description: "",
          singleImage: null,
          multipleImages: [],
          sizes: [{ size: "", available: true }],
        });
      } else {
        setMessage(`Upload failed: ${result.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation dialog
  const openDeleteDialog = (id) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete request
  const confirmDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:7000/products/featured/${itemToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) {
        setMessage("Featured product deleted successfully.");
        setFeatured((prev) => prev.filter((item) => item._id !== itemToDelete));
      } else {
        const result = await res.json();
        setMessage(`Failed to delete: ${result.error}`);
      }
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  return (
    <MainCard title="Featured Product Management">
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Add Featured Product" />
        <Tab label="View Featured Products" />
      </Tabs>

      {/* Add Featured Product Tab */}
      {tabIndex === 0 && (
        <Paper sx={{ padding: 4, borderRadius: 2, mt: 2 }}>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Name"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Price"
                type="number"
                value={form.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                required
                fullWidth
                inputProps={{ min: 0 }}
              />
              <TextField
                label="Rating (1-5)"
                type="number"
                value={form.rating}
                onChange={(e) => handleInputChange("rating", e.target.value)}
                required
                fullWidth
                inputProps={{ min: 1, max: 5 }}
              />
              <TextField
                label="Description"
                value={form.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                multiline
                rows={4}
                required
                fullWidth
              />

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Single Image:
                </Typography>
                <Button variant="contained" component="label">
                  Choose File
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleSingleImageChange}
                  />
                </Button>
                {form.singleImage && (
                  <Typography variant="caption" sx={{ ml: 2 }}>
                    {form.singleImage.name}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Upload Multiple Images:
                </Typography>
                <Button variant="contained" component="label">
                  Choose Files
                  <input
                    type="file"
                    hidden
                    multiple
                    accept="image/*"
                    onChange={handleMultipleImagesChange}
                  />
                </Button>
                {form.multipleImages.length > 0 && (
                  <Typography variant="caption" sx={{ ml: 2 }}>
                    {form.multipleImages.length} file(s) selected
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle1">Sizes:</Typography>
                {form.sizes.map((size, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    mb={1}
                  >
                    <TextField
                      label="Size"
                      value={size.size}
                      onChange={(e) =>
                        handleSizeChange(index, "size", e.target.value)
                      }
                      required
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeSizeField(index)}
                      disabled={form.sizes.length === 1}
                    >
                      Remove
                    </Button>
                  </Stack>
                ))}
                <Button variant="contained" onClick={addSizeField}>
                  Add Size
                </Button>
              </Box>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                fullWidth
              >
                {isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Upload Featured Product"
                )}
              </Button>
            </Stack>
          </form>
          {message && (
            <Typography
              sx={{ mt: 2 }}
              color={message.includes("successfully") ? "green" : "red"}
            >
              {message}
            </Typography>
          )}
        </Paper>
      )}

      {/* View Featured Products Tab */}
      {tabIndex === 1 && (
        <Paper sx={{ padding: 4, borderRadius: 2, mt: 2 }}>
          {loading ? (
            <CircularProgress />
          ) : featured.length > 0 ? (
            <Grid container spacing={3}>
              {featured.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={`${product.singleImage}`}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography>Price: ${product.price}</Typography>
                      <Typography>Rating: {product.rating}/5</Typography>
                      <Typography sx={{ mb: 1 }}>
                        {product.description}
                      </Typography>
                      <Typography variant="subtitle2">Sizes:</Typography>
                      {product.sizes?.map((size, idx) => (
                        <Typography key={idx} variant="body2">
                          {size.size} - {size.available ? "Available" : "Out of stock"}
                        </Typography>
                      ))}
                    </CardContent>
                    <CardActions>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(product._id)}
                      >
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography>No featured products found.</Typography>
          )}
        </Paper>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this featured product? This action
            cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default FeaturedManagement;
