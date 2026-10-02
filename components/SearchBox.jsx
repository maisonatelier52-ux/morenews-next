"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBox({ className = "", onNavigate }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function onSubmit(event) {
    event.preventDefault();
    const value = query.trim();
    if (value) { router.push(`/search?query=${encodeURIComponent(value)}`); onNavigate?.(); }
  }

  return (
    <form className={`site-search-form ${className}`} onSubmit={onSubmit} role="search">
      <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Search More News" aria-label="Search More News" />
      <button type="submit">Search</button>
    </form>
  );
}
