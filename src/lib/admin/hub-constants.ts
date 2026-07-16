/** Importuj w middleware — bez `"use server"`. */
export const ADMIN_HUB_COOKIE = "admin_hub_session";

export const ADMIN_HUB_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export const BOOKING_TIME_SLOTS = ["10:00", "12:00", "14:00", "16:00"] as const;
