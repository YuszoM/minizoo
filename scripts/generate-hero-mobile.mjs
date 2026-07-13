#!/usr/bin/env node
/**
 * Generuje pionowe hero pod mobile — ta sama scena co hero-encounter.png (desktop).
 * GEMINI_API_KEY=... node scripts/generate-hero-mobile.mjs
 */

import { readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DESKTOP_HERO = path.join(ROOT, "public/images/hero-encounter.png");
const OUT_PATH = path.join(ROOT, "public/images/hero-encounter-mobile.jpg");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const MODEL = "gemini-3.1-flash-image";

const PROMPT = `You are creating a MOBILE VERTICAL hero photograph for a Polish mini zoo website (egZOOturystyka).

REFERENCE IMAGE: Match the EXACT same scene, subjects, lighting, mood, and color grading as the attached desktop hero photo — same children, same animals, same indoor/nature encounter setting, same warm documentary feel.

MOBILE REFRAME (9:16 portrait):
- Recompose the SAME moment for a phone screen — do NOT invent a different scene
- Keep the emotional focal point (child + animal interaction) in the lower two-thirds
- Leave softer, darker negative space in the upper third for white headline text overlay
- Slightly closer crop than desktop — intimate, immersive
- Natural warm light, shallow depth of field, professional editorial photography
- Rich forest greens and warm skin tones, subtle vignette
- NO text, NO logos, NO watermarks, NO frames
- Photorealistic, authentic, family-friendly`;

function extractImageBase64(data) {
  if (data.output_image?.data) return data.output_image.data;
  for (const step of data.steps ?? []) {
    if (!Array.isArray(step.content)) continue;
    for (const part of step.content) {
      if (part.type === "image" && part.data) return part.data;
    }
  }
  return null;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Ustaw GEMINI_API_KEY");
    process.exit(1);
  }

  const heroBuf = await readFile(DESKTOP_HERO);
  const input = [
    { type: "text", text: PROMPT },
    {
      type: "image",
      mime_type: "image/png",
      data: heroBuf.toString("base64"),
    },
  ];

  console.log("→ hero-encounter-mobile (9:16, ref: desktop hero)…");

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          model: MODEL,
          input,
          response_format: {
            type: "image",
            mime_type: "image/jpeg",
            aspect_ratio: "9:16",
            image_size: "2K",
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${JSON.stringify(data).slice(0, 500)}`);

      const base64 = extractImageBase64(data);
      if (!base64) throw new Error(`no image — status: ${data.status}`);

      await writeFile(OUT_PATH, Buffer.from(base64, "base64"));
      console.log(`OK → ${OUT_PATH}`);
      return;
    } catch (err) {
      console.log(`próba ${attempt} błąd: ${err.message}`);
      if (attempt < 3) await new Promise((r) => setTimeout(r, 5000));
    }
  }

  process.exit(1);
}

main();
