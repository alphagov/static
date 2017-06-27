# 2. Add Enhanced E-commerce plugin

Date: 2017-06-27

## Status

Accepted

## Context

Rendering apps track pageviews and events to help us measure the performance
of GOV.UK.

Static uses an [abstraction layer](https://github.com/alphagov/govuk_frontend_toolkit/blob/master/docs/analytics.md) in GOV.UK Frontend Toolkit, which reports the data to Google Analytics (but the underlying provider could be changed).

For analysing search performance, we want to be able to reliably track clickthrough rates for search result links.

[Enhanced E-Commerce](https://developers.google.com/analytics/devguides/collection/analyticsjs/enhanced-ecommerce) is a plugin for google analytics that can track impressions as well as clicks. We model each search result page as a "product list", and each content item as a "product".

## Decision

We added a plugin for E-Commerce to Static, so we could try using it
to measure search performance.

We didn't add an abstraction layer to GOV.UK Frontend Toolkit, because we don't
know if there is a wider need for it, and we wanted to validate our use case with GOV.UK data. The code could be moved to the Frontend Toolkit at a later date if necessary.

We're sending the search query as a custom dimension. This is a workaround: without the custom dimension, Enhanced-Ecommerce
can infer it from the path, but only for impression data. We couldn't get it to set the query for the click data.

For each "product" we send the id, position, and list ('site search result'). To avoid unnecessary data transfer when users are interacting with the page, we use Query Time Imports to add
metadata to products later.

We use publishing platform `content_id` as the unique id where available, and use the path as a fallback.

## Consequences

We are sending more data from the user agent than we used to on search result pages, but this shouldn't delay the initial page load.

There is a limit of 8k on the size of any event we send. We truncate search result links to avoid hitting this limit when a page of results contains results with very long URLs.

Newly published content will be missing custom dimensions in google analytics until we've uploaded
the query time import. We plan on importing this data nightly.

Because the query time data is regularly refreshed, data can potentially disappear if content is removed from search. If this becomes a problem, we should move the source of this data from Rummager to Publishing API, which knows about unpublished content.

Additional product lists can be set up for navigation pages or sidebar links on GOV.UK, but we may need to adapt the what we send for the "query" dimension.

Google analytics loads plugins at runtime, so by adding another one we've increased our dependence on 3rd party javascript that we can't audit as easily as javascript we host ourselves.
