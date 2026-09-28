import { RiSettingsFill } from "react-icons/ri";
import { HiLink, HiChartBar } from "react-icons/hi2";
import { MdPayments } from "react-icons/md";
import { defineArrayMember, defineField, defineType } from "sanity";
import {
  SOCIAL_PLATFORMS,
  getPlatformFallbackIcon,
} from "../lib/socialPlatforms";
import PlatformSelect from "../lib/components/PlatformSelect";
import FeesInput from "../lib/components/FeesInput";
import StatusInput from "../lib/components/StatusInput";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  icon: RiSettingsFill,
  groups: [
    { name: "general", title: "General", icon: RiSettingsFill },
    { name: "social", title: "Social Media", icon: HiLink },
    { name: "analytics", title: "Analytics", icon: HiChartBar },
    { name: "cta", title: "CTA Buttons", icon: MdPayments },
  ],
  fields: [
    defineField({
      name: "fees",
      title: "Documentation fees (SAR)",
      type: "object",
      group: "general",
      components: { input: FeesInput },
      fieldsets: [
        { name: "residential", title: "Residential" },
        { name: "commercial", title: "Commercial" },
      ],
      preview: {
        select: {
          residentialFirstGov: "residentialFirstGov",
          residentialFirstCompany: "residentialFirstCompany",
          residentialExtraGov: "residentialExtraGov",
          residentialExtraCompany: "residentialExtraCompany",
          commercialFirstGov: "commercialFirstGov",
          commercialFirstCompany: "commercialFirstCompany",
          commercialExtraGov: "commercialExtraGov",
          commercialExtraCompany: "commercialExtraCompany",
        },
        prepare(sel: {
          residentialFirstGov?: number;
          residentialFirstCompany?: number;
          residentialExtraGov?: number;
          residentialExtraCompany?: number;
          commercialFirstGov?: number;
          commercialFirstCompany?: number;
          commercialExtraGov?: number;
          commercialExtraCompany?: number;
        }) {
          const n = (v: unknown) => (typeof v === "number" ? v : 0);
          const resFirst =
            n(sel.residentialFirstGov) + n(sel.residentialFirstCompany);
          const resExtra =
            n(sel.residentialExtraGov) + n(sel.residentialExtraCompany);
          const first =
            n(sel.commercialFirstGov) + n(sel.commercialFirstCompany);
          const extra =
            n(sel.commercialExtraGov) + n(sel.commercialExtraCompany);
          return {
            title: "Documentation fees",
            subtitle: `Residential ${resFirst} first / ${resExtra} extra · Commercial ${first} first / ${extra} extra`,
            media: MdPayments,
          };
        },
      },
      fields: [
        defineField({
          name: "residentialFirstGov",
          fieldset: "residential",
          title: "Residential first year - government",
          type: "number",
          initialValue: 125,
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "residentialFirstCompany",
          fieldset: "residential",
          title: "Residential first year - company",
          type: "number",
          initialValue: 125,
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "residentialExtraGov",
          fieldset: "residential",
          title: "Residential extra year - government",
          type: "number",
          initialValue: 125,
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "residentialExtraCompany",
          fieldset: "residential",
          title: "Residential extra year - company",
          type: "number",
          initialValue: 125,
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "commercialFirstGov",
          fieldset: "commercial",
          title: "Commercial first year - government",
          type: "number",
          initialValue: 200,
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "commercialFirstCompany",
          fieldset: "commercial",
          title: "Commercial first year - company",
          type: "number",
          initialValue: 200,
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "commercialExtraGov",
          fieldset: "commercial",
          title: "Commercial extra year - government",
          type: "number",
          initialValue: 400,
          validation: (rule) => rule.required().min(0),
        }),
        defineField({
          name: "commercialExtraCompany",
          fieldset: "commercial",
          title: "Commercial extra year - company",
          type: "number",
          initialValue: 400,
          validation: (rule) => rule.required().min(0),
        }),
      ],
    }),
    defineField({
      name: "supportPhone",
      title: "Support phone",
      type: "string",
      group: "general",
      components: { input: StatusInput },
    }),
    defineField({
      name: "email",
      title: "Support email",
      type: "string",
      group: "general",
      components: { input: StatusInput },
      placeholder: "support@example.com",
      validation: (rule) => rule.email().error("Enter a valid email address"),
    }),
    defineField({
      name: "regaLicenseUrl",
      title: "REGA license verification URL",
      description:
        "Shown under the homepage licenses section. Hidden when empty.",
      type: "url",
      group: "general",
      validation: (rule) => rule.uri({ scheme: ["https", "http"] }),
    }),
    defineField({
      name: "cta",
      title: "CTA fee notes",
      description:
        "Starting-fee lines under the residential / commercial request buttons. Amounts are manual marketing numbers.",
      type: "object",
      group: "cta",
      fields: [
        defineField({
          name: "note",
          title: "Fee note phrase",
          description: "Shared phrase shown under both buttons.",
          type: "string",
          initialValue: "رسوم تبدأ من",
        }),
        defineField({
          name: "residentialFrom",
          title: "Residential starting fee (SAR)",
          description:
            "Amount under the residential button. Hidden when empty.",
          type: "number",
          initialValue: 250,
          validation: (rule) => rule.min(0),
        }),
        defineField({
          name: "commercialFrom",
          title: "Commercial starting fee (SAR)",
          description: "Amount under the commercial button. Hidden when empty.",
          type: "number",
          initialValue: 400,
          validation: (rule) => rule.min(0),
        }),
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      group: "general",
      description: "Questions appear on the homepage in this order",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "array",
              of: [
                defineArrayMember({
                  type: "block",
                  styles: [
                    { title: "Normal", value: "normal" },
                    { title: "Heading 4", value: "h4" },
                    { title: "Quote", value: "blockquote" },
                  ],
                  lists: [
                    { title: "Bulleted", value: "bullet" },
                    { title: "Numbered", value: "number" },
                  ],
                  marks: {
                    decorators: [
                      { title: "Strong", value: "strong" },
                      { title: "Emphasis", value: "em" },
                    ],
                    annotations: [
                      defineArrayMember({
                        name: "link",
                        type: "object",
                        title: "Link",
                        fields: [
                          defineField({
                            name: "href",
                            title: "URL",
                            type: "url",
                            validation: (rule) =>
                              rule.uri({
                                scheme: ["http", "https", "mailto", "tel"],
                              }),
                          }),
                        ],
                      }),
                    ],
                  },
                }),
              ],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: { title: "question" },
            prepare({ title }: { title?: string }) {
              return { title: title ?? "Untitled question" };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "gaMeasurementId",
      title: "Google Analytics Measurement ID",
      type: "string",
      group: "analytics",
      components: { input: StatusInput },
      description: 'Google Analytics 4 ID (format "G-XXXXXXXXXX")',
      placeholder: "G-XXXXXXXXXX",
      validation: (Rule) =>
        Rule.regex(/^G-[A-Z0-9]{4,}$/, {
          name: "GA4 measurement ID",
          invert: false,
        }).error('Must look like "G-XXXXXXXXXX"'),
    }),
    defineField({
      name: "gtmId",
      title: "Google Tag Manager ID",
      type: "string",
      group: "analytics",
      components: { input: StatusInput },
      description: 'Google Tag Manager container ID (format "GTM-XXXXXXX")',
      placeholder: "GTM-XXXXXXX",
      validation: (Rule) =>
        Rule.regex(/^GTM-[A-Z0-9]+$/, {
          name: "GTM container ID",
          invert: false,
        }).error('Must look like "GTM-XXXXXXX"'),
    }),
    defineField({
      name: "socialLinks",
      title: "Social Media Links",
      type: "array",
      group: "social",
      description: "Select each social platform and add its link URL",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "platform",
              title: "Platform",
              type: "string",
              components: { input: PlatformSelect },
              options: {
                list: [
                  { title: "Facebook", value: "facebook" },
                  { title: "Instagram", value: "instagram" },
                  { title: "YouTube", value: "youtube" },
                  { title: "LinkedIn", value: "linkedin" },
                  { title: "TikTok", value: "tiktok" },
                  { title: "X (Twitter)", value: "x" },
                  { title: "Snapchat", value: "snapchat" },
                  { title: "WhatsApp", value: "whatsapp" },
                  { title: "Threads", value: "threads" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "url",
              title: "Link URL",
              type: "url",
              placeholder: "https://…",
              validation: (rule) =>
                rule
                  .uri({ scheme: ["http", "https"] })
                  .error("Enter a valid http(s) URL"),
            }),
          ],
          preview: {
            select: { platform: "platform", url: "url" },
            prepare({ platform, url }: { platform?: string; url?: string }) {
              const meta = platform ? SOCIAL_PLATFORMS[platform] : undefined;
              return {
                title:
                  meta?.title ??
                  (platform ? "Unknown platform" : "Select platform"),
                subtitle: url,
                media: meta?.icon ?? getPlatformFallbackIcon(),
              };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      socialLinks: "socialLinks",
      faqs: "faqs",
      gaMeasurementId: "gaMeasurementId",
      gtmId: "gtmId",
    },
    prepare({
      socialLinks,
      faqs,
      gaMeasurementId,
      gtmId,
    }: {
      socialLinks?: { platform?: string }[];
      faqs?: unknown[];
      gaMeasurementId?: string;
      gtmId?: string;
    }) {
      const parts = [
        `${socialLinks?.length ?? 0} social links`,
        `${faqs?.length ?? 0} FAQs`,
        gaMeasurementId ? "GA on" : "GA off",
        gtmId ? "GTM on" : "GTM off",
      ];
      return {
        title: "Site Settings",
        subtitle: parts.join(" · "),
        media: RiSettingsFill,
      };
    },
  },
});
