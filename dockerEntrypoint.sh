#!/bin/sh
echo '---- Starting Server ----'

echo '---- ls /app ----'
ls -ln /app

echo '---- ls /app/biuild ----'
ls -ln /app/build

echo '---- ls /schema ----'
ls -ln /app/src/lib/server/db/migrations

echo '---- Run ----'
node -r dotenv/config build