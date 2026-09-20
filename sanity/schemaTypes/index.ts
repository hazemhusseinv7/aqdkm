import { type SchemaTypeDefinition } from "sanity";

import { rentalRequest } from "./rentalRequest";
import { contactMessage } from "./contactMessage";
import { subscriber } from "./subscriber";
import { siteSettings } from "./siteSettings";
import { post } from "./post";
import { category } from "./category";
import { author } from "./author";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [rentalRequest, contactMessage, subscriber, siteSettings, post, category, author],
};
