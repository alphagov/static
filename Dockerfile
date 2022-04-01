FROM ruby:2.7.5-slim-buster
RUN apt-get update -qq && apt-get upgrade -y && apt-get install -y build-essential nodejs && apt-get clean

# This image is only intended to be able to run this app in a production RAILS_ENV
ENV RAILS_ENV production
RUN bundle config set force_ruby_platform true

ENV GOVUK_APP_NAME static
ENV REDIS_URL redis://redis
ENV PORT 3013

ENV APP_HOME /app
RUN mkdir $APP_HOME
 
WORKDIR $APP_HOME
ADD .ruby-version $APP_HOME/
ADD Gemfile* $APP_HOME/
RUN bundle config set deployment 'true'
RUN bundle config set without 'development test'
RUN bundle install --jobs 4

ADD . $APP_HOME

RUN GOVUK_WEBSITE_ROOT=https://www.gov.uk GOVUK_APP_DOMAIN=www.gov.uk bundle exec rails assets:precompile

RUN chmod -R 776 ${APP_HOME}/app

CMD bundle exec puma
