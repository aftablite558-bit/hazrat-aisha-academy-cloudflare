# PublicResults.tsx
sed -i "/const { data: sections }/d" src/pages/public/PublicResults.tsx
sed -i "/const getSectionName/d" src/pages/public/PublicResults.tsx
sed -i "s/ - {getSectionName(searchResult.student.sectionId)}//g" src/pages/public/PublicResults.tsx

# PublicHomework.tsx
sed -i "/const { data: sections }/d" src/pages/public/PublicHomework.tsx
sed -i "/const \[sectionId, setSectionId\]/d" src/pages/public/PublicHomework.tsx
sed -i "/const matchSection = sectionId/d" src/pages/public/PublicHomework.tsx
sed -i "s/ matchSection \&\&//g" src/pages/public/PublicHomework.tsx
sed -i "s/, sectionId//g" src/pages/public/PublicHomework.tsx
sed -i "/const getSectionName/d" src/pages/public/PublicHomework.tsx
sed -i "/value={sectionId}/,+3d" src/pages/public/PublicHomework.tsx
sed -i "s/ - {getSectionName(hw.sectionId)}//g" src/pages/public/PublicHomework.tsx

