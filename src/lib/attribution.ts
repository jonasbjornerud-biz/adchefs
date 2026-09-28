const KEY = "adchefs_attribution";

export type Attribution = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  landing_page: string;
  referrer: string;
};

/** Capture UTM params, landing page and referrer on the first visit of the session. */
export function captureAttribution() {
  try {
    if (sessionStorage.getItem(KEY)) return;
    const p = new URLSearchParams(window.location.search);
    const data: Attribution = {
      utm_source: p.get("utm_source") ?? "",
      utm_medium: p.get("utm_medium") ?? "",
      utm_campaign: p.get("utm_campaign") ?? "",
      landing_page: window.location.href,
      referrer: document.referrer ?? "",
    };
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
}

export function getAttribution(): Attribution {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    landing_page: window.location.href,
    referrer: document.referrer ?? "",
  };
}
