const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log("📁 Created uploads directory");
}

const storage = multer.diskStorage({

    destination: function(req, file, cb){
        console.log("📁 Saving file to:", uploadsDir);
        cb(null, uploadsDir);
    },

    filename: function(req, file, cb){
        const filename = Date.now() + path.extname(file.originalname);
        console.log("📝 Generated filename:", filename);
        cb(null, filename);
    }

});

const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

module.exports = upload;