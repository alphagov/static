# Emergency banner

See the [opsmanual](https://docs.publishing.service.gov.uk/manual/emergency-publishing.html#adding-emergency-publishing-banners) for information about what the Emergency Banner is and when it should be deployed.

## Running the Emergency Banner locally

### Deploying the Emergency banner

```
bundle exec rake emergency_banner:deploy['{campaign_class}','{heading}','{short_description}','{link}']
```

Where

* `campaign_class` is the colour of the banner. At the moment this is should be one of black, red or green
* `heading` is the \<H1\> title
* `short_description` is the text that appears under the title
* `link` is the more information link

N.B. Don't add spaces between the parameters.

### Removing the Emergency banner

```
bundle exec rake emergency_banner:remove
```
