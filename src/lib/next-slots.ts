/** Najbliższe wolne terminy (demo — w produkcji z API/kalendarza). */
export function getUpcomingSlots(count = 3) {
  const slots: { label: string; time: string; available: boolean }[] = [];
  const now = new Date();
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const formatter = new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  const times = ["10:00", "12:00", "14:00", "16:00"];
  let day = new Date(todayStart);

  while (slots.length < count) {
    day.setDate(day.getDate() + 1);
    const dow = day.getDay();
    if (dow === 1) continue;

    const dateLabel = formatter.format(day);
    for (const time of times) {
      if (slots.length >= count) break;
      slots.push({ label: dateLabel, time, available: true });
    }
  }

  return slots;
}
