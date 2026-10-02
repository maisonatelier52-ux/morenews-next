import Image from "next/image";
import Link from "next/link";
import { footerColumns } from "@/lib/data";
import { siteConfig } from "@/lib/site";
import SocialIcons from "@/components/SocialIcons";

export default function Footer() {
  return (
    <footer className="rimont-footer">
      <div className="footer-container">
        <div className="brand-area">
          <Link href="/"><Image src="/images/logo.svg" height={73} width={200} alt={siteConfig.name} /></Link>
        </div>
        <div className="footer-grid">
          <FooterCol title="Explore" links={footerColumns.explore} />
          <FooterCol title="Authors" links={footerColumns.authors} />
          <FooterCol title="From More News" links={footerColumns.about} />
          <FooterCol title="Policies" links={footerColumns.policies} />
          <div className="footer-col social-section">
            <h4>Follow Us</h4>
            <SocialIcons className="footer-socials" />
          </div>
        </div>
        <div className="footer-bottom">Copyright © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div className="footer-col">
      <h4>{title}</h4>
      <ul>{links.map((link) => <li key={link.href}><Link href={link.href}>{link.label}</Link></li>)}</ul>
    </div>
  );
}
