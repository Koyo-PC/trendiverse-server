#!/bin/sh

# rest api
cd /assets/rest-api
npm ci
node index.js &

# twitter api
cd /assets/twitter-api
npm ci
node index.js &
cd /assets/twitter-api/cron
node cron.js &

# google api
cd /assets/google-api
npm ci
node index.js &

wait
