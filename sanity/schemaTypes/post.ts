import { defineArrayMember, defineField, defineType } from "sanity";
import { RtlPortableTextInput } from "../lib/components/RtlPortableTextInput";
import { RtlTextFieldInput } from "../lib/components/RtlTextFieldInput";
import { MdFolder, MdInfo } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  icon: RiArticleFill,
  groups: [
    { name: "general", title: "General", icon: MdInfo },
    { name: "content", title: "Content", icon: RiArticleFill },
    { name: "taxonomy", title: "Taxonomy", icon: MdFolder },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "general",
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
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      group: "general",
      components: { input: RtlTextFieldInput },
      validation: (rule) =>
        rule.required().max(160).warning("Keep it under 160 characters"),
    }),
    defineField({
      name: "cover",
      title: "Cover image",
      type: "image",
      group: "general",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({ name: "caption", title: "Caption", type: "string" }),
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      group: "general",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      group: "content",
      components: { input: RtlPortableTextInput },
      of: [
        defineArrayMember({
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
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
                      rule.uri({ scheme: ["http", "https", "mailto", "tel"] }),
                  }),
                ],
              }),
            ],
          },
        }),
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      group: "taxonomy",
      of: [
        defineArrayMember({ type: "reference", to: [{ type: "category" }] }),
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      group: "taxonomy",
      to: [{ type: "author" }],
      options: { disableNew: true },
    }),
    defineField({
      name: "broadcastSentAt",
      title: "Broadcast sent at",
      type: "datetime",
      group: "general",
      readOnly: true,
      description:
        "Set automatically after the new-post email goes to confirmed subscribers. Clear it to resend on the next publish.",
    }),
    defineField({
      name: "broadcastId",
      title: "Broadcast ID",
      type: "string",
      group: "general",
      readOnly: true,
      description:
        "Resend broadcast id for this post (analytics in the Resend dashboard). Clear alongside Broadcast sent at to resend.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "publishedAt" },
    prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
      return {
        title,
        subtitle: subtitle
          ? new Date(subtitle).toLocaleDateString("en-GB", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "Unpublished",
        media: RiArticleFill,
      };
    },
  },
});
