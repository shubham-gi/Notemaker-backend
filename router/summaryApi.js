import express from "express";
import { YoutubeTranscript } from "youtube-transcript";
import { authenticationToken } from "../utilities.js";
import getSummary from "../utils/getsummary.js";
const router = express.Router();
router.get("/", authenticationToken, async (req, res) => {
  console.log("inside summary api");
  const { url } = req.query;
  if (url == null) {
    return res.json({ error: "true", message: "URL is required" });
  }
  const videoId = url.split("v=")[1];
  if (videoId == null) {
    return res.json({ error: "true", message: "Invalid URL" });
  }
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);

    // Join transcript text into one string
    const transcriptText = transcript.map((item) => item.text).join(" ");
    // Summarize transcript using an AI model
    const summary = await getSummary(transcriptText);

    res.status(200).json({ summary });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Error fetching transcript or summarizing" });
  }
});
export default router;
