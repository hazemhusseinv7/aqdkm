import { defineField, defineType } from "sanity";
import { MdDescription, MdHome, MdPeople } from "react-icons/md";
import { HiTicket } from "react-icons/hi2";

import { bilingualTitle } from "../../lib/request-fields";

export const STATUSES = [
  { title: "New", value: "new" },
  { title: "Under review", value: "reviewing" },
  { title: "Approved", value: "approved" },
  { title: "Completed", value: "completed" },
  { title: "Cancelled", value: "cancelled" },
];

export const rentalRequest = defineType({
  name: "rentalRequest",
  title: "Rental Request",
  type: "document",
  icon: HiTicket,
  groups: [
    { name: "general", title: "General", icon: HiTicket },
    { name: "parties", title: "Parties", icon: MdPeople },
    { name: "property", title: "Property", icon: MdHome },
    { name: "terms", title: "Terms", icon: MdDescription },
  ],
  fields: [
    defineField({
      name: "requestNo",
      title: bilingualTitle("requestNo"),
      type: "string",
      group: "general",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contractType",
      title: bilingualTitle("contractType"),
      type: "string",
      group: "general",
      readOnly: true,
      options: {
        list: [
          { title: "Residential", value: "residential" },
          { title: "Commercial", value: "commercial" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: bilingualTitle("status"),
      type: "string",
      group: "general",
      options: { list: STATUSES, layout: "radio" },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "submittedAt",
      title: bilingualTitle("submittedAt"),
      type: "datetime",
      group: "general",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "applicant",
      title: "Applicant",
      type: "object",
      group: "parties",
      // readOnly cascades to all child fields.
      readOnly: true,
      fields: [
        defineField({
          name: "role",
          title: bilingualTitle("applicantRole"),
          type: "string",
          options: {
            list: [
              { title: "Owner", value: "أنا المالك أو ممثله" },
              { title: "Tenant", value: "أنا المستأجر" },
            ],
            layout: "radio",
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "isAgent",
          title: bilingualTitle("applicantIsAgent"),
          type: "boolean",
        }),
        defineField({
          name: "agencyNumber",
          title: bilingualTitle("applicantAgencyNumber"),
          type: "string",
        }),
        defineField({
          name: "phone",
          title: bilingualTitle("applicantPhone"),
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "nationalId",
          title: bilingualTitle("applicantNationalId"),
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "dob",
          title: bilingualTitle("applicantDob"),
          type: "date",
        }),
        defineField({
          name: "ownerIban",
          title: bilingualTitle("ownerIban"),
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "counterparty",
      title: "Other party",
      type: "object",
      group: "parties",
      readOnly: true,
      fields: [
        defineField({
          name: "counterType",
          title: bilingualTitle("counterpartyType"),
          type: "string",
          options: {
            list: [
              { title: "Individual", value: "فرد" },
              { title: "Entity", value: "منشأة" },
            ],
            layout: "radio",
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "nationalId",
          title: bilingualTitle("counterpartyNationalId"),
          type: "string",
        }),
        defineField({
          name: "phone",
          title: bilingualTitle("counterpartyPhone"),
          type: "string",
        }),
        defineField({
          name: "dob",
          title: bilingualTitle("counterpartyDob"),
          type: "date",
        }),
        defineField({
          name: "ownerIban",
          title: bilingualTitle("ownerIban"),
          type: "string",
        }),
        defineField({
          name: "unifiedNumber",
          title: bilingualTitle("counterpartyUnifiedNumber"),
          type: "string",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              return (
                /^70\d{8}$/.test(value) || "Must be 10 digits starting with 70"
              );
            }),
        }),
        defineField({
          name: "entityName",
          title: bilingualTitle("counterpartyEntityName"),
          type: "string",
        }),
        defineField({
          name: "repId",
          title: bilingualTitle("counterpartyRepId"),
          type: "string",
        }),
        defineField({
          name: "repPhone",
          title: bilingualTitle("counterpartyRepPhone"),
          type: "string",
        }),
        defineField({
          name: "repDob",
          title: bilingualTitle("counterpartyRepDob"),
          type: "date",
        }),
        defineField({
          name: "authNumber",
          title: bilingualTitle("counterpartyAuthNumber"),
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "property",
      title: "Property",
      type: "object",
      group: "property",
      readOnly: true,
      fields: [
        defineField({
          name: "deedNumber",
          title: bilingualTitle("propertyDeedNumber"),
          type: "string",
        }),
        defineField({
          name: "deedDate",
          title: bilingualTitle("propertyDeedDate"),
          type: "date",
        }),
        defineField({
          name: "propertyType",
          title: bilingualTitle("propertyType"),
          type: "string",
        }),
        defineField({
          name: "propertyCustom",
          title: bilingualTitle("propertyTypeCustom"),
          type: "string",
        }),
        defineField({
          name: "unitType",
          title: bilingualTitle("unitType"),
          type: "string",
        }),
        defineField({
          name: "unitCustom",
          title: bilingualTitle("unitTypeCustom"),
          type: "string",
        }),
        defineField({
          name: "unitNumber",
          title: bilingualTitle("unitNumber"),
          type: "string",
        }),
        defineField({
          name: "floor",
          title: bilingualTitle("floor"),
          type: "string",
        }),
        defineField({
          name: "floorCustom",
          title: bilingualTitle("floorCustom"),
          type: "string",
        }),
        defineField({
          name: "area",
          title: bilingualTitle("area"),
          type: "number",
        }),
        defineField({
          name: "rooms",
          title: bilingualTitle("rooms"),
          type: "string",
        }),
        defineField({
          name: "roomsCustom",
          title: bilingualTitle("roomsCustom"),
          type: "number",
        }),
        defineField({
          name: "extras",
          title: bilingualTitle("extras"),
          type: "array",
          of: [
            {
              type: "object",
              fields: [
                defineField({
                  name: "kind",
                  title: "Kind",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "count",
                  title: "Count",
                  type: "number",
                  validation: (rule) => rule.required().min(1).integer(),
                }),
              ],
            },
          ],
        }),
        defineField({
          name: "kitchenCabinets",
          title: bilingualTitle("kitchenCabinets"),
          type: "boolean",
        }),
        defineField({
          name: "electroMeter",
          title: bilingualTitle("electroMeter"),
          type: "string",
        }),
        defineField({
          name: "waterMeter",
          title: bilingualTitle("waterMeter"),
          type: "string",
        }),
      ],
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "object",
      group: "property",
      readOnly: true,
      fields: [
        defineField({
          name: "locationManual",
          title: bilingualTitle("locationManual"),
          type: "boolean",
        }),
        defineField({
          name: "mapsLink",
          title: bilingualTitle("mapsLink"),
          type: "url",
          validation: (rule) => rule.uri({ scheme: ["http", "https"] }),
        }),
        defineField({
          name: "city",
          title: bilingualTitle("city"),
          type: "string",
        }),
        defineField({
          name: "buildingNumber",
          title: bilingualTitle("buildingNumber"),
          type: "string",
        }),
        defineField({
          name: "additionalNumber",
          title: bilingualTitle("additionalNumber"),
          type: "string",
        }),
        defineField({
          name: "postalCode",
          title: bilingualTitle("postalCode"),
          type: "string",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              return /^\d{5}$/.test(value) || "Must be exactly 5 digits";
            }),
        }),
      ],
    }),
    defineField({
      name: "terms",
      title: "Contract terms",
      type: "object",
      group: "terms",
      readOnly: true,
      fields: [
        defineField({
          name: "duration",
          title: bilingualTitle("duration"),
          type: "string",
        }),
        defineField({
          name: "customMonths",
          title: bilingualTitle("customMonths"),
          type: "number",
        }),
        defineField({
          name: "contractStart",
          title: bilingualTitle("contractStart"),
          type: "date",
        }),
        defineField({
          name: "payment",
          title: bilingualTitle("payment"),
          type: "string",
        }),
        defineField({
          name: "annualRent",
          title: bilingualTitle("annualRent"),
          type: "number",
        }),
        defineField({
          name: "feeBreakdown",
          title: "Fee breakdown snapshot",
          type: "object",
          fields: [
            defineField({
              name: "years",
              title: bilingualTitle("feeYears"),
              type: "number",
            }),
            defineField({
              name: "government",
              title: bilingualTitle("feeGovernment"),
              type: "number",
            }),
            defineField({
              name: "company",
              title: bilingualTitle("feeCompany"),
              type: "number",
            }),
            defineField({
              name: "total",
              title: bilingualTitle("feeTotal"),
              type: "number",
            }),
          ],
        }),
        defineField({
          name: "notes",
          title: bilingualTitle("notes"),
          type: "text",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      requestNo: "requestNo",
      contractType: "contractType",
      status: "status",
    },
    prepare({ requestNo, contractType, status }) {
      return {
        title: `${requestNo ?? "No number"} - ${contractType ?? "?"}`,
        subtitle: `Status: ${status ?? "?"}`,
      };
    },
  },
});
