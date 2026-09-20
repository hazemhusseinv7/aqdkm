import { defineField, defineType } from "sanity";
import { MdFolder } from "react-icons/md";

export const category = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: MdFolder,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) =>
        rule.required().custom((slug) => {
          if (!slug?.current) return "Required";
          if (!/^[a-z0-9-]+$/.test(slug.current)) {
            return "Slug must be lowercase with hyphens only";
          }
          return true;
        }),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
});
