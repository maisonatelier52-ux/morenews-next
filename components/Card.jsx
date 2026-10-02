import Image from "next/image";
import Link from "next/link";

export default function Card({ item, href, label }) {
  return (
    <Link className="mn-card" href={href}>
      {item.image ? <Image src={item.image} width={600} height={380} alt={item.imageAlt || item.title || item.name} unoptimized /> : null}
      <div className="label">{label}</div>
      <h2>{item.title || item.name}</h2>
      <p>{item.excerpt || item.description}</p>
    </Link>
  );
}
