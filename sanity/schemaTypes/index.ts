import { type SchemaTypeDefinition } from "sanity";

import { rentalRequest } from "./rentalRequest";
import { contactMessage } from "./contactMessage";
import { subscriber } from "./subscriber";
import { siteSettings } from "./siteSettings";
import { post } from "./post";
import { category } from "./category";
import { author } from "./author";
import { legalPage } from "./legalPage";
import { testimonials } from "./testimonials";
import { features } from "./features";
import { licenses } from "./licenses";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [rentalRequest, contactMessage, subscriber, siteSettings, post, category, author, legalPage, testimonials, features, licenses],
};
