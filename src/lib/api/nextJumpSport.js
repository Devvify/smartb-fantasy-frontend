const SPORT_IDS = [4, 8, 9, 10, 12];
const LIMIT = 48;
const API_BASE = "https://au.testing.smartb.com.au/api/nextJumpSport";

export async function fetchNextJumpSport({ type, timezone = "Asia/Dhaka", signal }) {
  const url =
    `${API_BASE}` +
    `?sportId=${SPORT_IDS.join(",")}` +
    `&timezone=${timezone}` +
    `&type=${type}` +
    `&limit=${LIMIT}` +
    `&MeetingState=` +
    `&status=`;

  const res = await fetch(url, {
    method: "GET",
    signal,
    cache: "no-store",
    // ✅ DO NOT include credentials unless the API explicitly supports it
    // credentials: "include",
    // ✅ Keep headers minimal; Accept is fine
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`nextJumpSport failed (${res.status}) ${text}`);
  }

  const data = await res.json();
  return Array.isArray(data?.result) ? data.result : [];
}
