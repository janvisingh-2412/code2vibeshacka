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
    try {
      if (!req.file) {
        console.log(req.file);
        return res.status(400).json({
          success: false,
          message: "No image uploaded."
        });
      }

      const imageBuffer = fs.readFileSync(req.file.path);
      const base64Image = imageBuffer.toString("base64");

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

• Confidence

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

JSON

{
"isValidInfrastructureIssue":true,
"reason":"",
"issueType":"",
"severity":"",
"confidence":"",
"description":"",
"suggestedAction":"",
"estimatedRepairTime":""
}
`;

      const result = await model.generateContent([
        
        prompt,
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image
          }
        }
      ]);
      console.log("Gemini request sent");

      let text = result.response.text();
      console.log(text);
      text = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
      const analysis = JSON.parse(text);

      res.json({
        success: true,
        analysis: analysis
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Image analysis failed."
      });
    }
  }
);

module.exports = router;