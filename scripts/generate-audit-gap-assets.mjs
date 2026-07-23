#!/usr/bin/env node
/**
 * Nano Banana 2 Pro — grafiki z luk audytu PDF:
 * spis karmienia, czytelne zaproszenie, ikona oferty (alpaka), portrety edukatorów.
 *
 * Usage:
 *   GEMINI_API_KEY=... node scripts/generate-audit-gap-assets.mjs
 *   GEMINI_API_KEY=... node scripts/generate-audit-gap-assets.mjs feeding-schedule
 */
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ILLUSTRATIONS = path.join(ROOT, "public/images/illustrations");
const IMAGES = path.join(ROOT, "public/images");
const REF_DIR = path.join(ILLUSTRATIONS, "references");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";

const MODELS = [
  "gemini-3-pro-image",
  "gemini-3-pro-image-preview",
  "gemini-3.1-flash-image",
];

const STYLE_JOURNAL = `Match EXACTLY the visual language of the attached reference illustrations for egZOOturystyka mini zoo brand:
- aged cream parchment paper texture (#faf8f4), subtle tea-stain edges
- thin hand-drawn double-line rectangular frame
- botanical corner ornaments: yellow five-petal flowers with brown centers and muted olive-green leaf sprigs
- fine black ink linework with soft translucent watercolor washes
- muted earthy palette: sandy tans, forest green (#2f3a26), antique gold (#b8924a)
- 19th-century natural history field journal aesthetic
- hand-painted organic feel, NOT photorealistic UI chrome, NOT digital flat design`;

const ASSETS = [
  {
    id: "feeding-schedule",
    outDir: ILLUSTRATIONS,
    useRefs: true,
    aspect_ratio: "3:4",
    image_size: "2K",
    prompt: `${STYLE_JOURNAL}

Create a printable children's CERTIFICATE / FEEDING CHECKLIST card for a Polish mini zoo visit (egZOOturystyka).

Portrait 3:4 layout. Sharp, highly readable Polish typography in dark ink on cream — premium hand-lettered serif for the title, clean readable body text.

TOP title (exact): "SPIS KARMIENIA"
Subtitle (exact): "Mały odkrywca · egZOOturystyka"

Center: spacious checklist with checkboxes and ruled lines, generous margins, not crowded. Exact Polish lines:
"□ Karakal — poranna porcja"
"□ Lemur katta — owoce"
"□ Krokodyl krótkopyski — pod nadzorem opiekuna"
"□ Alpaka — siano / smakołyk"
"□ Królik — warzywa"
"□ Wąż królewski — tylko z edukatorem"

Bottom fields:
"Imię odkrywcy: ____________________"
"Data: __________"

Small gold wax seal at bottom-center WITHOUT letters.
Tiny peeking corner animals only: lemur, alpaca, rabbit — NO goat, NO detective costume, NO hats on animals, NO watermark, NO English text.`,
  },
  {
    id: "birthday-invitation",
    outDir: ILLUSTRATIONS,
    useRefs: true,
    aspect_ratio: "3:4",
    image_size: "2K",
    prompt: `${STYLE_JOURNAL}

Create a CLEAN, HIGHLY READABLE children's birthday INVITATION card for Polish mini zoo egZOOturystyka. Must be printable and clear at A5/A6 size.

Portrait 3:4. Large center reserved for typography (≥55%). High-contrast dark ink on cream. Delicate botanical frame only at edges. Tiny corner animals only (lemur, alpaca, small crocodile) — do NOT crowd the center.

Exact Polish text (perfect spelling, sharp letters):
"Zaproszenie na urodziny"
"Jestem … i zapraszam Cię na moje przyjęcie w mini zoo!"
Then underlined fields:
"Imię solenizanta: ____________________"
"Dzień: ____________________"
"Godzina: ____________________"
"Miejsce: egZOOturystyka"
"Adres: Sadków 20B, 56-410 Sadków"
Bottom small line: "Prosimy o potwierdzenie przybycia"

Optional tiny blank gold wax seal without letters.
NO detective lemur, NO fox required, NO watermark, NO English.`,
  },
  {
    id: "offer-family",
    outDir: ILLUSTRATIONS,
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_JOURNAL}

Create a square circular medallion icon for a FAMILY VISIT package.

Inside a thin gold-ring circle on cream parchment: watercolor silhouette scene of a parent and child gently interacting with an ALPACA (Vicugna pacos) — soft fleece, long neck. Warm, inviting family-zoo mood.

This is NOT a goat and NOT a lamb. Absolutely NO text, NO labels, NO watermark. Animals without hats or glasses.`,
  },
  {
    id: "educator-filip",
    outDir: IMAGES,
    useRefs: false,
    aspect_ratio: "3:4",
    image_size: "2K",
    prompt: `Photorealistic vertical portrait photograph for a premium Polish mini-zoo website.

Subject: friendly Caucasian male wildlife educator, about 38–42 years old, short brown hair, light stubble, warm natural smile. Outdoor woodland animal enclosure in soft daylight. He carefully holds a calm non-venomous snake (corn snake or king snake) with both hands, demonstrating educational handling.

Clothing: olive utility vest over khaki shirt, practical field look.
Camera: 85mm portrait lens feel, shallow depth of field, authentic documentary photography, natural color grade with forest greens and warm earth tones.
NO text, NO logos, NO watermark, NO cartoon style, NO costume hat, NO detective outfit.`,
  },
  {
    id: "educator-patrycja",
    outDir: IMAGES,
    useRefs: false,
    aspect_ratio: "3:4",
    image_size: "2K",
    prompt: `Photorealistic vertical portrait photograph for a premium Polish mini-zoo website.

Subject: friendly Caucasian female animal caretaker, about 32–38 years old, light-brown wavy hair tied loosely, warm smile. Outdoor enclosure in soft daylight. She gently holds a calm rabbit against her olive/khaki zookeeper vest.

Camera: 85mm portrait lens feel, shallow depth of field, authentic documentary photography, natural color grade matching forest greens and warm earth tones.
Must look DISTINCT from any male educator portrait.
NO text, NO logos, NO watermark, NO cartoon style.`,
  },
];

async function loadApiKey() {
  if (process.env.GEMINI_API_KEY?.trim()) return process.env.GEMINI_API_KEY.trim();
  for (const file of [
    path.join(ROOT, ".env.local"),
    path.join(ROOT, "../manofaktura/.env.local"),
  ]) {
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
    try {
      const buf = await readFile(path.join(REF_DIR, name));
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
      await mkdir(asset.outDir, { recursive: true });
      const outPath = path.join(asset.outDir, `${asset.id}.jpg`);
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
  const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const apiKey = await loadApiKey();
  if (!apiKey) {
    console.error("Brak GEMINI_API_KEY");
    process.exit(1);
  }

  const refs = await loadRefs();
  const list = only.length
    ? ASSETS.filter((a) => only.includes(a.id))
    : ASSETS;

  if (!list.length) {
    console.error(`Nie znaleziono assetów. Dostępne: ${ASSETS.map((a) => a.id).join(", ")}`);
    process.exit(1);
  }

  console.log(`Referencje: ${refs.length}`);
  console.log(`Modele: ${MODELS.join(" → ")}`);
  console.log(`Assety: ${list.map((a) => a.id).join(", ")}\n`);

  let ok = 0;
  let fail = 0;
  for (const asset of list) {
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
