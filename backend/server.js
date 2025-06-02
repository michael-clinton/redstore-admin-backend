const express = require("express");
const cors = require("cors");
const connectDB = require("./src/config/db");
const corsOptions = require("./src/config/corsConfig");
const productRoutes = require("./src/routes/productRoutes");
const uploadRoutes = require("./src/routes/uploadRoutes");
const testimonialRoutes = require("./src/routes/testimonialRoutes");
const offerRoutes = require("./src/routes/offerRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const orderRoutes = require("./src/routes/orderRoutes");
const uniqueVisitorRoutes = require("./src/routes/uniqueVisitorRoutes");

const dotenv = require("dotenv");
dotenv.config();

connectDB();

const app = express();


app.use(cors(corsOptions));
app.use(express.json());

app.use("/", productRoutes);
app.use("/upload", uploadRoutes);
app.use("/testimonials", testimonialRoutes);
app.use("/offers", offerRoutes);
app.use("/categories", categoryRoutes);
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/user', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/views', uniqueVisitorRoutes);


console.log("Cloudinary Config:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
