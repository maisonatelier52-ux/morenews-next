/** A single self-contained monochrome SVG family, independent of icon CDNs. */
export default function BrandIcon({ name, size = 20 }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" };
  let mark;
  switch (name.toLowerCase()) {
    case "twitter": case "x": mark = <path d="M18.9 2H22l-6.8 7.8L23.2 22h-6.3l-4.9-7.4L5.5 22H2.3l7.4-8.5L1.2 2h6.5l4.5 6.7L18.9 2ZM17.7 20h1.7L6.6 3.9H4.8L17.7 20Z" />; break;
    case "instagram": mark = <g {...common}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.3"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor" stroke="none"/></g>; break;
    case "quora": mark = <><path d="M12 2C6.5 2 3 5.7 3 11.5S6.5 21 12 21c5.4 0 9-3.7 9-9.5S17.4 2 12 2Zm0 2c3 0 4.7 2.7 4.7 7.5S15 19 12 19s-4.7-2.7-4.7-7.5S9 4 12 4Z"/><path d="M12 15c4 0 3 6 7 6 1 0 2-.4 3-1-1 2-2 3-4 3-5 0-4-6-7-6l1-2Z"/></>; break;
    case "flipboard": mark = <path d="M3 3h18v6h-6v6H9v6H3V3Z"/>; break;
    case "medium": mark = <><circle cx="7" cy="12" r="6"/><ellipse cx="17" cy="12" rx="3" ry="6"/><ellipse cx="22" cy="12" rx="1" ry="5.5"/></>; break;
    case "substack": mark = <path d="M3 3h18v2H3V3Zm0 4h18v2H3V7Zm0 4h18v11l-9-5-9 5V11Z"/>; break;
    case "facebook": mark = <path d="M14.5 22v-9h3l.5-4h-3.5V6.5c0-1.2.4-2 2-2H18V1.2C17.1 1 16 1 15 1c-3 0-5 1.9-5 5v3H7v4h3v9h4.5Z"/>; break;
    case "linkedin": mark = <><rect x="3" y="9" width="4" height="12"/><circle cx="5" cy="4.5" r="2.2"/><path d="M10 9h4v1.7c1-1.4 2.1-2 3.8-2 3.3 0 4.2 2.2 4.2 5.4V21h-4v-6.3c0-1.8-.3-2.9-1.9-2.9-1.7 0-2.1 1.2-2.1 3V21h-4V9Z"/></>; break;
    case "reddit": mark = <g {...common}><ellipse cx="12" cy="15" rx="9" ry="6"/><path d="m12 9 2-6 5 1M8 18c2 1.4 6 1.4 8 0M3 12C-1 8 4 6 6 10M21 12c4-4-1-6-3-2"/><circle cx="20.5" cy="4.5" r="2"/><circle cx="8" cy="14" r="1" fill="currentColor"/><circle cx="16" cy="14" r="1" fill="currentColor"/></g>; break;
    case "whatsapp": mark = <g {...common}><path d="M4 18a10 10 0 1 1 4 3l-6 1 2-4Z"/><path d="m8 7 2 3-1 1c1 2 2 3 4 4l1-1 3 2c-2 4-9-1-10-5-1-2-1-3 1-4Z"/></g>; break;
    case "email": mark = <g {...common}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m3 6 9 7 9-7"/></g>; break;
    case "share": mark = <g {...common}><circle cx="18" cy="4" r="3"/><circle cx="5" cy="12" r="3"/><circle cx="18" cy="20" r="3"/><path d="m8 10 7-4M8 14l7 4"/></g>; break;
    default: mark = <g {...common}><path d="m9 15 6-6M8 16l-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0M16 8l2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(2 0) scale(.85)"/></g>;
  }
  return <svg className="brand-icon" viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true" focusable="false">{mark}</svg>;
}
