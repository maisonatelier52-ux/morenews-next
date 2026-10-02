const FALLBACK_URL = "https://www.morenews.org";

function normalizeUrl(value) {
  const candidate = value?.trim() || FALLBACK_URL;
  try {
    return new URL(candidate).origin;
  } catch {
    return FALLBACK_URL;
  }
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME?.trim() || "More News",
  url: normalizeUrl(process.env.NEXT_PUBLIC_SITE_URL),
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION?.trim() ||
    "More News delivers trusted UK journalism covering politics, business, technology, world affairs, health and sport with clear, independent reporting.",
  locale: "en_GB",
  twitter: "@More_NewsMN",
  logo: "/images/logo.webp",
  socials: {
    twitter: process.env.NEXT_PUBLIC_TWITTER_URL?.trim() || "https://x.com/More_NewsMN",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "https://www.instagram.com/more_news_7/",
    quora: "https://www.quora.com/profile/More-News-6",
    flipboard: "https://flipboard.com/@more_news",
    medium: process.env.NEXT_PUBLIC_MEDIUM_URL?.trim() || "https://medium.com/@more_news",
    substack: process.env.NEXT_PUBLIC_SUBSTACK_URL?.trim() || "https://substack.com/@morenewsmn",
  },
};

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return new URL(path.startsWith("/") ? path : `/${path}`, `${siteConfig.url}/`).toString();
}

export function socialUrls() {
  return Object.values(siteConfig.socials).filter(Boolean);
}
