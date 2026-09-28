import { defineArrayMember, defineField, defineType } from "sanity";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

export const features = defineType({
  name: "features",
  title: "Features",
  type: "document",
  icon: IoCheckmarkDoneCircle,
  fields: [
    defineField({
      name: "items",
      title: "Features",
      type: "array",
      description: "Features appear on the homepage in this order",
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
              name: "description",
              title: "Description",
              type: "text",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Save (draft)", value: "save" },
                  { title: "Review (check)", value: "review" },
                  { title: "Receipt (fees)", value: "fees" },
                  { title: "Badge (verification)", value: "verify" },
                  { title: "Ticket (tracking)", value: "track" },
                  { title: "Note (meters)", value: "meters" },
                  { title: "Bolt (speed)", value: "bolt" },
                  { title: "Payment card (pay after review)", value: "payment" },
                  { title: "Verified user (certified)", value: "verified_user" },
                  { title: "Price tag (best prices)", value: "tag" },
                ],
              },
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "icon" },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: { items: "items" },
    prepare({ items }: { items?: unknown[] }) {
      return { title: `Features (${items?.length ?? 0})` };
    },
  },
});
