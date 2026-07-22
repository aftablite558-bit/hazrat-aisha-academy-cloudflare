#!/bin/sh
wrangler pages dev --port=3000 --ip=0.0.0.0 --proxy=5173 -- npm run dev:vite
