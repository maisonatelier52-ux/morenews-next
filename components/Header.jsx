"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import SearchBox from "@/components/SearchBox";
import { navCategories, extraNavLinks } from "@/lib/data";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState("");
  const menu = useRef(null);
  const opener = useRef(null);

  useEffect(() => {
    setDate(new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" }));
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const controls = () => [...menu.current.querySelectorAll('a,button,input')];
    const focusTimer = setTimeout(() => controls()[0]?.focus({ preventScroll: true }), 0);
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab") return;
      const items = controls();
      const first = items[0], last = items[items.length - 1];
      if (!menu.current.contains(document.activeElement)) { event.preventDefault(); first.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKey);
      opener.current?.focus();
    };
  }, [open]);

  return (
    <header className="header">
      <div className="top-header">
        <div className="left-icons">
          <button ref={opener} className="nav-menu" type="button" aria-label="Open menu" aria-controls="sidebar" aria-expanded={open} onClick={() => setOpen(true)}><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M3 6h18M3 12h18M3 18h18" /></svg></button>
          <SearchBox className="desktop-header-search" />
        </div>
        <div className="logo">
          <Link href="/" title="home"><Image src="/images/logo.svg" height={90} width={250} alt="More News" priority /></Link>
        </div>
        <div className="right-info">
          <div className="line date">{date}</div>
        </div>
      </div>
      {open && <button type="button" className="menu-backdrop" aria-label="Close navigation menu" tabIndex={-1} onClick={() => setOpen(false)} />}
      <div ref={menu} id="sidebar" className={`sidebar ${open ? "open" : ""}`} role="dialog" aria-label="Navigation menu" aria-modal={open ? true : undefined} aria-hidden={!open} inert={open ? undefined : ""}>
        <div className="menu-heading"><span>More News</span><button className="close-btn" type="button" onClick={() => setOpen(false)} aria-label="Close menu">&times;</button></div>
        <SearchBox className="menu-search" onNavigate={() => setOpen(false)} />
        <nav aria-label="Menu navigation">
          {navCategories.map(([label, href]) => <Link key={href} className="link1" href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <div className="menu-divider" />
          {extraNavLinks.map((item) => <Link key={item.href} className="link1" href={item.href} onClick={() => setOpen(false)}>{item.label}</Link>)}
        </nav>
      </div>
      <nav className="navbar" aria-label="Main navigation">
        <ul>
          {navCategories.map(([label, href]) => (
            <li key={href}><Link href={href}>{label}</Link></li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
