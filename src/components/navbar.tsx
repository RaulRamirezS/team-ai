"use client";

import Image from "next/image";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const SITE = "https://www.teaminternational.com/en";

type NavLinkItem = {
  label: string;
  href: string;
  hasSubmenu?: boolean;
};

type NavItem = NavLinkItem & {
  children?: readonly NavLinkItem[];
};

const aiStudioPanel = {
  heading: "IT solutions tailored to your industry's needs and challenges",
  columns: [
    [
      {
        label: "Technology, Media, and Telecommunications",
        href: `${SITE}/industries/telecom-it-solutions`,
      },
      {
        label: "Healthcare & Wellness",
        href: `${SITE}/industries/healthcare-it-solutions`,
      },
      {
        label: "Finances & Banking",
        href: `${SITE}/industries/finance-it-solutions`,
      },
      {
        label: "Travel & Hospitality",
        href: `${SITE}/industries/it-solutions-travel-hospitality`,
      },
    ],
    [
      {
        label: "Retail & Distribution",
        href: `${SITE}/industries/retail-managed-it`,
      },
      {
        label: "Logistics and Transportation",
        href: `${SITE}/industries/logistics-it-solutions`,
      },
      {
        label: "Business Services",
        href: `${SITE}/industries/business-services`,
      },
      {
        label: "Engineering Staffing",
        href: `${SITE}/industries/engineering-staffing`,
      },
      {
        label: "Oil and Gas Digital Solutions",
        href: `${SITE}/industries/oil-and-gas-digital-solutions`,
      },
    ],
  ],
  cta: { label: "DON'T SEE YOUR INDUSTRY?", href: `${SITE}/#contact` },
} as const;

const offeringItems: readonly NavItem[] = [
  {
    label: "Core Studios",
    href: "#",
    hasSubmenu: true,
    children: [
      { label: "Data Studio", href: `${SITE}/data-studio` },
      {
        label: "Information Security Studio",
        href: `${SITE}/information-security-studio`,
      },
      { label: "Salesforce Studio", href: `${SITE}/salesforce-studio` },
    ],
  },
];

const careersPanel = {
  title: "Careers",
  tagline: "Find your fit in a company that cares",
  links: [{ label: "Open Positions", href: `${SITE}/careers` }],
} as const;

const insightsPanel = {
  title: "Insights",
  tagline:
    "Knowledge is power. Dive into our archive and sharpen your IT insights.",
  columns: [
    {
      title: "Blog",
      href: null,
      links: [
        {
          label:
            "TEAM International and Sitecore: How a Strategic Collaboration Led to the Creation of TeamCX",
          href: `${SITE}/blog`,
        },
        {
          label:
            "Inside TEAM International's Salesforce Studio: Accessible Platform Development and Customization for Your Brand",
          href: `${SITE}/blog`,
        },
        {
          label:
            "What the Dot-Com Boom Teaches Us About Enterprise AI Adoption in 2026",
          href: `${SITE}/blog/dot-com-boom-lessons-enterprise-ai-adoption-2026`,
        },
      ],
      cta: { label: "VIEW ALL", href: `${SITE}/blog` },
    },
    {
      title: "Success stories",
      href: `${SITE}/insights/success-stories`,
      links: [],
      cta: null,
    },
    {
      title: "White Papers",
      href: `${SITE}/insights/industry-intel`,
      links: [],
      cta: null,
    },
  ],
} as const;

const navLinkClass = cn(
  navigationMenuTriggerStyle(),
  "h-auto rounded-none bg-transparent px-0 py-1 text-sm font-semibold tracking-[0.12em] text-white uppercase hover:bg-transparent hover:text-white/80 focus:bg-transparent focus-visible:ring-white/30 data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent",
);

function UsFlagIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4 shrink-0 rounded-full"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="12" fill="#B22234" />
      <path
        fill="#FFF"
        d="M0 4.6h24v1.85H0zm0 3.7h24v1.85H0zm0 3.7h24v1.85H0zm0 3.7h24V15H0z"
      />
      <rect width="10.5" height="7.4" fill="#3C3B6E" />
      <g fill="#FFF">
        <circle cx="1.5" cy="1.2" r="0.45" />
        <circle cx="3.5" cy="1.2" r="0.45" />
        <circle cx="5.5" cy="1.2" r="0.45" />
        <circle cx="7.5" cy="1.2" r="0.45" />
        <circle cx="9.5" cy="1.2" r="0.45" />
        <circle cx="2.5" cy="2.4" r="0.45" />
        <circle cx="4.5" cy="2.4" r="0.45" />
        <circle cx="6.5" cy="2.4" r="0.45" />
        <circle cx="8.5" cy="2.4" r="0.45" />
        <circle cx="1.5" cy="3.6" r="0.45" />
        <circle cx="3.5" cy="3.6" r="0.45" />
        <circle cx="5.5" cy="3.6" r="0.45" />
        <circle cx="7.5" cy="3.6" r="0.45" />
        <circle cx="9.5" cy="3.6" r="0.45" />
        <circle cx="2.5" cy="4.8" r="0.45" />
        <circle cx="4.5" cy="4.8" r="0.45" />
        <circle cx="6.5" cy="4.8" r="0.45" />
        <circle cx="8.5" cy="4.8" r="0.45" />
        <circle cx="1.5" cy="6" r="0.45" />
        <circle cx="3.5" cy="6" r="0.45" />
        <circle cx="5.5" cy="6" r="0.45" />
        <circle cx="7.5" cy="6" r="0.45" />
        <circle cx="9.5" cy="6" r="0.45" />
      </g>
    </svg>
  );
}

