const express = require("express");
const rateLimit = require("../middleware/rateLimit");

const router = express.Router();

const MAX_QUESTION_LENGTH = 1000;
const REQUEST_TIMEOUT_MS = 20_000;

const SYSTEM_PROMPT = [
  "You are the BloodBond assistant, a helpful aide for a blood donation platform.",
  "Answer briefly and clearly (max 120 words) about blood donation eligibility,",
  "blood groups, how to raise or fulfil a blood request, finding blood stock,",
  "donation drives and rewards.",
  "You are not a doctor: for anything medical, symptoms, medication or",
  "pregnancy related, advise the user to consult a doctor or blood bank.",
  "Never invent stock numbers, hospitals or phone numbers.",
].join(" ");

function getAiConfig() {
  return {
    apiKey: process.env.AI_API_KEY || process.env.OPENAI_API_KEY || "",
    baseUrl: (process.env.AI_BASE_URL || "https://api.openai.com/v1").replace(
      /\/+$/,
      ""
    ),
    model: process.env.AI_MODEL || "gpt-4o-mini",
  };
}

function localAnswer(question) {
  const q = question.toLowerCase();

  if (/eligib|can i donate|who can donate|allowed to donate|who is able/.test(q)) {
    return "Most healthy adults aged 18-65 who weigh at least 50 kg can donate every 8-12 weeks. If you have recently been ill, pregnant, or on medication, please confirm with your nearest blood bank before donating.";
  }
  if (/how much|how many times|frequency|again/.test(q)) {
    return "Whole blood can normally be donated once every 8-12 weeks (about 3 months). Platelet donations are allowed more often - your blood bank will confirm based on your last donation.";
  }
  if (/find|search|need blood|require/.test(q)) {
    return "Use the Find Blood page: pick the blood group, state and district to see blood banks with available units. For emergencies you can also raise a blood request from your dashboard so donors nearby are alerted.";
  }
  if (/request|urgent|emergency/.test(q)) {
    return "Log in, open 'Raise Blood Request', add the blood group, units and hospital details. Admins review it and approved requests show up for blood banks and nearby donors to fulfil.";
  }
  if (/reward|tier|badge|points/.test(q)) {
    return "Donors earn Bronze, Silver and Gold tiers as they complete verified donations. Check the Rewards page for the current tier rules and benefits.";
  }
  if (/event|drive|camp/.test(q)) {
    return "Upcoming blood donation drives are listed on the Events page - you can browse them without logging in and register for one from your dashboard.";
  }

  return "I can help with donation eligibility, blood requests, finding available stock, events and rewards. Could you rephrase your question? For medical advice, please speak to a doctor or your nearest blood bank.";
}

async function callModel(messages) {
  const { apiKey, baseUrl, model } = getAiConfig();

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ model, messages, max_tokens: 300, temperature: 0.3 }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => "");
      const error = new Error(`Provider responded with ${response.status}`);
      error.status = response.status;
      error.detail = detail.slice(0, 300);
      throw error;
    }

    const data = await response.json();
    const reply = data?.choices?.[0]?.message?.content?.trim();
    if (!reply) {
      const error = new Error("Provider returned an empty response");
      error.status = 502;
      throw error;
    }
    return reply;
  } finally {
    clearTimeout(timer);
  }
}

router.post(
  "/assistant",
  rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }),
  async (req, res) => {
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }
    if (question.length > MAX_QUESTION_LENGTH) {
      return res.status(400).json({
        message: `Question must be at most ${MAX_QUESTION_LENGTH} characters`,
      });
    }

    if (!getAiConfig().apiKey) {
      return res.json({ reply: localAnswer(question), source: "local" });
    }

    try {
      const history = Array.isArray(req.body?.history) ? req.body.history : [];
      const messages = [
        { role: "system", content: SYSTEM_PROMPT },
        ...history
          .slice(-6)
          .filter(
            (m) =>
              m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string"
          )
          .map((m) => ({ role: m.role, content: m.content.slice(0, 1000) })),
        { role: "user", content: question },
      ];

      const reply = await callModel(messages);
      return res.json({ reply, source: "ai" });
    } catch (err) {
      if (err.name === "AbortError") {
        return res.status(504).json({ message: "The assistant took too long to respond" });
      }
      console.error("AI assistant error:", err.message, err.detail || "");
      // Keep the assistant usable when the provider is down.
      return res.json({ reply: localAnswer(question), source: "local" });
    }
  }
);

module.exports = router;
