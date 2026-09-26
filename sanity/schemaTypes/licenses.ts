import { defineArrayMember, defineField, defineType } from "sanity";
import { MdBadge } from "react-icons/md";

export const licenses = defineType({
  name: "licenses",
  title: "Licenses",
  type: "document",
  icon: MdBadge,
  fields: [
    defineField({
      name: "items",
      title: "Licenses",
      type: "array",
      description: "Licenses appear on the homepage in this order",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "issuer",
              title: "Issuing body",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "number",
              title: "License number",
              type: "string",
              description: "Shown only when filled",
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Gavel (Fal license)", value: "gavel" },
                  { title: "Ticket (Ejar)", value: "ticket" },
                  { title: "Store (commercial registration)", value: "store" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "issuer" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }: { items?: unknown[] }) {
      return { title: `Licenses (${items?.length ?? 0})` };
    },
  },
});
