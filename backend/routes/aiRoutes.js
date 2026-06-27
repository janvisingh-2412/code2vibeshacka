const express = require("express");
const router = express.Router();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const upload = require("../middleware/upload");


// ================= CHATBOT =================

router.post("/chat", async (req, res) => {

  try {

    const { message } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    });

    const result = await model.generateContent(message);

    const response = result.response.text();

    res.json({
      success: true,
      reply: response
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false
    });

  }

});


// ================= IMAGE ANALYSIS =================

router.post(
  "/analyze-image",
  upload.single("image"),
  async (req, res) => {
    console.log("\n========== GEMINI IMAGE ANALYSIS ==========");
    try {
      if (!req.file) {
        console.error("❌ No file uploaded");
        return res.status(400).json({
          success: false,
          message: "No image uploaded."
        });
      }

      console.log("📎 File Details:", { filename: req.file.filename, path: req.file.path, mimetype: req.file.mimetype });
      console.log("🔄 Reading file from disk...");

      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString("base64");
      console.log("✅ File converted to Base64 (" + base64Image.length + " bytes)");

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash"
      });

      const prompt = `You are CivicLens AI,
an expert Smart City Infrastructure Inspection Assistant.

Analyze the uploaded image.

Determine whether it belongs to ONE of these categories:

1. Pothole / Road Damage

2. Faulty Street Lighting

3. Public Space Maintenance

4. Vandalism / Graffiti

If the uploaded image is unrelated to civic infrastructure issues
(selfie, pet, person, food, sky, random object etc.)

Return

issueType = Unknown

isValidInfrastructureIssue = false

reason =
"The uploaded image does not contain a civic infrastructure issue."

Otherwise detect:

• Issue Type

• Severity

• Confidence (as percentage with % sign, e.g., "85%")

• Description

• Suggested Action

• Estimated Repair Time

Severity Rules

Critical

- Large potholes

- Dangerous road cracks

- Fallen poles

- Broken hanging street lights

- Electrical hazards

- Heavy vandalism

- Major public hazards

Medium

- Moderate road damage

- One or two faulty street lights

- Moderate graffiti

- Broken benches

- Damaged dustbins

- Sidewalk damage

Normal

- Small cracks

- Minor graffiti

- Cosmetic maintenance

- Low-risk issues

Return ONLY valid JSON

Never return markdown.

JSON:

{
"isValidInfrastructureIssue":true,
"reason":"",
"issueType":"",
"severity":"",
"confidence":"",
"description":"",
"suggestedAction":"",
"estimatedRepairTime":""
}`;

      console.log("🔄 Sending request to Gemini API...");
      const result = await model.generateContent([
        
        prompt,
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image
          }
        }
      ]);
      console.log("✅ Gemini API response received");

      let text = result.response.text();
      console.log("📝 Raw Gemini Response:\n" + text);
      
      // Parse JSON from response
      text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      const analysis = JSON.parse(text);
      console.log("✅ Parsed Analysis JSON:", analysis);

      res.json({
        success: true,
        analysis: analysis
      });
    } catch (err) {
      console.error("\n❌ ERROR IN IMAGE ANALYSIS:");
      console.error("   Error Message:", err.message);
      console.error("   Error Stack:", err.stack);
      
      res.status(500).json({
        success: false,
        message: "Image analysis failed: " + err.message
      });
    }
  }
);

module.exports = router;