# Slimmer Templates

## `gem_layout`

This template uses the [public layout component] from the GOV.UK Publishing Components gem. It supplies the header and footer only - this includes the cookie banner, skip to content link, header bar, emergency banner, survey banner, global bar, feedback, and footer. The content is constrained and centred.

## `gem_layout_full_width`

This is the same as the `gem_layout` template, except that this layout **doesn't** constrain and centre the content to the same width as the GOV.UK header.

Use this layout if you want to have full width content - such as the blue welcome bar on the GOV.UK homepage.

## `core_layout` (default)

This template contains styles for the black header bar, the footer and core layout classes. By default it will centre your content to the same width as the GOV.UK header. It provides classes for grid layouts using the column mixins from the frontend toolkit.

This layout uses deprecated dependencies.

## `header_footer_only`

This template only contains styles for the black header bar and the footer of GOV.UK.

Use this layout if you want to explicitly control the full layout of your page including centering all the content.

This layout uses deprecated dependencies.

[public layout component]: https://components.publishing.service.gov.uk/component-guide/layout_for_public
