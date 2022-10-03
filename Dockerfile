ARG base_image=ghcr.io/alphagov/govuk-ruby-base:3.1.2
ARG builder_image=ghcr.io/alphagov/govuk-ruby-builder:3.1.2

FROM $builder_image AS builder

ENV GOVUK_APP_NAME=static

WORKDIR /app

COPY Gemfile* .ruby-version /app/
RUN bundle install

COPY . /app

RUN bundle exec rails assets:precompile && rm -fr /app/log


FROM $base_image

ENV GOVUK_APP_NAME=static

COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY --from=builder /app /app
RUN mkdir -p /app/public/templates && chown -R 1001:1001 /app/public/templates

USER app
WORKDIR /app

CMD bundle exec puma
