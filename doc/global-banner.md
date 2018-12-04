## Global banner

A site-wide banner can be activated to convey important information on GOV.UK which is not deemed emergency level information.
The file `app/views/notifications/_global_bar.html.erb` contains the necessary minified JS and markup to activate and render the banner.

### Activating the global banner

In `app/views/notifications/_global_bar.html.erb`

1. Update the variables `title`, `information`, `link_href` and `link_text` with the relevant info.
2. Update the `show_global_bar` variable to `true`
3. Deploy static

The usual rules apply with static template caching.

![screenshot](/doc/global-banner.png?raw=true)
