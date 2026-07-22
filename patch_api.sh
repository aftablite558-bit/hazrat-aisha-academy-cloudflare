sed -i 's/const values = Object.values(body);/const values = Object.values(body).map(v => (typeof v === "object" \&\& v !== null) ? JSON.stringify(v) : v);/g' functions/api/[[path]].ts

sed -i 's/\.bind(...Object.values(body), id)/\.bind(...Object.values(body).map(v => (typeof v === "object" \&\& v !== null) ? JSON.stringify(v) : v), id)/g' functions/api/[[path]].ts
