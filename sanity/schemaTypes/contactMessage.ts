import { defineField, defineType } from "sanity";
import { MdMarkChatUnread } from "react-icons/md";
import StatusTabs from "../lib/components/StatusTabs";

const STATUSES = [
  { title: "New", value: "new" },
  { title: "Read", value: "read" },
  { title: "Replied", value: "replied" },
];

export const contactMessage = defineType({
  name: "contactMessage",
  title: "Contact Message",
  type: "document",
  icon: MdMarkChatUnread,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Phone",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.email().error("Enter a valid email address"),
    }),
    defineField({
      name: "message",
      title: "Message",
      type: "text",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      components: { input: StatusTabs },
      options: { list: STATUSES },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted at",
      type: "datetime",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { name: "name", phone: "phone", status: "status" },
    prepare({
      name,
      phone,
      status,
    }: {
      name?: string;
      phone?: string;
      status?: string;
    }) {
      const label = STATUSES.find((s) => s.value === status)?.title ?? status;
      return {
        title: name ?? "Untitled message",
        subtitle: phone ? `${phone} · ${label}` : label,
        media: MdMarkChatUnread,
      };
    },
  },
  orderings: [
    {
      title: "Newest first",
      name: "submittedAtDesc",
      by: [{ field: "submittedAt", direction: "desc" }],
    },
  ],
});
