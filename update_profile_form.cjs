const fs = require('fs');
let file = 'src/pages/dashboard/enterprise/ProfileSettings.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/const \[formData, setFormData\] = useState\(\{/, `const [formData, setFormData] = useState({
    username: '',`);

c = c.replace(/displayName: profile\.displayName \|\| profile\.username \|\| '',/, `username: profile.username || '',
        displayName: profile.displayName || profile.username || '',`);

c = c.replace(/await api\.post\(\`\/collection\/users\/\$\{profile\.uid\}\/update\`\, \{/, `await api.post(\`/collection/users/\${profile.uid}/update\`, {
        username: formData.username,`);

c = c.replace(/loginUser\(\{ \.\.\.profile\, id: profile\.uid\, email: profile\.email \|\| '', displayName: formData\.displayName\, phone: formData\.phone \}\);/, `loginUser({ ...profile, id: profile.uid, email: profile.email || '', username: formData.username, displayName: formData.displayName, phone: formData.phone });`);

c = c.replace(/onChange=\{\(e\) => setFormData\(\{\.\.\.formData, displayName: e\.target\.value\}\)\}\n                   required \n                 \/>/, `onChange={(e) => setFormData({...formData, displayName: e.target.value})}
                   required 
                 />
                <GlassInput 
                  label="Username" 
                  value={formData.username} 
                  onChange={(e) => setFormData({...formData, username: e.target.value})} 
                  required 
                />`);

fs.writeFileSync(file, c);
