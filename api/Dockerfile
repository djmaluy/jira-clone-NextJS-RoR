FROM ruby:3.4.5-trixie

RUN apt-get update -qq && apt-get install -y nodejs postgresql-client

WORKDIR /api

COPY Gemfile* ./
RUN bundle install

COPY . .
RUN chmod +x entrypoint.sh

EXPOSE 4000