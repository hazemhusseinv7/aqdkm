import {
  MdBadge,
  MdCancel,
  MdCheckCircle,
  MdDoneAll,
  MdFolder,
  MdGavel,
  MdHourglassTop,
  MdInbox,
  MdMail,
  MdMarkChatUnread,
  MdPerson,
  MdPageview,
  MdRateReview,
} from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { HiTicket } from "react-icons/hi2";
import { RiArticleFill, RiSettingsFill } from "react-icons/ri";
import { FaBuilding, FaHome } from "react-icons/fa";

import type { StructureBuilder, StructureResolver } from "sanity/structure";

import { apiVersion } from "./env";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
const SINGLETONS = ["siteSettings", "testimonials", "features", "licenses"];
const CUSTOM_GROUPS = [
  "rentalRequest",
  "contactMessage",
  "subscriber",
  "post",
  "category",
  "author",
  "legalPage",
];

function singletonItem(
  S: StructureBuilder,
  typeName: string,
  title: string,
  icon: typeof RiSettingsFill,
) {
  return S.listItem()
    .id(typeName)
    .schemaType(typeName)
    .title(title)
    .icon(icon)
    .child(S.document().schemaType(typeName).documentId(typeName).title(title));
}

const STATUSES = [
  { id: "new", title: "New", icon: MdInbox },
  { id: "reviewing", title: "Under review", icon: MdHourglassTop },
  { id: "approved", title: "Approved", icon: MdCheckCircle },
  { id: "completed", title: "Completed", icon: MdDoneAll },
  { id: "cancelled", title: "Cancelled", icon: MdCancel },
];

function statusItems(S: StructureBuilder, contractType?: string) {
  return STATUSES.map((status) =>
    S.listItem()
      .title(status.title)
      .icon(status.icon)
      .child(
        S.documentList()
          .apiVersion(apiVersion)
          .title(status.title)
          .schemaType("rentalRequest")
          .filter(
            contractType
              ? '_type == "rentalRequest" && contractType == $contractType && status == $status'
              : '_type == "rentalRequest" && status == $status',
          )
          .params(
            contractType
              ? { status: status.id, contractType }
              : { status: status.id },
          )
          .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
      ),
  );
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singletonItem(S, "siteSettings", "Site Settings", RiSettingsFill),

      S.divider(),

      S.listItem()
        .title("Requests")
        .icon(HiTicket)
        .child(
          S.list()
            .title("Requests")
            .items([
              S.listItem()
                .title("All requests")
                .icon(HiTicket)
                .child(
                  S.documentTypeList("rentalRequest")
                    .title("All requests")
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),

              S.divider(),

              ...statusItems(S),
            ]),
        ),

      S.listItem()
        .title("Residential")
        .icon(FaHome)
        .child(
          S.list()
            .title("Residential")
            .items([
              S.listItem()
                .title("All residential")
                .icon(FaHome)
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .title("All residential")
                    .schemaType("rentalRequest")
                    .filter(
                      '_type == "rentalRequest" && contractType == "residential"',
                    )
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),

              S.divider(),

              ...statusItems(S, "residential"),
            ]),
        ),

      S.listItem()
        .title("Commercial")
        .icon(FaBuilding)
        .child(
          S.list()
            .title("Commercial")
            .items([
              S.listItem()
                .title("All commercial")
                .icon(FaBuilding)
                .child(
                  S.documentList()
                    .apiVersion(apiVersion)
                    .title("All commercial")
                    .schemaType("rentalRequest")
                    .filter(
                      '_type == "rentalRequest" && contractType == "commercial"',
                    )
                    .defaultOrdering([
                      { field: "submittedAt", direction: "desc" },
                    ]),
                ),

              S.divider(),

              ...statusItems(S, "commercial"),
            ]),
        ),

      S.listItem()
        .title("Messages")
        .icon(MdMarkChatUnread)
        .child(
          S.documentTypeList("contactMessage")
            .title("Messages")
            .defaultOrdering([{ field: "submittedAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("Newsletter")
        .icon(MdMail)
        .child(
          S.documentTypeList("subscriber")
            .title("Subscribers")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),

      S.listItem()
        .title("Blog")
        .icon(RiArticleFill)
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("post")
                .title("Posts")
                .icon(RiArticleFill)
                .child(
                  S.documentTypeList("post")
                    .title("Posts")
                    .defaultOrdering([
                      { field: "publishedAt", direction: "desc" },
                    ]),
                ),
              S.documentTypeListItem("category")
                .title("Categories")
                .icon(MdFolder),
              S.documentTypeListItem("author").title("Authors").icon(MdPerson),
            ]),
        ),

      S.divider(),

      S.listItem()
        .title("Legal")
        .icon(MdGavel)
        .child(
          S.documentTypeList("legalPage")
            .title("Legal pages")
            .defaultOrdering([{ field: "_createdAt", direction: "asc" }]),
        ),

      S.divider(),

      S.listItem()
        .title("Homepage")
        .icon(MdPageview)
        .child(
          S.list()
            .title("Homepage")
            .items([
              singletonItem(S, "testimonials", "Testimonials", MdRateReview),
              singletonItem(S, "features", "Features", IoCheckmarkDoneCircle),
              singletonItem(S, "licenses", "Licenses", MdBadge),
            ]),
        ),

      S.divider(),

      ...S.documentTypeListItems().filter(
        (item) =>
          ![...SINGLETONS, ...CUSTOM_GROUPS].includes(item.getId() ?? ""),
      ),
    ]);
