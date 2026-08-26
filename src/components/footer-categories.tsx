"use client";

import { footerCategorySections } from "@/lib/footer";

function CategoryList({
  title,
  items,
}: {
  title: string;
  items: readonly { label: string; href: string }[];
}) {
  return (
    <ul className="text-[0.9375rem] leading-6 text-[#C7C1C5]">
      {items.map((item) => (
        <li key={`${title}-${item.label}`} className="py-3">
          <a href={item.href} className="hover:text-white">
            {item.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function FooterCategories() {
  return (
    <div className="flex bg-[#211E20]">
      <div className="flex flex-1 flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col lg:hidden">
          {footerCategorySections.map((section) => (
            <details
              key={section.title}
              className="group border-b border-[#433C41]"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-sm font-medium uppercase tracking-widest text-[#FAF8F9] marker:content-none [&::-webkit-details-marker]:hidden">
                {section.title}
                <span className="text-[#C7C1C5] transition group-open:rotate-180">
                  ⌄
                </span>
              </summary>
              <CategoryList title={section.title} items={section.items} />
            </details>
          ))}
        </div>

        <div className="hidden lg:contents">
          {footerCategorySections.map((section) => (
            <div key={section.title} className="flex-1">
              <p className="text-[0.9rem] font-bold uppercase leading-5 tracking-widest text-[#FAF8F9]">
                {section.title}
              </p>
              <CategoryList title={section.title} items={section.items} />
            </div>
          ))}
        </div>

        <div className="w-full flex-1 lg:w-[290px] lg:flex-auto">
          <p className="text-[0.9rem] font-bold uppercase tracking-widest text-[#FAF8F9]">
            Insights
          </p>
          <hr className="my-6 border-[#433C41]" />
          <p className="text-[0.9375rem] leading-6 text-[#FAF8F9]">
            Latest Articles
          </p>
          <ul className="text-[0.9375rem] font-normal leading-6 text-[#C7C1C5]">
            <li className="py-3">
              <a
                href="https://www.teaminternational.com/en/blog"
                className="hover:text-white"
              >
                TEAM Insights
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
