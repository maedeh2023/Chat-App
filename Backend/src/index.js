import express from "express";
import { io, app as socketApp, server } from "./lib/socket.js"; // Import socket.io server

import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser"
import path from "path";
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";


const app= express();
dotenv.config();
const PORT = process.env.PORT
const __dirname = path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(cors(
    {
        origin:"http://localhost:5173",
        credentials:true,
    })
);

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));
  
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
  }
  
await connectDB();
const httpServer = app.listen(PORT, async () => {


    console.log("Server is running on port :" +PORT);

});

// Start the socket.io server
io.attach(httpServer);
