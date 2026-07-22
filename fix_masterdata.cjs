const fs = require('fs');
let file = 'src/hooks/useMasterData.ts';
let c = fs.readFileSync(file, 'utf8');
c = c.replace(/Partial<Omit<T, 'id' \|dataToSave\|dataToSave =>/g, "Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>) =>");
fs.writeFileSync(file, c);
