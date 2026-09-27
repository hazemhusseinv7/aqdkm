import { defineArrayMember, defineField, defineType } from "sanity";
import { MdRateReview } from "react-icons/md";

export const testimonials = defineType({
  name: "testimonials",
  title: "Testimonials",
  type: "document",
  icon: MdRateReview,
  fields: [
    defineField({
      name: "items",
      title: "Reviews",
      type: "array",
      description: "Reviews appear on the homepage in this order",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              description: "e.g. مستأجر, مالك عقار",
            }),
            defineField({
              name: "city",
              title: "City",
              type: "string",
              description: "e.g. الرياض",
            }),
            defineField({
              name: "date",
              title: "Date",
              type: "date",
              description: "Review date, shown when present",
            }),
            defineField({
              name: "rating",
              title: "Rating",
              type: "number",
              description: "1–5 stars",
              initialValue: 5,
              validation: (rule) => rule.min(1).max(5).integer(),
            }),
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "city" },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return { title: title ?? "Untitled", subtitle };
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }: { items?: unknown[] }) {
      return { title: `Testimonials (${items?.length ?? 0})` };
    },
  },
});
