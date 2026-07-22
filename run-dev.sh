#!/bin/sh
wrangler pages dev --port=3000 --proxy=5173 -- vite --port=5173 --host=127.0.0.1
