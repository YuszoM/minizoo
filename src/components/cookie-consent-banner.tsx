"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  COOKIE_BANNER_BODY,
  COOKIE_BANNER_NOTE,
  COOKIE_BANNER_TITLE,
  COOKIE_BTN_ACCEPT_ALL,
  COOKIE_BTN_NECESSARY_ONLY,
} from "@/lib/cookies/cookie-consent-copy";
import {
  buildConsentState,
  COOKIE_CONSENT_KEY,
  parseConsentState,
  type CookieConsentLevel,
} from "@/lib/cookies/consent";

function setConsentStorage(level: CookieConsentLevel) {
  const state = buildConsentState(level);
  const encoded = JSON.stringify(state);
  localStorage.setItem(COOKIE_CONSENT_KEY, encoded);
  document.cookie = `${COOKIE_CONSENT_KEY}=${encodeURIComponent(encoded)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("mz-cookie-consent-change", { detail: state }));
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const localValue = parseConsentState(localStorage.getItem(COOKIE_CONSENT_KEY));
    const cookieRaw = document.cookie
      .split(";")
      .map((part) => part.trim())
      .find((part) => part.startsWith(`${COOKIE_CONSENT_KEY}=`))
      ?.split("=")
      .slice(1)
      .join("=");
    const cookieValue = parseConsentState(
      cookieRaw
        ? (() => {
            try {
              return decodeURIComponent(cookieRaw);
            } catch {
              return cookieRaw;
            }
          })()
        : null,
    );
    const hasConsent = Boolean(localValue || cookieValue);
    setVisible(!hasConsent);
  }, []);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      style={{ position: "fixed", inset: 0, zIndex: 2147483647 }}
      className="flex items-center justify-center bg-forest/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-banner-title"
    >
      <div className="w-full max-w-lg rounded-2xl border border-paper-deep bg-paper p-6 text-ink shadow-2xl">
        <div>
          <h3 id="cookie-banner-title" className="font-display text-xl font-semibold text-forest">
            {COOKIE_BANNER_TITLE}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">{COOKIE_BANNER_BODY}</p>
          <p className="mt-2 text-xs text-ink-muted">
            <Link href="/polityka-prywatnosci" className="text-link">
              Polityka prywatności
            </Link>
            {" · "}
            <Link href="/regulamin" className="text-link">
              Regulamin
            </Link>
          </p>
          <p className="mt-2 text-xs text-ink-muted">{COOKIE_BANNER_NOTE}</p>
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              setConsentStorage("all");
              setVisible(false);
            }}
            className="btn-gold flex-1 text-sm"
          >
            {COOKIE_BTN_ACCEPT_ALL}
          </button>
          <button
            type="button"
            onClick={() => {
              setConsentStorage("necessary");
              setVisible(false);
            }}
            className="btn-primary flex-1 text-sm"
          >
            {COOKIE_BTN_NECESSARY_ONLY}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
