#!/usr/bin/env node
/**
 * Generate egZOOturystyka illustrations via Gemini Nano Banana 2.
 * Usage: GEMINI_API_KEY=... node scripts/generate-illustrations.mjs
 */

import { readFile, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public/images/illustrations");
const REF_DIR = path.join(OUT_DIR, "references");
const API_URL = "https://generativelanguage.googleapis.com/v1beta/interactions";
const MODEL = "gemini-3.1-flash-image";

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
    id: "animal-caiman",
    skipIfExists: false,
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a NEW animal portrait in the same series as the references.

Subject: Spectacled caiman (Caiman crocodilus) — small juvenile, resting calmly on a mossy log, three-quarter view facing slightly left, calm observant reptilian eyes, detailed scales rendered with ink and watercolor.

Composition: centered portrait inside the identical framed border system as references. Optional subtle forest-green watercolor wash behind the neck area, same technique as the caracal reference.`,
  },
  {
    id: "animal-goat",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a NEW animal portrait in the same series.

Subject: Friendly dwarf goat with small curved horns, three-quarter portrait, gentle approachable expression, soft cream and brown fur with ink fur texture.

Composition: centered inside identical framed border. Warm, inviting mood suitable for family zoo.`,
  },
  {
    id: "animal-rabbit",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a NEW animal portrait in the same series.

Subject: Lop-eared domestic rabbit sitting calmly, three-quarter portrait, soft fluffy fur in gray and white tones, gentle dark eyes, pink nose.

Composition: centered inside identical framed border. Sweet but dignified scientific illustration mood.`,
  },
  {
    id: "animal-snake",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a NEW animal portrait in the same series.

Subject: California kingsnake (Lampropeltis getula) coiled in an elegant S-shape, detailed scale pattern in bands of cream and brown-black, alert but calm expression.

Composition: centered inside identical framed border. Educational, non-threatening presentation.`,
  },
  {
    id: "mascot-lemur",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a friendly mascot version based on the ring-tailed lemur reference style.

Subject: The same lemur character standing upright on hind legs, holding a small brass explorer magnifying glass in one paw, wearing a tiny leather naturalist satchel strap across the chest, warm welcoming expression, full body visible below the frame if needed.

Mood: charming storybook naturalist guide for children and families. Keep the same frame and botanical corners as references.`,
  },
  {
    id: "divider-branches",
    useRefs: true,
    aspect_ratio: "21:9",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Create a wide horizontal ornamental section divider for a website.

Design: delicate symmetrical horizontal garland of intertwined oak branches, fern fronds and small wildflowers in the same botanical illustration style as the corner ornaments. Two tiny animal paw prints in the center. Generous empty cream parchment space above and below the ornament band (70% of image should be empty background).

No frame border — this is a divider strip only.`,
  },
  {
    id: "offer-family",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "1K",
    prompt: `${STYLE_BRIEF}

Create a small circular emblem badge illustration.

Subject: Silhouette scene of a parent and child gently feeding a small goat, simplified but elegant, inside a thin antique gold ring border circle.

For use as an icon on a website offer card.`,
  },
  {
    id: "offer-birthday",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "1K",
    prompt: `${STYLE_BRIEF}

Create a small circular emblem badge illustration.

Subject: A rabbit wearing a tiny party hat beside a small rustic birthday cake decorated with tiny animal footprint marks. Inside thin antique gold ring border circle.

Festive but refined, same illustration style.`,
  },
  {
    id: "offer-school",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "1K",
    prompt: `${STYLE_BRIEF}

Create a small circular emblem badge illustration.

Subject: Open biology field notebook with a brass magnifying glass and a small lizard perched on the page. Inside thin antique gold ring border circle.

Educational, scholarly mood.`,
  },
  {
    id: "fact-butterfly",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "512",
    prompt: `${STYLE_BRIEF}

Tiny simple centered icon of a butterfly with detailed wings, minimal composition on cream parchment, no frame, for a fun-fact strip on website.`,
  },
  {
    id: "fact-touch",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "512",
    prompt: `${STYLE_BRIEF}

Tiny simple centered icon of a human hand gently touching a small animal paw, minimal composition on cream parchment, no frame.`,
  },
  {
    id: "fact-magnifier",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "512",
    prompt: `${STYLE_BRIEF}

Tiny simple centered icon of a brass magnifying glass over a leaf with visible veins, minimal composition on cream parchment, no frame.`,
  },
  {
    id: "fact-journal",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "512",
    prompt: `${STYLE_BRIEF}

Tiny simple centered icon of an open field journal with quill pen and feather, minimal composition on cream parchment, no frame.`,
  },
  {
    id: "diploma-template",
    useRefs: true,
    aspect_ratio: "3:4",
    image_size: "4K",
    prompt: `${STYLE_BRIEF}

Ornate children's certificate template illustration.

Design: decorative border of leaves, paw prints, and small animals (lemur, goat, rabbit) in corners. Large completely empty blank cream center area for custom text overlay later. Gold wax-seal style circular emblem at bottom center WITHOUT any letters or words.

Portrait orientation certificate layout.`,
  },
  {
    id: "gift-voucher",
    useRefs: true,
    aspect_ratio: "16:9",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Elegant gift voucher background illustration, horizontal layout.

Design: ornamental botanical frame border. Ring-tailed lemur peeking playfully from left edge, caracal peeking from right edge. Large empty cream center area for text overlay. Subtle gold flourishes. Premium gift card aesthetic.`,
  },
  {
    id: "map-route",
    useRefs: true,
    aspect_ratio: "4:3",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Whimsical hand-drawn vintage map illustration.

Design: winding country road from a simplified city skyline silhouette (bottom left, generic, NOT labeled) to a cozy small farm with tiny animals and a barn (top right). Rolling hills, trees, fields. Small car icon on the road. Dashed route line with arrow. Old cartography aesthetic with compass rose decoration.

NO city names, NO labels, NO text of any kind.`,
  },
  {
    id: "corner-flourish",
    useRefs: true,
    aspect_ratio: "1:1",
    image_size: "1K",
    prompt: `${STYLE_BRIEF}

Decorative corner flourish for website hero section.

Design: fern leaves, wildflowers and a curled ring-tailed lemur tail in bottom-right corner area. Asymmetrical, fading into empty cream parchment space. No full frame — corner ornament only.`,
  },
  {
    id: "hero-texture",
    useRefs: true,
    aspect_ratio: "16:9",
    image_size: "2K",
    prompt: `${STYLE_BRIEF}

Very subtle website hero background texture.

Design: soft cream parchment with extremely faint botanical sketches and leaf silhouettes at 10-15% opacity. Large calm empty center. Atmospheric, not busy. No animals in center focal area.`,
  },
];

