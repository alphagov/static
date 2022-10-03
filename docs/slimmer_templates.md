# Slimmer Templates

## `gem_layout` (default)

This template uses the [public layout component] from the GOV.UK Publishing Components gem. It supplies the header and footer only - this includes the cookie banner, skip to content link, header bar, emergency banner, survey banner, global bar, feedback, and footer. The content is constrained and centred.

## `gem_layout_full_width`

This is the same as the `gem_layout` template, except that this layout **doesn't** constrain and centre the content to the same width as the GOV.UK header.

Use this layout if you want to have full width content - such as the blue welcome bar on the GOV.UK homepage.

## `gem_layout_homepage`

Same as the `gem_layout_full_width` template, except this layout is only used on the home page. The only difference is that `homepage` has been set which will apply specific homepage styles to the emergency banner component (if present).

## `gem_layout_account_manager`

This is intended as a skeleton wrapper for account pages. It is intended to be used when we need a page rendered by another frontend app to look like a GOV.UK account page.

This layout omits the default feedback component for GOVUK as the account pages use a different one from the rest of GOV.UK. Instead it introduces an account-specific phase banner. It also purposefully omits the global bar and user satisfaction survey bar.

[public layout component]: https://components.publishing.service.gov.uk/component-guide/layout_for_public
