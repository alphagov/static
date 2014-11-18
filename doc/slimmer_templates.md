# Slimmer Templates

## `wrapper`

This is the standard template that all applications that install slimmer will
get. It historically contained all the styles for GOV.UK.

It is not recommended new applications use this template and instead use one of
the other templates.

## `header_footer_only`

This template only contains styles for the black header bar and the footer of
GOV.UK.

Use this layout if you want to explicitly control the full layout of your page
including centering all the content.

## `core_layout`

This template contains styles for the black header bar, the footer and core
layout classes. By default it will center your content to the same width as the
GOV.UK header. It provides classes for grid layouts using the column mixins
from the frontend toolkit.

It is recommended that new applications use this template so they behave in a
consistent way.

