const allowedOrigins = [
    "http://localhost:5173",
    "https://redstore-ecommerce-platform-1.onrender.com/",
    "http://localhost:3000"
  ];
  
  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };
  
  module.exports = corsOptions;
  