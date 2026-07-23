#!/usr/bin/env node
/**
 * Nano Banana 2 Pro — aktualizacje grafiki po feedbacku klientki:
 * alpaka, krokodyl krótkopyski, czytelniejsze zaproszenie urodzinowe.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/generate-pdf-asset-updates.mjs
 */
import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/illustrations");
const REF_DIR = path.join(OUT_DIR, "references");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

/** Nano Banana 2 Pro (+ fallbacki) */
const MODELS = [
  "gemini-3-pro-image",
  "gemini-3-pro-image-preview",
  "gemini-3.1-flash-image",
];

const STYLE_BRIEF = `Match EXACTLY the visual language of the attached reference illustrations for egZOOturystyka mini zoo brand:
- aged cream parchment paper texture (#faf8f4), subtle tea-stain edges
- thin hand-drawn double-line rectangular frame
- identical botanical corner ornaments: yellow five-petal flowers with brown centers and muted olive-green leaf sprigs in alternating corners
- fine black ink linework combined with soft translucent watercolor washes
- muted earthy palette: sandy tans, forest green (#2f3a26), antique gold (#b8924a) accents
- 19th-century natural history field journal / scientific atlas aesthetic
- hand-painted organic feel, NOT photorealistic, NOT digital-looking
- absolutely NO text, NO labels, NO watermark, NO logos`;

const ASSETS = [
  {
    id: "animal-alpaca",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a NEW animal portrait in the same series as the references.

Subject: Alpaca (Vicugna pacos) — friendly three-quarter portrait, soft cream and light-brown fleece, calm curious expression, long neck, fluffy bangs over gentle eyes.

Composition: centered portrait inside the identical framed border system as references. Warm, inviting family-zoo mood. NO goat.`,
  },
  {
    id: "animal-krokodyl",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a NEW animal portrait in the same series as the references.

Subject: African dwarf crocodile / short-snouted crocodile (Osteolaemus tetraspis) — small stocky crocodile with a short blunt snout, dark olive-brown scales, calm observant eyes, resting on a mossy log, three-quarter view.

This is NOT a spectacled caiman and NOT a Nile crocodile — short snout, compact body, African dwarf crocodile look.

Composition: centered inside identical framed border. Educational, non-threatening presentation.`,
  },
  {
    id: "zaproszenie-urodzinowe",
    useRefs: true,
    aspect_ratio: "3:4",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a CLEAN, READABLE children's birthday invitation BACKGROUND for a mini zoo party (egZOOturystyka).

Layout: portrait card. Large EMPTY cream center area (at least 55% of the card) reserved for later text overlay — completely blank parchment in the middle.
Decorative botanical frame and corner ornaments only at the edges.
Tiny peeking animals only in corners or edges (lemur, alpaca ear, or small crocodile silhouette) — do NOT crowd the center.
Optional small gold wax-seal style circle at bottom WITHOUT letters.

Must feel clearer and less busy than a dense certificate. Absolutely NO text, NO letters, NO numbers, NO logos.`,
  },
];

async function loadApiKey() {
  if (process.env.GEMINI_API_KEY?.trim()) return process.env.GEMINI_API_KEY.trim();
  const candidates = [
    path.join(ROOT, ".env.local"),
    path.join(ROOT, "../manofaktura/.env.local"),
  ];
  for (const file of candidates) {
    try {
      const raw = await readFile(file, "utf8");
      const m = raw.match(/^GEMINI_API_KEY=(.+)$/m);
      if (m) return m[1].trim().replace(/^["']|["']$/g, "");
    } catch {
      /* continue */
    }
  }
  return null;
}

async function loadRefs() {
  const refs = [];
  for (const name of ["style-caracal.jpg", "style-lemur.jpg"]) {
    const p = path.join(REF_DIR, name);
    try {
      const buf = await readFile(p);
      refs.push({
        type: "image",
        mime_type: "image/jpeg",
        data: buf.toString("base64"),
      });
    } catch {
      console.warn(`Brak referencji: ${name}`);
    }
  }
  return refs;
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

async function generateWithModel(apiKey, model, asset, refs) {
  const input = [{ type: "text", text: asset.prompt }];
  if (asset.useRefs) input.push(...refs);

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      model,
      input,
      response_format: {
        type: "image",
        mime_type: "image/jpeg",
        aspect_ratio: asset.aspect_ratio,
        image_size: asset.image_size,
      },
    }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${JSON.stringify(data).slice(0, 500)}`);
  }
  const base64 = extractImageBase64(data);
  if (!base64) throw new Error(`no image — status: ${data.status}`);
  return base64;
}

async function generateAsset(apiKey, asset, refs) {
  let lastErr;
  for (const model of MODELS) {
    try {
      const base64 = await generateWithModel(apiKey, model, asset, refs);
      const outPath = path.join(OUT_DIR, `${asset.id}.jpg`);
      await writeFile(outPath, Buffer.from(base64, "base64"));
      return { outPath, model };
    } catch (err) {
      lastErr = err;
      console.warn(`  ⚠ ${model}: ${err.message}`);
    }
  }
  throw lastErr || new Error("all models failed");
}

async function main() {
  const apiKey = await loadApiKey();
  if (!apiKey) {
    console.error("Brak GEMINI_API_KEY");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const refs = await loadRefs();
  console.log(`Referencje: ${refs.length}`);
  console.log(`Modele: ${MODELS.join(" → ")}\n`);

  let ok = 0;
  let fail = 0;
  for (const asset of ASSETS) {
    process.stdout.write(`→ ${asset.id}… `);
    try {
      const { outPath, model } = await generateAsset(apiKey, asset, refs);
      console.log(`OK (${model})`);
      console.log(`  ${outPath}`);
      ok++;
    } catch (err) {
      console.log("BŁĄD");
      console.error(`  ${err.message}`);
      fail++;
    }
  }

  console.log(`\nGotowe: ${ok} OK, ${fail} błędów`);
  process.exit(fail ? 1 : 0);
}

main();
