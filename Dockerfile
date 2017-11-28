FROM ruby:2.4.2
RUN apt-get update -qq && apt-get upgrade -y && apt-get install -y build-essential nodejs && apt-get clean

ENV GOVUK_APP_NAME static
ENV RAILS_ENV development
ENV REDIS_URL redis://redis
ENV PORT 3013

ENV APP_HOME /app
RUN mkdir $APP_HOME

WORKDIR $APP_HOME
ADD .ruby-version $APP_HOME/
ADD Gemfile* $APP_HOME/
RUN bundle install

ADD . $APP_HOME

CMD bash -c "rm -f tmp/pids/server.pid && bundle exec rails s -p $PORT -b '0.0.0.0'"
