const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {createIssue, getAllIssues}=require("../controllers/issueController");

router.post("/create",upload.single("image"),createIssue);
router.get("/", getAllIssues);

module.exports=router;
