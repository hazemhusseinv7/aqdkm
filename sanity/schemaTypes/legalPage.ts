import { defineArrayMember, defineField, defineType } from "sanity";
import { arabicSlugify, validateArabicSlug } from "../lib/arabicSlug";
import { RtlPortableTextInput } from "../lib/components/RtlPortableTextInput";
import { MdGavel } from "react-icons/md";

export const legalPage = defineType({
  name: "legalPage",
  title: "Legal Page",
  type: "document",
  icon: MdGavel,
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
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
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
                      rule.uri({
                        scheme: ["http", "https", "mailto", "tel"],
                      }),
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
    }),
    defineField({
      name: "accordion",
      title: "Accordion",
      type: "array",
      description: "Accordion items appear on the page in this order",
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
              components: { input: RtlPortableTextInput },
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
  ],
  preview: {
    select: { title: "title", subtitle: "slug.current" },
  },
});
