import Image from "next/image";

import { FooterCategories } from "@/components/footer-categories";
import { socialLinks } from "@/lib/footer";

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46C23.21 24 24 23.23 24 22.27V1.73C24 .77 23.21 0 22.23 0z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
      <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm10 2H7a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm-5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zm5.25-3.75a1 1 0 1 1-1 1 1 1 0 0 1 1-1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
      <path d="M22.7 0H1.3C.6 0 0 .6 0 1.3v21.4C0 23.4.6 24 1.3 24h11.5v-9.3H9.7V11h3.1V8.4c0-3.1 1.9-4.8 4.6-4.8 1.3 0 2.5.1 2.8.1v3.3h-1.9c-1.5 0-1.8.7-1.8 1.8V11h3.6l-.5 3.7h-3.1V24h6.1c.7 0 1.3-.6 1.3-1.3V1.3C24 .6 23.4 0 22.7 0z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-6 fill-current" aria-hidden>
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8zM9.6 15.5V8.5l6.3 3.5-6.3 3.5z" />
    </svg>
  );
}

const socialIcons = {
  Linkedin: LinkedInIcon,
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  Youtube: YouTubeIcon,
} as const;

export function Footer() {
  return (
    <footer className="relative flex w-full items-center justify-center bg-[#211E20] px-6 py-10 text-white lg:px-10 lg:py-[3.75rem]">
      <div className="mx-auto w-full max-w-[1440px]">
        <FooterCategories />
        <hr className="my-10 w-full border-[#433C41]" />

        <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:items-start md:justify-between">
          <a href="/" title="Home" className="shrink-0">
            <Image
              src="/team-international-logo.svg"
              alt="TEAM International"
              width={113}
              height={34}
              className="h-10 w-auto"
            />
            <span className="sr-only">Home</span>
          </a>

          <div className="text-center text-sm md:text-left">
            <p className="mb-0">sales@teaminternational.com</p>
            <p className="pt-1">1145 TownPark Avenue Suite 2201</p>
            <p className="pt-1">Lake Mary, FL 32746</p>
          </div>

          <div className="text-center md:text-left">
            <p className="text-xs font-normal uppercase leading-5 tracking-widest">
              Follow us
            </p>
            <div className="flex gap-4 pt-3">
              {socialLinks.map((item) => {
                const Icon = socialIcons[item.title];
                return (
                  <a
                    key={item.href}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-2xl"
                    title={item.title}
                  >
                    <Icon />
                    <span className="sr-only">{item.title}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <hr className="mt-6 border-[#433C41]" />
        <p className="mb-0 flex w-full justify-center pt-10 text-center text-sm text-[#A399A2]">
          Copyright © TEAM International Services Inc. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
