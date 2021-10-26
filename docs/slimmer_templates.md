# Slimmer Templates

## `gem_layout`

This template uses the [public layout component] from the GOV.UK Publishing Components gem. It supplies the header and footer only - this includes the cookie banner, skip to content link, header bar, emergency banner, survey banner, global bar, feedback, and footer. The content is constrained and centred.

## `gem_layout_full_width`

This is the same as the `gem_layout` template, except that this layout **doesn't** constrain and centre the content to the same width as the GOV.UK header.

Use this layout if you want to have full width content - such as the blue welcome bar on the GOV.UK homepage.

## `gem_layout_account_manager`

This is intended as a skeleton wrapper for account pages. It is intended to be used when we need a page rendered by another frontend app to look like a page from `govuk-account-manager-prototype`.

This layout omits the default feedback component for GOVUK as the account pages use a different one from the rest of GOV.UK. Instead it introduces an account-specific phase banner, account feedback prompt, and an account nav component. It also purposefully omits the global bar and user satisfaction survey bar.

This also includes the Account product name in the layout header and changes the logo link to the account homepage link.


## `gem_layout_account_manager_no_nav`

Same as the `gem_layout_account_manager`, but displays without the account nav component.


## `core_layout` (default)

This template contains styles for the black header bar, the footer and core layout classes. By default it will centre your content to the same width as the GOV.UK header. It provides classes for grid layouts using the column mixins from the frontend toolkit.

This layout uses deprecated dependencies.

## `header_footer_only`

This template only contains styles for the black header bar and the footer of GOV.UK.

Use this layout if you want to explicitly control the full layout of your page including centering all the content.

This layout uses deprecated dependencies.

[public layout component]: https://components.publishing.service.gov.uk/component-guide/layout_for_public
