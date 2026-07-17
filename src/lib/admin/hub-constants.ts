/** Domyślne godziny — nadpisywane w booking_settings.time_slots */
export const DEFAULT_BOOKING_TIME_SLOTS = [
  "10:00",
  "12:00",
  "14:00",
  "16:00",
  "18:00",
] as const;

/** @deprecated użyj getBookingSettings().timeSlots */
export const BOOKING_TIME_SLOTS = DEFAULT_BOOKING_TIME_SLOTS;

/** Importuj w middleware — bez `"use server"`. */
export const ADMIN_HUB_COOKIE = "admin_hub_session";

export const ADMIN_HUB_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
