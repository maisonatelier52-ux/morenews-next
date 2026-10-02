"use client";

import { useEffect, useRef, useState } from "react";
import BrandIcon from "@/components/BrandIcon";

const targets = {
  x: (url, title) => `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  twitter: (url, title) => `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  facebook: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  linkedin: (url) => `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  reddit: (url, title) => `https://www.reddit.com/submit?url=${url}&title=${title}`,
  whatsapp: (url, title) => `https://api.whatsapp.com/send?text=${title}%20${url}`,
  email: (url, title) => `mailto:?subject=${title}&body=${url}`,
};

function openShare(network, title) {
  const url = encodeURIComponent(window.location.href);
  const text = encodeURIComponent(title || document.title);
  const build = targets[network];
  if (!build) return;
  if (network === "email") window.location.href = build(url, text);
  else window.open(build(url, text), "_blank", "noopener,noreferrer,width=640,height=520");
}

const iconRow = {
  x: ["Share on X", "fa-brands fa-x-twitter"],
  facebook: ["Share on Facebook", "fa-brands fa-facebook-f"],
  linkedin: ["Share on LinkedIn", "fa-brands fa-linkedin-in"],
  whatsapp: ["Share on WhatsApp", "fa-brands fa-whatsapp"],
  email: ["Share by email", "fa-solid fa-envelope"],
};

/** Round icon row used in the dossier sidebar. */
export function ShareIcons({ title, networks = ["x", "linkedin", "email"] }) {
  return (
    <div className="dossier-share-icons">
      {networks.filter((network) => iconRow[network]).map((network) => (
        <a
          key={network}
          href="#"
          title={iconRow[network][0]}
          aria-label={iconRow[network][0]}
          data-share={network}
          onClick={(event) => {
            event.preventDefault();
            openShare(network, title);
          }}
        >
          <BrandIcon name={network} />
        </a>
      ))}
    </div>
  );
}

/** Share dropdown shown at the top of standard articles (original MoreNews markup + classes). */
export function ShareMenu({ title }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const trigger = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const startY = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - startY) > 40) close();
    };
    const onKey = (event) => event.key === "Escape" && close();
    const onClick = (event) => {
      if (!event.target.closest?.(".share-dropdown-x")) close();
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [open]);

  function toggle() {
    if (!open && trigger.current) {
      const rect = trigger.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 6, left: Math.max(8, Math.min(rect.left, window.innerWidth - 220)) });
    }
    setOpen((value) => !value);
  }

  const items = [
    ["twitter", "X", "x"],
    ["facebook", "Facebook", "facebook"],
    ["linkedin", "LinkedIn", "linkedin"],
    ["reddit", "Reddit", "reddit"],
  ];

  return (
    <div className="share-dropdown-x">
      <button ref={trigger} type="button" className="share-trigger-x" aria-label="Share article" aria-expanded={open} onClick={toggle}>
        <BrandIcon name="share" />
      </button>
      <div className={`share-menu-x${open ? " active" : ""}`} style={{ top: pos.top, left: pos.left }}>
        {items.map(([network, label, icon]) => (
          <a
            key={network}
            href="#"
            data-share={network}
            aria-label={`Share on ${label}`}
            onClick={(event) => {
              event.preventDefault();
              openShare(network, title);
              setOpen(false);
            }}
          >
            <BrandIcon name={icon} />
          </a>
        ))}
      </div>
    </div>
  );
}
