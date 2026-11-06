import express from "express";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();


const app= express();
const PORT= process.env.PORT || 5002;



// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));





app.get("/",(req,res)=>{
  return res.status(200).json({message:"Auth Microservice is running"});
})

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "UP" });
});


app.listen(PORT,()=>{
    console.log(`Auth Microservice is running on port http://localhost:${PORT}`);
})