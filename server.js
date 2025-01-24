import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

console.log(OPENAI_API_KEY);
app.post("/api/chat", async (req, res) => {
  console.log(req.body);
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: "Query is required" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: query },
        ],
      }),
    });
  
    const data = await response.json();
  
    if (!response.ok) {
      console.log("OpenAI API error:", data); // Log the error response from OpenAI
      return res.status(response.status).json(data);
    }
  
    res.json(data);
  } catch (error) {
    console.error("Error:", error); // Log the full error if it's not from the OpenAI API
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
  
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
