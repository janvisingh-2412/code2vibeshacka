require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const aiRoutes = require("./routes/aiRoutes");

const app = express();

app.use(cors());

const issueRoutes = require("./routes/issueRoutes");

const path = require("path");
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/ai", aiRoutes);
app.use("/api/issues", issueRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((err) => {
    console.log("❌ MongoDB Error:", err);
});

app.get("/", (req, res) => {
    res.send("Fixora Backend Running");
});

const PORT = process.env.PORT || 5000;



app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});