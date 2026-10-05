import { defineField, defineType } from "sanity";
import { MdFolder } from "react-icons/md";
import { arabicSlugify, validateArabicSlug } from "../lib/arabicSlug";

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
      options: { source: "title", maxLength: 96, slugify: arabicSlugify },
      validation: (rule) => rule.required().custom(validateArabicSlug),
    }),
    defineField({ name: "description", title: "Description", type: "text" }),
  ],
});
