#!/bin/sh

bundle exec rails db:prepare

rm -f  /api/tmp/pids/server.pid

bundle exec rails s -p 4000 -b '0.0.0.0'