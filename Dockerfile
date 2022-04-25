ARG base_image=ruby:2.7.5-slim-buster
 
FROM $base_image AS builder

ENV RAILS_ENV=production GOVUK_APP_NAME=static

RUN apt-get update -qq && \
    apt-get upgrade -y && \
    apt-get install -y build-essential nodejs && \
    apt-get clean

RUN mkdir /app

WORKDIR /app

COPY Gemfile* .ruby-version /app/

RUN bundle config set deployment 'true' && \
    bundle config set without 'development test' && \
    bundle install --jobs 4 --retry=2

COPY . /app

RUN GOVUK_WEBSITE_ROOT=https://www.gov.uk GOVUK_APP_DOMAIN=www.gov.uk bundle exec rails assets:precompile

FROM $base_image
 
ENV RAILS_ENV=production GOVUK_APP_NAME=static
 
RUN apt-get update -qy && \
    apt-get upgrade -y && \
    apt-get install -y nodejs
 
RUN groupadd -g 1001 appuser && \
    useradd appuser -u 1001 -g 1001 --home /app
 
COPY --from=builder /usr/local/bundle/ /usr/local/bundle/
COPY --from=builder /app /app
RUN mkdir -p /app/public/templates && chown -R 1001:1001 /app/public/templates

USER appuser
WORKDIR /app

CMD bundle exec puma
