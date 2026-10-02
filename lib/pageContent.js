/**
 * Structured copy for the About, Our Team and Contact pages.
 * Policy pages keep their text in public/data/pages.json.
 * Only emails that already appear on the site are used here.
 */

export const emails = {
  editorial: "editorial@morenews.org",
  tips: "tips@morenews.org",
  corrections: "corrections@morenews.org",
};

export const aboutContent = {
  lede: "Independent reporting on UK and world affairs, built on verified facts, clear context and plain language.",
  intro: [
    "More News is an independent digital news publication based in the United Kingdom. We report on politics, business, technology, health, sport and world affairs, and we investigate matters of public interest.",
    "Our newsroom brings together reporters, editors, fact-checkers and analysts who share one aim: to help readers understand what is happening, why it matters and how it affects their lives. We hold power to account, and we do it with evidence rather than outrage.",
    "We are not driven by political parties or corporate interests. How we stay independent, and how we are funded, is set out in our Editorial Policy and our Ownership and Funding statement.",
  ],
  principles: [
    {
      title: "Verify before we publish",
      text: "Accuracy matters more than speed. We rely on documents, direct attribution and reliable sources, and we say clearly when something is not yet confirmed.",
      href: "/source-methodology",
      cta: "Read our source methodology",
    },
    {
      title: "Show our working",
      text: "Stories carry a journalist’s byline wherever possible. News, analysis and opinion are labelled, and paid or sponsored material is never presented as reporting.",
      href: "/editorial-policy",
      cta: "Read our editorial policy",
    },
    {
      title: "Correct errors in the open",
      text: "When we get something wrong, we fix it and say so. Readers can report an error at any time, and developing stories are updated as facts change.",
      href: "/corrections-policy",
      cta: "Read our corrections policy",
    },
  ],
  standards: [
    { slug: "editorial-policy", text: "The standards that govern how we report, verify, label and publish." },
    { slug: "source-methodology", text: "How we find, check and attribute information, including anonymous sources." },
    { slug: "corrections-policy", text: "How we handle errors, and where corrections appear." },
    { slug: "right-of-reply", text: "When and how people and organisations can respond to our reporting." },
    { slug: "ownership-and-funding", text: "Who makes editorial decisions and how More News is funded." },
    { slug: "advertising-policy", text: "How we keep advertising and sponsored content separate from news." },
  ],
};

export const teamContent = {
  lede: "The reporters, editors and analysts who produce More News, and the wider team that keeps the newsroom independent.",
  mission:
    "We are an independent newsroom committed to accuracy, transparency and accountability. We cover UK politics, global affairs, business, health, technology and sport, and we aim to explain events rather than add to the noise.",
  leadership: ["emily-hargreaves", "daniel-rowcroft"],
  reporters: ["james-thornton", "henry-whitaker", "lydia-prescott", "sophie-caldwell", "oliver-grant", "callum-fraser"],
  desks: [
    { name: "Editorial", text: "Editors shape every story, from first draft to publication, for accuracy, fairness and clarity." },
    { name: "Fact-checking", text: "Fact-checkers verify claims, figures and sources before stories are published." },
    { name: "Production", text: "Our production team handles design and digital publishing across devices and platforms." },
    { name: "Audience and community", text: "This team works directly with readers, welcomes feedback and builds an informed community around our journalism." },
  ],
};

export const contactContent = {
  lede: "Send us a tip, a correction or a question. Choose the address that fits your message so it reaches the right person quickly.",
  channels: [
    {
      title: "Editorial and general enquiries",
      email: emails.editorial,
      text: "Questions about our reporting, story ideas, and decisions behind published articles.",
      include: "The article link or headline, and what you would like us to consider.",
    },
    {
      title: "Confidential news tips",
      email: emails.tips,
      text: "Information you believe deserves investigation or public reporting. We handle every tip with care and discretion.",
      include: "What you know, how you know it, and any documents you can share. Tell us if you need your identity protected.",
    },
    {
      title: "Corrections",
      email: emails.corrections,
      text: "If you believe we have made a factual error, tell us promptly so we can review it.",
      include: "The article URL, the exact claim you believe is wrong, and the evidence for your view.",
      href: "/corrections-policy",
      cta: "How corrections work",
    },
    {
      title: "Media and press enquiries",
      email: emails.editorial,
      text: "For journalists, researchers and organisations seeking commentary, collaboration or information about the newsroom.",
      include: "Your name, organisation, deadline if there is one, and what you need.",
    },
    {
      title: "Rights, permissions and formal notices",
      email: emails.editorial,
      text: "Copyright, syndication and reuse requests, complaints, and formal legal notices.",
      include: "The content at issue, the basis for your request, and a reliable way to reach you.",
      href: "/legal",
      cta: "Read our legal information",
    },
    {
      title: "Right of reply",
      email: emails.editorial,
      text: "If you are named in our reporting and want to respond, or you are seeking a reply to a published story.",
      include: "The article link, the statement you are responding to, and your response.",
      href: "/right-of-reply",
      cta: "How right of reply works",
    },
  ],
  tipNote:
    "When you write about a published article, always include its URL and the specific issue you are raising. It lets us route your message to the right editor without delay.",
  disclosure:
    "More News is an independent digital publication run by a distributed editorial team based in the United Kingdom. We do not represent any political party, government body or commercial interest, and our journalism is accountable to readers.",
};

/** Sections that are really sub-points of the heading above them. */
export const subsections = {
  "editorial-policy": ["No undisclosed conflicts", "No hidden sponsored content", "Respect for privacy", "Source protection"],
};

/** Hand-written summaries shown in the page navigation cards. */
export const pageGroups = [
  { id: "about", title: "About More News" },
  { id: "policy", title: "Standards and policies" },
];

export const categoryBlurbs = {
  uk: "Politics, the economy, public services and national developments.",
  politics: "Government policy, Parliament, elections and the exercise of power.",
  business: "Markets, companies, jobs, housing and the wider economy.",
  tech: "AI, defence, health technology and the innovation shaping industry and government.",
  world: "Global politics, conflict, diplomacy and international markets.",
  health: "NHS updates, public health, medical research and healthcare policy.",
  sports: "Football, Formula 1, cricket, cycling, darts and major competitions.",
  investigation: "Public inquiries, legal cases, corruption probes and accountability reporting.",
};
