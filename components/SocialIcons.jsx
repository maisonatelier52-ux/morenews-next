import { siteConfig } from "@/lib/site";
import BrandIcon from "@/components/BrandIcon";

/** Brand icon row under every standard article headline. */
export default function SocialIcons({ className = "" }) {
  const { socials } = siteConfig;
  const networks = [["twitter", "X"], ["instagram", "Instagram"], ["quora", "Quora"], ["flipboard", "Flipboard"], ["medium", "Medium"], ["substack", "Substack"]];
  return (
    <div className={`share-icons social-icon-row ${className}`}>
      {networks.map(([name, label]) => <a key={name} href={socials[name]} title={label} aria-label={`Follow More News on ${label}`} className="share-btn" target="_blank" rel="noopener noreferrer me"><BrandIcon name={name} /></a>)}
    </div>
  );
}
