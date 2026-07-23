#!/usr/bin/env node
/**
 * Desktop screenshots of live minizoo for PDF audit comparison.
 */
import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const BASE = process.env.SITE_URL || "https://minizoo.duodev.pl";
const OUT = process.env.OUT_DIR || "/tmp/minizoo-audit-screens/live";

async function dismissCookies(page) {
  const btn = page.getByRole("button", { name: /Akceptuję|Tylko niezbędne/i }).first();
  try {
    await btn.waitFor({ timeout: 4000 });
    await btn.click();
    await page.waitForTimeout(400);
  } catch {
    /* no banner */
  }
}

async function shot(page, name, opts = {}) {
  const file = path.join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: !!opts.fullPage, animations: "disabled" });
  console.log("saved", file);
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
  });

  page.setDefaultTimeout(45000);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await dismissCookies(page);
  await page.waitForTimeout(800);

  await shot(page, "01-home-hero-viewport");
  await shot(page, "01-home-full", { fullPage: true });

  // Section anchors via scroll into view of headings
  const sections = [
    ["02-trust-funfacts", "text=max 6"],
    ["03-offers", "text=Trzy sposoby na spotkanie"],
    ["04-animals", "text=Mieszkańcy, których poznasz"],
    ["05-educators", "text=Poznaj swojego przewodnika"],
    ["06-before-visit", "text=Przed wizytą"],
    ["08-birthday-invite", "text=Zaproszenia na urodziny"],
    ["09-faq", "text=Najczęstsze pytania"],
  ];

  for (const [name, sel] of sections) {
    try {
      const loc = page.locator(sel).first();
      await loc.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await shot(page, name);
    } catch (err) {
      console.warn("skip", name, err.message);
    }
  }

  await page.goto(`${BASE}/oferta`, { waitUntil: "networkidle" });
  await dismissCookies(page);
  await shot(page, "10-oferta-full", { fullPage: true });

  await page.goto(`${BASE}/zwierzeta`, { waitUntil: "networkidle" });
  await dismissCookies(page);
  await shot(page, "11-zwierzeta-full", { fullPage: true });

  await page.goto(`${BASE}/faq`, { waitUntil: "networkidle" });
  await dismissCookies(page);
  await shot(page, "12-faq-full", { fullPage: true });

  await browser.close();
  console.log("done", OUT);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
