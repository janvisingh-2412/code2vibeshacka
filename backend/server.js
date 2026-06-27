require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const aiRoutes = require("./routes/aiRoutes");
const issueRoutes = require("./routes/issueRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/ai", aiRoutes);
app.use("/api/issues", issueRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected Successfully");
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err.message);
});

app.get("/", (req, res) => {
    res.send("✅ Fixora Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📍 Frontend: http://localhost:3000`);
    console.log(`🔌 API Base: http://localhost:${PORT}`);
    console.log(`🗄️  MongoDB: Connected\n`);
});