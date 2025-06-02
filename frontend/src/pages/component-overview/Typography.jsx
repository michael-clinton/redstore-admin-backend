import React, { useState, useEffect } from "react";
import axios from "axios";
import slugify from "slugify";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import MainCard from "components/MainCard";

const ProductManagement = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [rating, setRating] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [singleImage, setSingleImage] = useState(null);
  const [multipleImages, setMultipleImages] = useState([]);
  const [sizes, setSizes] = useState([{ size: "", available: true }]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const { data } = await axios.get("http://localhost:7000/categories");
      setCategories(data);
    } catch (error) {
      setMessage(`Error fetching categories: ${error.message}`);
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const { data } = await axios.get("http://localhost:7000/products");
      setProducts(data);
    } catch (error) {
      setMessage(`Error fetching products: ${error.message}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
    if (newIndex === 1) fetchProducts();
  };

  const handleSingleImageChange = (e) => {
    setSingleImage(e.target.files[0]);
  };

  const handleMultipleImagesChange = (e) => {
    setMultipleImages([...e.target.files]);
  };

  const handleSizeChange = (index, key, value) => {
    const updatedSizes = [...sizes];
    updatedSizes[index][key] = value;
    setSizes(updatedSizes);
  };

  const addSizeField = () => {
    setSizes([...sizes, { size: "", available: true }]);
  };

  const removeSizeField = (index) => {
    setSizes(sizes.filter((_, i) => i !== index));
  };



  const addCategory = async () => {
    if (!newCategoryName.trim()) {
      alert("Category name is required");
      return;
    }

    const slug = slugify(newCategoryName.trim(), { lower: true });

    try {
      await axios.post("http://localhost:7000/categories/add", {
        name: newCategoryName.trim(),
        slug,
      });
      setNewCategoryName("");
      fetchCategories();
      alert("Category added successfully!");
    } catch (error) {
      alert(`Error adding category: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("rating", rating);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("singleImage", singleImage);
    multipleImages.forEach((img) => formData.append("multipleImages", img));
    formData.append("sizes", JSON.stringify(sizes));

    try {
      await axios.post("http://localhost:7000/upload/upload-all", formData);
      setMessage("Product uploaded successfully!");
      setName("");
      setPrice("");
      setRating("");
      setDescription("");
      setCategory("");
      setSingleImage(null);
      setMultipleImages([]);
      setSizes([{ size: "", available: true }]);
    } catch (error) {
      setMessage(`Upload failed: ${error.response?.data?.error || error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteDialog = (productId) => {
    setProductToDelete(productId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:7000/products/${productToDelete}`);
      setMessage("Product deleted successfully.");
      setProducts(products.filter((p) => p._id !== productToDelete));
    } catch (error) {
      setMessage(`Error deleting product: ${error.response?.data?.error || error.message}`);
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  return (
    <MainCard title="Product Management">
      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Add Product" />
        <Tab label="View Products" />
      </Tabs>

      {tabIndex === 0 && (
        <Paper elevation={3} sx={{ padding: 4, borderRadius: 2 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6">Add New Category</Typography>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mt: 1 }}>
              <TextField
                label="New Category Name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                size="small"
              />
              <Button
                variant="contained"
                onClick={addCategory}
                disabled={addingCategory}
              >
                {addingCategory ? "Adding..." : "Add"}
              </Button>
            </Stack>
          </Box>

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Product Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                fullWidth
                required
              />
              <TextField
                label="Rating (1-5)"
                type="number"
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                inputProps={{ min: 1, max: 5 }}
                fullWidth
                required
              />
              <TextField
                label="Product Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
                multiline
                rows={4}
                required
              />

              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Category"
                  disabled={loadingCategories}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat._id} value={cat._id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box>
                <Typography variant="subtitle1">Upload Single Image:</Typography>
                <Button variant="contained" component="label">
                  Choose File
                  <input type="file" hidden onChange={handleSingleImageChange} />
                </Button>
              </Box>

              <Box>
                <Typography variant="subtitle1">Upload Multiple Images:</Typography>
                <Button variant="contained" component="label">
                  Choose Files
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleMultipleImagesChange}
                  />
                </Button>
              </Box>

              <Box>
                <Typography variant="subtitle1">Product Sizes:</Typography>
                {sizes.map((size, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <TextField
                      label="Size"
                      value={size.size}
                      onChange={(e) => handleSizeChange(index, "size", e.target.value)}
                      required
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeSizeField(index)}
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
                disabled={isLoading}
                fullWidth
              >
                {isLoading ? <CircularProgress size={24} /> : "Upload Product"}
              </Button>

              {message && (
                <Typography
                  variant="body1"
                  color={message.toLowerCase().includes("fail") ? "error" : "primary"}
                >
                  {message}
                </Typography>
              )}
            </Stack>
          </form>
        </Paper>
      )}

      {tabIndex === 1 && (
        <Box sx={{ mt: 2 }}>
          {loadingProducts ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "150px",
              }}
            >
              <CircularProgress />
            </Box>
          ) : products.length === 0 ? (
            <Typography variant="h6">No products available.</Typography>
          ) : (
            <Grid container spacing={2}>
              {products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                    {product.singleImage && (
                      <CardMedia
                        component="img"
                        height="200"
                        image={product.singleImage}
                        alt={product.name}
                      />
                    )}
                    <CardContent>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        Price: ${product.price}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Rating: {product.rating}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Category: {product.category?.name || "N/A"}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ mt: "auto" }}>
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
          )}

          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete this product? This action cannot be undone.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button color="error" onClick={confirmDelete}>Delete</Button>
            </DialogActions>
          </Dialog>
        </Box>
      )}
    </MainCard>
  );
};

export default ProductManagement;
