require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.post("/generate-joke", async (req, res) => {
  try {
    const { category } = req.body;
    const prompt = `Tell me a ${category} joke that's short and funny`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    res.json({ joke: data.candidates[0].content.parts[0].text });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate joke" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
