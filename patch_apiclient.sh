sed -i 's/const json = await res.json();/let json;\n    try { json = await res.json(); } catch(e) { return null; }/g' src/services/apiClient.ts
