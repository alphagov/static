FROM ruby:2.7.5-slim-buster
RUN apt-get update -qq && apt-get upgrade -y && apt-get install -y build-essential nodejs && apt-get clean

# This image is only intended to be able to run this app in a production RAILS_ENV
ENV RAILS_ENV production

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

RUN groupadd -g 1001 appGroup && useradd appUser -u 1001 -g 1001 -m --home /home/appUser
RUN chown appUser /app/public

RUN GOVUK_WEBSITE_ROOT=https://www.gov.uk GOVUK_APP_DOMAIN=www.gov.uk bundle exec rails assets:precompile

CMD bundle exec puma
