sed -i 's/import { Class, Section, Subject, Teacher } from '"'"'..\/..\/types\/master'"'"';/import { Class, Subject, Teacher } from '"'"'..\/..\/types\/master'"'"';/g' src/pages/public/PublicHomework.tsx
sed -i 's/return matchClass && matchSection;/return matchClass;/g' src/pages/public/PublicHomework.tsx
