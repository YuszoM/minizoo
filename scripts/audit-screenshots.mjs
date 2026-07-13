import { chromium, devices } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE = process.env.AUDIT_URL || "https://minizoo.duodev.pl";
const OUT = path.join(process.cwd(), process.env.AUDIT_OUT || "audit-screenshots");

const routes = [
  { name: "home", path: "/" },
  { name: "oferta", path: "/oferta" },
  { name: "o-miejscu", path: "/o-miejscu" },
  { name: "zwierzeta", path: "/zwierzeta" },
  { name: "rezerwacja", path: "/rezerwacja" },
  { name: "opinie", path: "/opinie" },
  { name: "faq", path: "/faq" },
  { name: "kontakt", path: "/kontakt" },
];

const viewports = [
  { label: "desktop", width: 1440, height: 900, isMobile: false },
  { label: "mobile", ...devices["iPhone 13"], isMobile: true },
];

async function auditPage(page, url, name, viewport) {
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);

  const dir = path.join(OUT, viewport.label);
  fs.mkdirSync(dir, { recursive: true });

  // Above the fold
  await page.screenshot({
    path: path.join(dir, `${name}-top.png`),
  });

  // Full page
  await page.screenshot({
    path: path.join(dir, `${name}-full.png`),
    fullPage: true,
  });

  // Contrast probe: header link colors
  const headerProbe = await page.evaluate(() => {
    const header = document.querySelector("header");
    const navLink = document.querySelector('header nav a, header a[href="/oferta"]');
    const h1 = document.querySelector("main h1");
    const logoText = document.querySelector('header a[href="/"] p');

    const style = (el) => {
      if (!el) return null;
      const cs = getComputedStyle(el);
      const headerEl = el.closest("header");
      const bg = headerEl ? getComputedStyle(headerEl) : cs;
      return {
        color: cs.color,
        background: bg.backgroundColor,
        text: el.textContent?.trim().slice(0, 40),
      };
    };

    return {
      header: style(header),
      navLink: style(navLink),
      h1: style(h1),
      logoText: style(logoText),
    };
  });

  return { name, viewport: viewport.label, headerProbe };
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const results = [];

  for (const vp of viewports) {
    const context = await browser.newContext(
      vp.isMobile
        ? { ...devices["iPhone 13"] }
        : { viewport: { width: vp.width, height: vp.height } },
    );
    const page = await context.newPage();

    for (const route of routes) {
      const url = `${BASE}${route.path}`;
      console.log(`Screenshot ${vp.label}: ${route.name}`);
      const probe = await auditPage(page, url, route.name, vp);
      results.push(probe);
    }

    await context.close();
  }

  await browser.close();

  fs.writeFileSync(path.join(OUT, "contrast-probe.json"), JSON.stringify(results, null, 2));
  console.log(`Done. Screenshots in ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
