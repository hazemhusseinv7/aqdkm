import { HiEnvelope } from "react-icons/hi2";
import { defineField, defineType } from "sanity";

export const subscriber = defineType({
  name: "subscriber",
  title: "Subscriber",
  type: "document",
  icon: HiEnvelope,
  fields: [
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      readOnly: true,
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      initialValue: "pending",
      options: {
        list: [
          { title: "Pending", value: "pending" },
          { title: "Confirmed", value: "confirmed" },
          { title: "Unsubscribed", value: "unsubscribed" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "confirmToken",
      title: "Confirm token",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "tokenExpiresAt",
      title: "Token expires at",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "source",
      title: "Source",
      type: "string",
      readOnly: true,
      initialValue: "footer",
    }),
    defineField({
      name: "resendContactId",
      title: "Resend contact ID",
      type: "string",
      readOnly: true,
    }),
  ],
  preview: {
    select: { title: "email", subtitle: "status" },
  },
});
