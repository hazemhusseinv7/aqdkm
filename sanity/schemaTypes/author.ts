import { defineField, defineType } from "sanity";
import { MdPerson } from "react-icons/md";

export const author = defineType({
  name: "author",
  title: "Author",
  type: "document",
  icon: MdPerson,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "avatar",
      title: "Avatar",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
      ],
    }),
    defineField({ name: "role", title: "Role", type: "string" }),
    defineField({ name: "bio", title: "Bio", type: "text" }),
  ],
  preview: {
    select: { title: "name", subtitle: "role", media: "avatar" },
  },
});