async function loadRefs() {
  const files = ["style-caracal.jpg", "style-lemur.jpg"];
  const refs = [];
  for (const file of files) {
    const p = path.join(REF_DIR, file);
    const buf = await readFile(p);
    refs.push({
      type: "image",
      mime_type: "image/jpeg",
      data: buf.toString("base64"),
    });
  }
  return refs;
}

function parseOnlyArg() {
  const arg = process.argv.find((a) => a.startsWith("--only="));
  if (!arg) return null;
  return new Set(
    arg
      .replace("--only=", "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
  );
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
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

async function generateAsset(apiKey, asset, refs) {
  const input = [{ type: "text", text: asset.prompt }];
  if (asset.useRefs) {
    input.push(...refs);
  }

  const body = {
    model: MODEL,
    input,
    response_format: {
      type: "image",
      mime_type: "image/jpeg",
      aspect_ratio: asset.aspect_ratio,
      image_size: asset.image_size,
    },
  };

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} — ${JSON.stringify(data).slice(0, 600)}`);
  }

  const base64 = extractImageBase64(data);
  if (!base64) {
    throw new Error(`no image in response — status: ${data.status}`);
  }

  const outPath = path.join(OUT_DIR, `${asset.id}.jpg`);
  await writeFile(outPath, Buffer.from(base64, "base64"));
  return outPath;
}

async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("Ustaw GEMINI_API_KEY");
    process.exit(1);
  }

  const only = parseOnlyArg();
  const queue = only ? ASSETS.filter((a) => only.has(a.id)) : ASSETS;

  if (queue.length === 0) {
    console.error("Brak assetów. --only=id1,id2");
    process.exit(1);
  }

  await mkdir(OUT_DIR, { recursive: true });
  const refs = await loadRefs();

  console.log(`Model: ${MODEL}`);
  console.log(`Referencje: ${refs.length} obrazów`);
  console.log(`Kolejka: ${queue.length} assetów\n`);

  let ok = 0;
  let fail = 0;

  for (const asset of queue) {
    const outPath = path.join(OUT_DIR, `${asset.id}.jpg`);
    if (await fileExists(outPath)) {
      console.log(`⊘ ${asset.id} — już istnieje, pomijam`);
      ok++;
      continue;
    }

    process.stdout.write(`→ ${asset.id} (${asset.aspect_ratio}, ${asset.image_size})… `);

    let attempts = 0;
    let success = false;
    while (attempts < 3 && !success) {
      attempts++;
      try {
        const saved = await generateAsset(apiKey, asset, refs);
        console.log(`OK (${attempts > 1 ? `próba ${attempts}` : "1. próba"})`);
        console.log(`  ${saved}`);
        ok++;
        success = true;
      } catch (err) {
        if (attempts >= 3) {
          console.log("BŁĄD");
          console.error(`  ${err.message}`);
          fail++;
        } else {
          console.log(`retry ${attempts}…`);
          await new Promise((r) => setTimeout(r, 5000));
        }
      }
    }

    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log(`\nGotowe: ${ok} OK, ${fail} błędów`);
  if (fail > 0) process.exit(1);
}

main();
