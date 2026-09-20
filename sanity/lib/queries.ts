import { defineQuery } from "groq";

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_id == "siteSettings"][0]{ fees, supportPhone, email, gaMeasurementId, gtmId, socialLinks[]{ platform, url }, faqs[]{ _key, question, answer[]{ _key, _type, ..., markDefs[]{ _key, ... } } } }`,
);

export const REQUESTS_ALL_QUERY = defineQuery(
  `*[_type == "rentalRequest"] | order(submittedAt desc){
    _id,
    requestNo,
    contractType,
    status,
    submittedAt
  }`,
);

export const POSTS_INDEX_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc)[$offset...$end]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    cover{ alt, caption, asset-> },
    categories[]->{ _id, title, "slug": slug.current },
    author->{ name, role }
  }`,
);

export const POSTS_COUNT_QUERY = defineQuery(
  `count(*[_type == "post" && defined(slug.current) && defined(publishedAt)])`,
);

export const LATEST_POSTS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current) && defined(publishedAt)] | order(publishedAt desc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    cover{ alt, caption, asset-> },
    categories[]->{ _id, title, "slug": slug.current },
    author->{ name, role }
  }`,
);

export const POST_SLUGS_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current)][].slug.current`,
);

export const POST_DETAIL_QUERY = defineQuery(
  `*[_type == "post" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    cover{ alt, caption, asset-> },
    categories[]->{ _id, title, "slug": slug.current },
    author->{ name, role, bio, avatar{ alt, asset-> } },
    body[]{
      _key,
      _type,
      ...,
      markDefs[]{
        _key,
        ...,
        _type == "link" => { "href": @.href }
      },
      _type == "image" => { asset-> }
    }
  }`,
);

export const CATEGORIES_QUERY = defineQuery(
  `*[_type == "category"] | order(title asc){
    _id,
    title,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && references(^._id) && defined(publishedAt)])
  }`,
);

export const POSTS_BY_CATEGORY_QUERY = defineQuery(
  `*[_type == "post" && defined(slug.current) && defined(publishedAt) && $categorySlug in categories[]->slug.current] | order(publishedAt desc){
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    cover{ alt, caption, asset-> },
    categories[]->{ _id, title, "slug": slug.current },
    author->{ name, role }
  }`,
);

export const REQUEST_DETAIL_QUERY = defineQuery(
  `*[_type == "rentalRequest" && requestNo == $requestNo][0]{
    requestNo,
    contractType,
    status,
    submittedAt,
    applicant{ role, isAgent, agencyNumber, phone, nationalId },
    counterparty{
      counterType, fullName, nationalId, phone, dob, unifiedNumber,
      entityName, repId, repPhone, repDob, authNumber
    },
    property{
      deedNumber, deedDate, propertyType, propertyCustom, unitType, unitCustom,
      unitNumber, floor, floorCustom, area, bedrooms, bedroomsCustom,
      bathrooms, bathroomsCustom, extras, livingRooms,
      electroMeter, waterMeter, activity, hasLicense, licenseNumber
    },
    location{ mapsLink, city, buildingNumber, additionalNumber, postalCode },
    terms{
      duration, customMonths, contractStart, payment, annualRent, feePayer,
      feeBreakdown{ years, government, company, total }, notes
    }
  }`,
);

export const REQUEST_STATUS_QUERY = defineQuery(
  `*[_type == "rentalRequest" && requestNo == $requestNo][0]{
    requestNo,
    contractType,
    status,
    submittedAt,
    "feeTotal": terms.feeBreakdown.total,
    "annualRent": terms.annualRent,
    "feePayer": terms.feePayer
  }`,
);

export const SUBSCRIBER_BY_EMAIL_QUERY = defineQuery(
  `*[_type == "subscriber" && email == $email][0]{ _id, email, status, confirmToken, tokenExpiresAt, resendContactId }`,
);

export const SUBSCRIBER_BY_TOKEN_QUERY = defineQuery(
  `*[_type == "subscriber" && confirmToken == $tok][0]{ _id, email, status, confirmToken, tokenExpiresAt, resendContactId }`,
);

export const BROADCAST_CANDIDATE_QUERY = defineQuery(
  `*[_type == "post" && _id == $id][0]{ _id, title, "slug": slug.current, excerpt, cover, publishedAt, broadcastSentAt, broadcastId }`,
);
