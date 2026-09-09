import Link from "next/link";
import type { RegionalContact } from "@/lib/content";
import { SocialIcon, VERIFIED_SOCIAL_LINKS } from "@/components/socialLinks";

export function SiteFooter({ hq }: { hq?: RegionalContact }) {
  return (
    <footer className="bg-ink px-6 pb-6 pt-14 text-[#d9dee5] sm:px-12">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-9 sm:grid-cols-4">
        <FooterColumn title="Quick Links">
          <FooterLink href="/about-pandita-ramabai/">About Pandita Ramabai</FooterLink>
          <FooterLink href="/news/">News &amp; Updates</FooterLink>
          <FooterLink href="/testimonials/">Testimonials</FooterLink>
          <FooterLink href="/reports/">Reports</FooterLink>
          <FooterLink href="/contact/">Contact Us</FooterLink>
        </FooterColumn>
        <FooterColumn title="Our Ministries">
          <FooterLink href="/programs/">View all programs</FooterLink>
          <FooterLink href="/shaping-the-mind/">Shaping the Mind</FooterLink>
          <FooterLink href="/shaping-the-spirit/">Shaping the Spirit</FooterLink>
          <FooterLink href="/shaping-the-heart/">Shaping the Heart</FooterLink>
          <FooterLink href="/shaping-the-environment/">Shaping the Environment</FooterLink>
          <FooterLink href="/shaping-the-destiny/">Shaping the Destiny</FooterLink>
        </FooterColumn>
        <FooterColumn title="Get Involved">
          <FooterLink href="/donate/">Donate</FooterLink>
          <FooterLink href="/mukti-kiran/">Mukti Kiran Newsletter</FooterLink>
        </FooterColumn>
        <FooterColumn title="Contact">
          {hq ? (
            <>
              <li className="whitespace-pre-line text-sm text-[#d9dee5]">{hq.address}</li>
              <li>
                <a href={`tel:${hq.phone.replace(/\s+/g, "")}`} className="text-sm hover:text-white hover:underline">
                  {hq.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${hq.email}`} className="text-sm hover:text-white hover:underline">
                  {hq.email}
                </a>
              </li>
            </>
          ) : (
            <li className="text-sm text-[#8b96a3]">
              [Headquarters contact — mark one entry is_headquarters in the CMS]
            </li>
          )}
        </FooterColumn>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-[#435061] pt-6">
        <p className="max-w-prose text-xs text-[#8b96a3]">
          Registered under the Societies Registration Act (1950) &amp; Bombay
          Public Trust Act (1950). Donations are tax-exempt under Section 80G.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/terms-of-use/" className="text-xs text-[#8b96a3] hover:text-white">
            Terms of Use
          </Link>
          <Link href="/privacy-policy/" className="text-xs text-[#8b96a3] hover:text-white">
            Privacy Policy
          </Link>
          <Link href="/site-map/" className="text-xs text-[#8b96a3] hover:text-white">
            Sitemap
          </Link>
          <div className="flex gap-2.5">
            {VERIFIED_SOCIAL_LINKS.map((s) => (
              <SocialIcon
                key={s.label}
                link={s}
                className="flex h-8.5 w-8.5 items-center justify-center rounded-full border border-[#4b5a6c] text-[#d9dee5] hover:border-white"
              />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-3.5 text-[11px] font-semibold uppercase tracking-wide text-[#9aa6b4]">
        {title}
      </h4>
      <ul className="flex flex-col gap-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-[#d9dee5] hover:text-white hover:underline">
        {children}
      </Link>
    </li>
  );
}
