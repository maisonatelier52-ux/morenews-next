import { siteConfig } from "@/lib/site";

export default function robots() {
  const aiBots = [
    "GPTBot",
    "ChatGPT-User",
    "OAI-SearchBot",
    "ClaudeBot",
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot",
    "Google-Extended",
    "GeminiBot",
    "Applebot-Extended",
    "CCBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: ["/", "/_next/static/"], disallow: ["/_next/"] },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: [`${siteConfig.url}/sitemap.xml`, `${siteConfig.url}/llms.txt`],
    host: siteConfig.url,
  };
}
