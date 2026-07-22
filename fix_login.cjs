const fs = require('fs');
let file = 'src/pages/auth/Login.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldUseEffect = `  useEffect(() => {
    if (user) {
     navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);`;

const newUseEffect = `  useEffect(() => {
    if (user) {
      const role = (user.role || 'user').toLowerCase();
      if (['admin', 'super_admin', 'principal', 'owner', 'staff'].includes(role)) {
        navigate('/dashboard', { replace: true });
      } else if (role === 'teacher') {
        navigate('/teacher', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [user, navigate]);`;

c = c.replace(oldUseEffect, newUseEffect);

const oldOnSubmit = `    try {
      const response = await api.post('/auth/login', data);
      if (response.success) {
        loginUser(response.user);
        addToast('Welcome back!', 'success');
        
      } else {`;

const newOnSubmit = `    try {
      const response = await api.post('/auth/login', data);
      if (response.success) {
        if (response.user.status === 'inactive' || response.user.status === 'suspended' || response.user.status === 'blocked') {
          setError(\`Access denied: User account is \${response.user.status}\`);
          addToast(\`Access denied: User account is \${response.user.status}\`, 'danger');
          setSubmitting(false);
          return;
        }
        loginUser(response.user);
        addToast('Welcome back!', 'success');
        
      } else {`;

c = c.replace(oldOnSubmit, newOnSubmit);
fs.writeFileSync(file, c);