function MegaMenuPanel({
  heading,
  columns,
  cta,
}: {
  heading: string;
  columns: readonly (readonly { label: string; href: string }[])[];
  cta: { label: string; href: string };
}) {
  return (
    <div className="min-w-[36rem] bg-black px-10 py-10">
      <h3 className="max-w-[22rem] text-[1.375rem] font-bold leading-snug text-white">
        {heading}
      </h3>
      <div className="mt-8 grid grid-cols-2 gap-x-16">
        {columns.map((column) => (
          <ul key={column[0]?.label} className="flex flex-col gap-6">
            {column.map((link) => (
              <li key={link.label}>
                <NavigationMenuLink
                  href={link.href}
                  closeOnClick
                  className="rounded-none bg-transparent p-0 text-[0.9375rem] leading-6 text-[#C7C1C5] hover:bg-transparent hover:text-white focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent data-active:focus:bg-transparent"
                >
                  {link.label}
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        ))}
      </div>
      <NavigationMenuLink
        href={cta.href}
        closeOnClick
        className="mt-10 rounded-none bg-transparent p-0 text-[0.8125rem] font-bold tracking-[0.14em] text-[#1EC69C] uppercase hover:bg-transparent hover:underline focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
      >
        {cta.label} &gt;
      </NavigationMenuLink>
    </div>
  );
}

function OfferingMenu() {
  const submenuTriggerClass =
    "h-auto w-full justify-between rounded-lg bg-transparent px-2 py-2 text-left text-sm font-medium text-white hover:bg-transparent focus:bg-transparent data-open:bg-transparent data-open:hover:bg-transparent data-open:focus:bg-transparent data-popup-open:bg-transparent data-popup-open:hover:bg-transparent";

  return (
    <div className="w-[min(90vw,22rem)] p-1">
      <NavigationMenu
        orientation="vertical"
        side="right"
        align="start"
        className="max-w-none"
        popupClassName="rounded-md bg-black text-white ring-white/10"
      >
        <NavigationMenuList className="w-full flex-col items-stretch">
          <NavigationMenuItem value="ai-studio">
            <NavigationMenuTrigger showIcon={false} className={submenuTriggerClass}>
              AI / Transformation Studio
              <span aria-hidden="true">&gt;</span>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-0">
              <MegaMenuPanel {...aiStudioPanel} />
            </NavigationMenuContent>
          </NavigationMenuItem>
          {offeringItems.map((item) => (
            <NavigationMenuItem key={item.label} value={item.label}>
              <NavigationMenuTrigger showIcon={false} className={submenuTriggerClass}>
                {item.label}
                <span aria-hidden="true">&gt;</span>
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-1">
                <ul className="grid w-[min(90vw,18rem)] gap-1">
                  {item.children?.map((child) => (
                    <li key={child.href}>
                      <NavigationMenuLink
                        href={child.href}
                        closeOnClick
                        className="bg-transparent text-[#C7C1C5] hover:bg-transparent hover:text-white focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
                      >
                        {child.label}
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

function CareersPanel({
  title,
  tagline,
  links,
}: {
  title: string;
  tagline: string;
  links: readonly { label: string; href: string }[];
}) {
  return (
    <div className="w-[min(90vw,22rem)] bg-black px-8 py-8">
      <h3 className="text-[1.75rem] font-bold leading-tight text-white">{title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-6 text-[#C7C1C5]">{tagline}</p>
      <div className="mt-5 h-px w-full bg-[#F0C41A]" />
      <ul className="mt-6 flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.label}>
            <NavigationMenuLink
              href={link.href}
              closeOnClick
              className="rounded-none bg-transparent p-0 text-[0.9375rem] leading-6 text-[#C7C1C5] hover:bg-transparent hover:text-white focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
            >
              {link.label}
            </NavigationMenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InsightsPanel() {
  const headingLinkClass =
    "h-auto rounded-none bg-transparent p-0 text-[1.0625rem] font-bold text-white hover:bg-transparent hover:text-white focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent";
  const articleLinkClass =
    "h-auto items-start whitespace-normal rounded-none bg-transparent p-0 text-[0.9375rem] leading-6 text-[#C7C1C5] hover:bg-transparent hover:text-white focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent";

  return (
    <div className="w-[min(92vw,58rem)] bg-black px-10 py-10">
      <h3 className="text-[1.75rem] font-bold leading-tight text-white">
        {insightsPanel.title}
      </h3>
      <p className="mt-2 max-w-[36rem] text-[0.9375rem] leading-6 text-[#C7C1C5]">
        {insightsPanel.tagline}
      </p>
      <div className="mt-5 h-px w-full bg-[#F0C41A]" />
      <div className="mt-8 grid grid-cols-3 gap-x-10">
        {insightsPanel.columns.map((column) => (
          <div key={column.title} className="min-w-0">
            {column.href ? (
              <NavigationMenuLink
                href={column.href}
                closeOnClick
                className={headingLinkClass}
              >
                {column.title}
              </NavigationMenuLink>
            ) : (
              <p className="text-[1.0625rem] font-bold text-white">{column.title}</p>
            )}
            {column.links.length ? (
              <ul className="mt-6 flex flex-col gap-6">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <NavigationMenuLink
                      href={link.href}
                      closeOnClick
                      className={articleLinkClass}
                    >
                      {link.label}
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            ) : null}
            {column.cta ? (
              <NavigationMenuLink
                href={column.cta.href}
                closeOnClick
                className="mt-8 rounded-none bg-transparent p-0 text-[0.8125rem] font-bold tracking-[0.14em] text-[#1EC69C] uppercase hover:bg-transparent hover:underline focus:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent"
              >
                {column.cta.label} &gt;
              </NavigationMenuLink>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function MobileLinkGroup({
  title,
  items,
}: {
  title: string;
  items: readonly NavItem[];
}) {
  return (
    <div>
      {title ? (
        <p className="px-2 pb-1 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
          {title}
        </p>
      ) : null}
      <ul className="flex flex-col">
        {items.map((item) => (
          <li key={`${title}-${item.label}`}>
            {item.children?.length ? (
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between px-2 py-2 text-sm text-white/90 marker:content-none hover:bg-white/10 [&::-webkit-details-marker]:hidden">
                  {item.label}
                  <span aria-hidden="true">&gt;</span>
                </summary>
                <ul className="ml-3 border-l border-white/20">
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <SheetClose
                        render={
                          <a
                            href={child.href}
                            className="block rounded-lg px-2 py-2 text-sm text-white/90 hover:bg-white/10"
                          />
                        }
                      >
                        {child.label}
                      </SheetClose>
                    </li>
                  ))}
                </ul>
              </details>
            ) : (
              <SheetClose
                render={
                  <a
                    href={item.href}
                    className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-white/90 hover:bg-white/10"
                  />
                }
              >
                {item.label}
                {item.hasSubmenu ? <span aria-hidden="true">&gt;</span> : null}
              </SheetClose>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-black">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 lg:px-10">
        <a href="/" className="shrink-0">
          <Image
            src="/team-international-logo.png"
            alt="Team international"
            width={180}
            height={48}
            priority
            className="h-10 w-auto"
          />
        </a>

        <NavigationMenu
          align="end"
          className="hidden max-w-none flex-none xl:flex"
          popupClassName="rounded-md bg-black text-white ring-white/10"
        >
          <NavigationMenuList className="gap-6 xl:gap-8">
            <NavigationMenuItem>
              <NavigationMenuLink href="/" className={navLinkClass}>
                HOME
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem value="offering">
              <NavigationMenuTrigger className={navLinkClass}>
                OUR OFFERING
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-0">
                <OfferingMenu />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem value="careers">
              <NavigationMenuTrigger className={navLinkClass}>
                CAREERS
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-0">
                <CareersPanel {...careersPanel} />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink href={`${SITE}/about-us`} className={navLinkClass}>
                ABOUT
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem value="insights">
              <NavigationMenuTrigger className={navLinkClass}>
                INSIGHTS
              </NavigationMenuTrigger>
              <NavigationMenuContent className="p-0">
                <InsightsPanel />
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href={`${SITE}/ecosystem`}
                className={navLinkClass}
              >
                ECOSYSTEM
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem value="language">
              <NavigationMenuTrigger className="ml-2 flex h-10 items-center gap-1.5 rounded border border-white/20 bg-transparent px-3 text-white hover:bg-white/10 focus:bg-white/10 data-open:bg-white/10 data-popup-open:bg-white/10">
                <UsFlagIcon />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="w-40 p-1">
                  <li>
                    <NavigationMenuLink href="/" closeOnClick>
                      ENGLISH
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden items-center xl:flex">
          <Button
            nativeButton={false}
            className="ml-2 h-10 rounded-none bg-white px-6 text-sm font-bold tracking-[0.12em] text-[#0F0E0F] hover:bg-white/90 hover:text-[#0F0E0F]"
            render={<a href={`${SITE}/#contact`} />}
          >
            CONTACT
          </Button>
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10 xl:hidden"
              />
            }
          >
            <Menu className="size-6" />
            <span className="sr-only">Open menu</span>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="bg-[#0F0E0F] text-white"
          >
            <SheetHeader>
              <SheetTitle className="text-white">Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-6 overflow-y-auto px-4 pb-6">
              <SheetClose
                render={
                  <a
                    href="/"
                    className="rounded-lg px-2 py-2 text-sm font-semibold tracking-[0.12em] text-white hover:bg-white/10"
                  />
                }
              >
                HOME
              </SheetClose>
              <div>
                <p className="px-2 pb-1 text-xs font-semibold tracking-[0.14em] text-white/50 uppercase">
                  OUR OFFERING
                </p>
                <div className="px-2 py-2">
                  <p className="flex items-center justify-between text-sm font-medium text-white">
                    AI / Transformation Studio
                    <span aria-hidden="true">&gt;</span>
                  </p>
                  <p className="mt-3 text-sm font-bold text-white">
                    {aiStudioPanel.heading}
                  </p>
                  <div className="mt-3 flex flex-col gap-2">
                    {aiStudioPanel.columns.map((column) =>
                      column.map((link) => (
                        <SheetClose
                          key={link.label}
                          render={
                            <a
                              href={link.href}
                              className="block rounded-lg py-2 text-sm text-[#C7C1C5] hover:bg-transparent hover:text-white"
                            />
                          }
                        >
                          {link.label}
                        </SheetClose>
                      )),
                    )}
                  </div>
                  <SheetClose
                    render={
                      <a
                        href={aiStudioPanel.cta.href}
                        className="mt-2 inline-flex text-sm font-bold tracking-[0.14em] text-[#1EC69C] uppercase"
                      />
                    }
                  >
                    {aiStudioPanel.cta.label} &gt;
                  </SheetClose>
                </div>
                <MobileLinkGroup title="" items={offeringItems} />
              </div>
              <div className="px-2">
                <p className="text-[1.75rem] font-bold leading-tight text-white">
                  {careersPanel.title}
                </p>
                <p className="mt-2 text-sm text-[#C7C1C5]">{careersPanel.tagline}</p>
                <div className="mt-4 h-px w-full bg-[#F0C41A]" />
                <div className="mt-4 flex flex-col gap-2">
                  {careersPanel.links.map((link) => (
                    <SheetClose
                      key={link.label}
                      render={
                        <a
                          href={link.href}
                          className="block py-2 text-sm text-[#C7C1C5] hover:text-white"
                        />
                      }
                    >
                      {link.label}
                    </SheetClose>
                  ))}
                </div>
              </div>
              <SheetClose
                render={
                  <a
                    href={`${SITE}/about-us`}
                    className="rounded-lg px-2 py-2 text-sm font-semibold tracking-[0.12em] text-white hover:bg-white/10"
                  />
                }
              >
                ABOUT
              </SheetClose>
              <div className="px-2">
                <p className="text-[1.75rem] font-bold leading-tight text-white">
                  {insightsPanel.title}
                </p>
                <p className="mt-2 text-sm text-[#C7C1C5]">{insightsPanel.tagline}</p>
                <div className="mt-4 h-px w-full bg-[#F0C41A]" />
                <div className="mt-6 flex flex-col gap-8">
                  {insightsPanel.columns.map((column) => (
                    <div key={column.title}>
                      {column.href ? (
                        <SheetClose
                          render={
                            <a
                              href={column.href}
                              className="text-[1.0625rem] font-bold text-white"
                            />
                          }
                        >
                          {column.title}
                        </SheetClose>
                      ) : (
                        <p className="text-[1.0625rem] font-bold text-white">
                          {column.title}
                        </p>
                      )}
                      {column.links.length ? (
                        <div className="mt-3 flex flex-col gap-3">
                          {column.links.map((link) => (
                            <SheetClose
                              key={link.label}
                              render={
                                <a
                                  href={link.href}
                                  className="block py-1 text-sm leading-6 text-[#C7C1C5] hover:text-white"
                                />
                              }
                            >
                              {link.label}
                            </SheetClose>
                          ))}
                        </div>
                      ) : null}
                      {column.cta ? (
                        <SheetClose
                          render={
                            <a
                              href={column.cta.href}
                              className="mt-4 inline-flex text-sm font-bold tracking-[0.14em] text-[#1EC69C] uppercase"
                            />
                          }
                        >
                          {column.cta.label} &gt;
                        </SheetClose>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
              <SheetClose
                render={
                  <a
                    href={`${SITE}/ecosystem`}
                    className="rounded-lg px-2 py-2 text-sm font-semibold tracking-[0.12em] text-white hover:bg-white/10"
                  />
                }
              >
                ECOSYSTEM
              </SheetClose>
              <SheetClose
                render={
                  <a
                    href={`${SITE}/#contact`}
                    className="inline-flex h-10 items-center justify-center rounded-none bg-white px-6 text-sm font-bold tracking-[0.12em] text-[#0F0E0F] hover:bg-white/90 hover:text-[#0F0E0F]"
                  />
                }
              >
                CONTACT
              </SheetClose>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
