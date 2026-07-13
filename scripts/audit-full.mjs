/**
 * Pełny audyt UI/UX + animacje — Playwright na produkcji.
 * AUDIT_URL=https://minizoo.duodev.pl node scripts/audit-full.mjs
 */
import { chromium, devices } from "@playwright/test";
import fs from "fs";
import path from "path";

const BASE = process.env.AUDIT_URL || "https://minizoo.duodev.pl";
const OUT = path.join(process.cwd(), process.env.AUDIT_OUT || "audit-full");

const routes = [
  { name: "home", path: "/" },
  { name: "oferta", path: "/oferta" },
  { name: "o-miejscu", path: "/o-miejscu" },
  { name: "zwierzeta", path: "/zwierzeta" },
  { name: "rezerwacja", path: "/rezerwacja" },
  { name: "opinie", path: "/opinie" },
  { name: "faq", path: "/faq" },
  { name: "kontakt", path: "/kontakt" },
  { name: "404", path: "/nie-ma-takiej-strony" },
];

const report = {
  base: BASE,
  generatedAt: new Date().toISOString(),
  pages: {},
  animations: {},
  smoke: {},
};

async function checkAnimations(page) {
  const result = {};

  // 1. Hero entrance classes present
  result.heroEnter = await page.evaluate(() => {
    const els = document.querySelectorAll('[class*="hero-enter-"]');
    return {
      count: els.length,
      firstOpacity: els[0] ? getComputedStyle(els[0]).opacity : null,
    };
  });

  // 2. Ken burns on hero image
  result.kenBurns = await page.evaluate(() => {
    const el = document.querySelector(".hero-ken-burns");
    if (!el) return { present: false };
    const cs = getComputedStyle(el);
    return {
      present: true,
      animationName: cs.animationName,
      transform: cs.transform.slice(0, 60),
    };
  });

  // 3. Reveal elements — state before scroll
  const beforeScroll = await page.evaluate(() => {
    const els = [...document.querySelectorAll(".reveal-el")];
    return {
      total: els.length,
      hidden: els.filter((e) => e.classList.contains("reveal-el--hidden")).length,
      active: els.filter((e) => e.classList.contains("reveal-el--active")).length,
      hiddenOpacityZero: els
        .filter((e) => e.classList.contains("reveal-el--hidden"))
        .filter((e) => getComputedStyle(e).opacity === "0").length,
    };
  });
  result.revealBeforeScroll = beforeScroll;

  // 4. Scroll to bottom in steps, then re-check
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y <= h; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
  });
  await page.waitForTimeout(1200);

  result.revealAfterScroll = await page.evaluate(() => {
    const els = [...document.querySelectorAll(".reveal-el")];
    const stillHidden = els.filter(
      (e) =>
        e.classList.contains("reveal-el--hidden") ||
        getComputedStyle(e).opacity === "0",
    );
    return {
      total: els.length,
      active: els.filter((e) => e.classList.contains("reveal-el--active")).length,
      stillHidden: stillHidden.length,
      stillHiddenSample: stillHidden.slice(0, 3).map((e) => e.className.slice(0, 80)),
    };
  });

  // 5. Lenis smooth scroll active
  result.lenis = await page.evaluate(() => ({
    htmlClass: document.documentElement.className,
    lenisActive: document.documentElement.classList.contains("lenis"),
  }));

  // 6. Card hover transitions declared
  result.cardHover = await page.evaluate(() => {
    const el = document.querySelector(".card-hover");
    if (!el) return { present: false };
    return { present: true, transition: getComputedStyle(el).transitionProperty };
  });

  return result;
}

async function smokeChecks(page) {
  return page.evaluate(() => {
    const out = {};
    out.h1Count = document.querySelectorAll("h1").length;
    out.title = document.title;
    out.metaDescription =
      document.querySelector('meta[name="description"]')?.content?.slice(0, 120) || null;
    out.telLinks = document.querySelectorAll('a[href^="tel:"]').length;
    out.mailLinks = document.querySelectorAll('a[href^="mailto:"]').length;
    out.favicon = !!document.querySelector('link[rel*="icon"]');
    out.ogImage = !!document.querySelector('meta[property="og:image"]');
    out.imagesNoAlt = [...document.querySelectorAll("img")].filter(
      (i) => !i.hasAttribute("alt"),
    ).length;
    out.horizontalScroll =
      document.documentElement.scrollWidth > document.documentElement.clientWidth + 2;
    out.lorem = /lorem ipsum|example\.com|Firma XYZ|TODO/i.test(
      document.body.innerText.slice(0, 20000),
    );
    // Touch targets (mobile relevance) — small clickable elements
    out.smallTouchTargets = [...document.querySelectorAll("a, button")]
      .filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && (r.width < 40 || r.height < 40);
      })
      .slice(0, 8)
      .map((el) => ({
        text: (el.textContent || "").trim().slice(0, 30),
        w: Math.round(el.getBoundingClientRect().width),
        h: Math.round(el.getBoundingClientRect().height),
      }));
    return out;
  });
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { label: "desktop", context: { viewport: { width: 1440, height: 900 } } },
    { label: "mobile", context: { ...devices["iPhone 13"] } },
  ];

  for (const vp of viewports) {
    const context = await browser.newContext(vp.context);
    const page = await context.newPage();

    const consoleErrors = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text().slice(0, 200));
    });
    page.on("pageerror", (err) => consoleErrors.push(`pageerror: ${err.message.slice(0, 200)}`));

    for (const route of routes) {
      const key = `${vp.label}:${route.name}`;
      console.log(`→ ${key}`);
      const errorsBefore = consoleErrors.length;

      const resp = await page.goto(`${BASE}${route.path}`, {
        waitUntil: "networkidle",
        timeout: 60000,
      });
      await page.waitForTimeout(600);

      const dir = path.join(OUT, vp.label);
      fs.mkdirSync(dir, { recursive: true });
      await page.screenshot({ path: path.join(dir, `${route.name}-top.png`) });

      const smoke = await smokeChecks(page);
      smoke.httpStatus = resp?.status();

      let animations = null;
      if (route.name === "home") {
        animations = await checkAnimations(page);
        report.animations[vp.label] = animations;
      }

      await page.screenshot({ path: path.join(dir, `${route.name}-full.png`), fullPage: true });

      report.pages[key] = {
        ...smoke,
        consoleErrors: consoleErrors.slice(errorsBefore),
      };
    }

    await context.close();
  }

  // sitemap / robots
  const ctx2 = await browser.newContext();
  const p2 = await ctx2.newPage();
  for (const f of ["/sitemap.xml", "/robots.txt"]) {
    const r = await p2.goto(`${BASE}${f}`);
    report.smoke[f] = r?.status();
  }
  await ctx2.close();
  await browser.close();

  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(`\nRaport: ${path.join(OUT, "report.json")}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
