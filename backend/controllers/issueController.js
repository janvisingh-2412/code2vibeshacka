const Issue = require("../models/Issue");

exports.createIssue = async (req, res) => {

    console.log("========== CREATE ISSUE ==========");
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    try {

        const newIssue = new Issue({
            issueType: req.body.issueType,
            description: req.body.description,
            severity: req.body.severity,
            location: req.body.location,
            imageUrl: req.file ? req.file.filename : ""
        });

        console.log("Saving issue...");

        await newIssue.save();

        console.log("Issue saved successfully!");

        res.json({
            success: true,
            message: "Issue Submitted Successfully"
        });

    } catch (err) {

        console.log("ERROR SAVING ISSUE:");
        console.log(err);

        res.status(500).json({
            success: false,
            message: err.message
        });

    }

};