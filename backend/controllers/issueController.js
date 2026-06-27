const Issue = require("../models/issue");

exports.createIssue = async (req, res) => {

    console.log("\n========== CREATE ISSUE CONTROLLER ==========");
    console.log("📥 Request Body:", req.body);
    console.log("📎 File Details:", req.file ? { filename: req.file.filename, path: req.file.path, size: req.file.size } : "❌ NO FILE");

    try {

        if (!req.file) {
            console.error("❌ No image file uploaded");
            return res.status(400).json({
                success: false,
                message: "No image file uploaded"
            });
        }

        const newIssue = new Issue({
            issueType: req.body.issueType,
            description: req.body.description,
            severity: req.body.severity,
            location: req.body.location,
            imageUrl: req.file.filename,
            status: req.body.status || "Pending"
        });

        console.log("💾 Saving issue to MongoDB...");
        console.log("   Issue Data:", {
            issueType: newIssue.issueType,
            description: newIssue.description.substring(0, 50) + "...",
            severity: newIssue.severity,
            location: newIssue.location,
            imageUrl: newIssue.imageUrl,
            status: newIssue.status
        });

        await newIssue.save();

        console.log("✅ Issue saved successfully to MongoDB!");
        console.log("   Issue ID:", newIssue._id);
        console.log("   Created At:", newIssue.createdAt);

        res.json({
            success: true,
            message: "Issue Submitted Successfully",
            issueId: newIssue._id
        });

    } catch (err) {

        console.error("\n❌ ERROR SAVING ISSUE:");
        console.error("   Error Message:", err.message);
        console.error("   Error Stack:", err.stack);

        res.status(500).json({
            success: false,
            message: err.message || "Failed to save issue"
        });

    }

};