const SITE = "https://www.teaminternational.com/en";

export const footerCategorySections = [
  {
    title: "Solutions",
    items: [
      { label: "AI/Transformation Studio", href: `${SITE}/ai-studio` },
      {
        label: "Information Security Studio",
        href: `${SITE}/information-security-studio`,
      },
      { label: "Data Studio", href: `${SITE}/data-studio` },
      {
        label: "Professional And Managed Services Studio",
        href: `${SITE}/managed-services-studio`,
      },
      {
        label: "Digital Software Solutions Studio",
        href: `${SITE}/digital-software-solutions-studio`,
      },
      { label: "Cybersecurity Studio", href: `${SITE}/cybersecurity-studio` },
    ],
  },
  {
    title: "Industries",
    items: [
      {
        label: "Finances & Banking",
        href: `${SITE}/industries/finance-it-solutions`,
      },
      {
        label: "Healthcare & Wellness",
        href: `${SITE}/industries/healthcare-it-solutions`,
      },
      {
        label: "Technology, Media, and Telecommunications",
        href: `${SITE}/industries/telecom-it-solutions`,
      },
      {
        label: "Travel and Hospitality",
        href: `${SITE}/industries/it-solutions-travel-hospitality`,
      },
      {
        label: "Retail",
        href: `${SITE}/industries/retail-managed-it`,
      },
      {
        label: "Business Services",
        href: `${SITE}/industries/business-services`,
      },
      {
        label: "Logistics and Transportation",
        href: `${SITE}/industries/logistics-it-solutions`,
      },
      {
        label: "Engineering Staffing",
        href: `${SITE}/industries/engineering-staffing`,
      },
    ],
  },
  {
    title: "Company",
    items: [
      { label: "About", href: `${SITE}/about-us` },
      { label: "Awards & Recognition", href: `${SITE}/ecosystem#awards` },
      { label: "Locations", href: `${SITE}/locations` },
      { label: "Contact Us", href: `${SITE}/#contact` },
      { label: "Compliance & Security", href: `${SITE}/compliance` },
      { label: "Privacy Policy and Terms", href: `${SITE}/privacy-policy` },
    ],
  },
  {
    title: "Careers",
    items: [
      { label: "Job Openings", href: `${SITE}/careers` },
      { label: "Career Opportunities", href: `${SITE}/careers` },
      { label: "Life at TEAM", href: `${SITE}/careers` },
    ],
  },
] as const;

export const socialLinks = [
  {
    title: "Linkedin",
    href: "https://www.linkedin.com/company/team-international",
  },
  {
    title: "Instagram",
    href: "https://instagram.com/teamintl.global",
  },
  {
    title: "Facebook",
    href: "https://www.facebook.com/teamintl",
  },
  {
    title: "Youtube",
    href: "https://www.youtube.com/@teaminternationalglobal",
  },
] as const;
