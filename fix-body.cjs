const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf-8');
content = content.replace(
  `  body {
    @apply text-foreground font-sans min-h-screen relative;`,
  `  body {
    @apply text-foreground font-sans min-h-screen relative overflow-x-hidden;
    width: 100%;`
);
fs.writeFileSync('src/index.css', content);
