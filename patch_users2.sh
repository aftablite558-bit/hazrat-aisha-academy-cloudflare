sed -i 's/name: formName,/username: formName, displayName: formName,/g' src/pages/dashboard/enterprise/Users.tsx
sed -i 's/u.displayName/u.displayName || u.username/g' src/pages/dashboard/enterprise/Users.tsx
