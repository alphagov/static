# Image optimisation

## Why?

PNGs, GIFs and some other image formats can be optimised to make the images
smaller without losing any quality.  Smaller image files can be downloaded
quicker by web browsers, and this can significantly improve user experience.

## How?

Images should be compressed before committing them to git.  This can be done via:

```
bundle exec image_optim --no-pngcrush --no-svgo -r app/
```

This may require some extra binaries to be installed on your system - please
read the output of the above command or see https://github.com/toy/image_optim
for more details.
