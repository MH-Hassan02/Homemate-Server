import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import favoritesRoutes from "./routes/favoriteRoutes.js";
dotenv.config();

connectDB();

const app = express();

const allowedOrigins = process.env.FRONTEND_ORIGIN.split(",");
const corsOptions = {
  origin: allowedOrigins,
};
app.use(cors(corsOptions));

app.use(express.json());

app.get("/", (req, res) => {
  res.json("hello");
});
app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

app.use("/api/upload", uploadRoutes);
app.use("/api/favorites", favoritesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`http://localhost:${PORT} `));
