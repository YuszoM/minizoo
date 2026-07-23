#!/usr/bin/env node
/**
 * Nano Banana 2 Pro — hero bez kozy: dzieci + alpaka (PDF: „zamiast kozy … alpaka”).
 * GEMINI_API_KEY=... node scripts/generate-hero-alpaca.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const MODELS = [
  "gemini-3-pro-image",
  "gemini-3-pro-image-preview",
  "gemini-3.1-flash-image",
];

const DESKTOP = {
  out: path.join(ROOT, "public/images/hero-encounter.jpg"),
  aspect_ratio: "16:9",
  mime_type: "image/jpeg",
  prompt: `Photorealistic wide hero photograph for a premium Polish mini zoo website (egZOOturystyka).

Scene: warm natural daylight, small group of happy children (ages 6–10) gently meeting a calm fluffy ALPACA outdoors or in a wooden farm-style enclosure. Soft cream fleece alpaca, long neck, friendly expression. An adult educator in olive/khaki vest stands nearby guiding calmly — not posing for camera.

Mood: intimate, educational, without crowds. Forest greens, warm wood, soft golden light. Documentary editorial photography, shallow depth of field, cinematic but natural.

CRITICAL: The animal must be an ALPACA — NOT a goat, NOT a kid goat, NOT a sheep, NOT a llama with long banana ears only. Soft dense alpaca fleece.

Composition 16:9 landscape: leave darker softer left third for white headline overlay. Focal interaction in center-right.
NO text, NO logos, NO watermarks, NO UI frames, NO detective costumes.`,
};

const MOBILE = {
  out: path.join(ROOT, "public/images/hero-encounter-mobile.jpg"),
  aspect_ratio: "9:16",
  mime_type: "image/jpeg",
  prompt: `Photorealistic VERTICAL (9:16) hero photograph for Polish mini zoo egZOOturystyka mobile site.

Same mood as a family alpaca encounter: one or two children gently meeting a calm fluffy ALPACA with soft cream fleece. Educator nearby in olive vest. Warm natural light, forest greens, intimate documentary feel.

Focal point in lower two-thirds; softer darker upper third for white headline overlay.
ALPACA only — NOT a goat. NO text, NO logos, NO watermarks.`,
};

async function loadApiKey() {
  if (process.env.GEMINI_API_KEY?.trim()) return process.env.GEMINI_API_KEY.trim();
  try {
    const raw = await readFile(path.join(ROOT, ".env.local"), "utf8");
    const m = raw.match(/^GEMINI_API_KEY=(.+)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, "");
  } catch {}
  return null;
}

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

async function generate(apiKey, asset) {
  let lastErr;
  for (const model of MODELS) {
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          model,
          input: [{ type: "text", text: asset.prompt }],
          response_format: {
            type: "image",
            mime_type: asset.mime_type,
            aspect_ratio: asset.aspect_ratio,
            image_size: "2K",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status} ${JSON.stringify(data).slice(0, 300)}`);
      const b64 = extractImageBase64(data);
      if (!b64) throw new Error(`no image status=${data.status}`);
      await writeFile(asset.out, Buffer.from(b64, "base64"));
      return model;
    } catch (err) {
      lastErr = err;
      console.warn(`  ⚠ ${model}: ${err.message}`);
    }
  }
  throw lastErr;
}

async function main() {
  const apiKey = await loadApiKey();
  if (!apiKey) {
    console.error("Brak GEMINI_API_KEY");
    process.exit(1);
  }
  for (const asset of [DESKTOP, MOBILE]) {
    process.stdout.write(`→ ${path.basename(asset.out)}… `);
    const model = await generate(apiKey, asset);
    console.log(`OK (${model})`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
