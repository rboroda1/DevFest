import express from "express";
import fs from "fs";
import cors from "cors";
import cron from "node-cron";
import { exec } from "child_process";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// **Serve the latest dining data**
// app.get("/dining", (req, res) => {
//   console.log("⏳ Loading latest dining menu...");
//   fs.readFile("diningMenus.json", "utf8", (err, data) => {
//     if (err) {
//       console.error("❌ Error reading JSON file:", err);
//       return res.status(500).json({ error: "Dining menu data not available. Please try again later." });
//     }
//     res.json(JSON.parse(data));
//   });
// });
app.get("/dining", (req, res) => {
  console.log("⏳ Loading latest dining menu...");
  fs.readFile("diningMenus.json", "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading JSON file:", err);
      return res.status(500).json({ error: "Dining menu data not available." });
    }
    res.setHeader(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, proxy-revalidate"
    );
    res.setHeader("Expires", "0");
    res.setHeader("Pragma", "no-cache");
    res.json(JSON.parse(data));
  });
});

// **Serve the latest news data**
app.get("/news", (req, res) => {
  fs.readFile("news.json", "utf8", (err, data) => {
    if (err) {
      console.error("❌ Error reading news JSON file:", err);
      return res
        .status(500)
        .json({ error: "News data not available. Please try again later." });
    }
    res.json(JSON.parse(data));
  });
});

// **Run the news scraper daily at 7 AM**
cron.schedule("0 7 * * *", () => {
  console.log("⏳ Running daily news scrape...");
  exec("node newsScraper.js", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error executing news script: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`⚠️ Script stderr: ${stderr}`);
    }
    console.log(`✅ News Script Output: ${stdout}`);
  });
});

// **Start Server**
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
