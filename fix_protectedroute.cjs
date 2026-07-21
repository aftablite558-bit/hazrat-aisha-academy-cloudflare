const fs = require('fs');
let file = 'src/components/auth/ProtectedRoute.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldCheck = `  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
   return <Navigate to="/unauthorized" replace />;
  }`;

const newCheck = `  if (profile && (profile.status === 'inactive' || profile.status === 'suspended' || profile.status === 'blocked')) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
   return <Navigate to="/unauthorized" replace />;
  }`;

c = c.replace(oldCheck, newCheck);

fs.writeFileSync(file, c);
