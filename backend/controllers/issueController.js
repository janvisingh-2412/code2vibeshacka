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
            lat: req.body.lat ? parseFloat(req.body.lat) : null,
            lng: req.body.lng ? parseFloat(req.body.lng) : null,
            address: req.body.address || "",
            imageUrl: req.file.filename,
            status: req.body.status || "Pending"
        });

        console.log("💾 Saving issue to MongoDB...");
        console.log("   Issue Data:", {
            issueType: newIssue.issueType,
            description: newIssue.description.substring(0, 50) + "...",
            severity: newIssue.severity,
            location: newIssue.location,
            lat: newIssue.lat,
            lng: newIssue.lng,
            address: newIssue.address,
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

exports.getAllIssues = async (req, res) => {

    console.log("\n========== GET ALL ISSUES ==========");

    try {

        const issues = await Issue.find().sort({ createdAt: -1 });

        console.log(`✅ Retrieved ${issues.length} issues from MongoDB`);

        res.json({
            success: true,
            issues: issues
        });

    } catch (err) {

        console.error("\n❌ ERROR FETCHING ISSUES:");
        console.error("   Error Message:", err.message);
        console.error("   Error Stack:", err.stack);

        res.status(500).json({
            success: false,
            message: err.message || "Failed to fetch issues"
        });

    }

};
