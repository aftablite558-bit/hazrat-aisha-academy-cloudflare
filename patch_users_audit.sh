sed -i "/import { api }/a import { logAction } from '../../../services/auditService';" src/pages/dashboard/enterprise/Users.tsx
sed -i "/addToast('User account created successfully!', 'success');/a \      logAction('Create', 'Users', currentUser?.displayName || 'Admin', \`Created user \${formName}\`);" src/pages/dashboard/enterprise/Users.tsx
sed -i "/addToast(\`Account status updated to \${newStatus}\`, 'success');/a \      logAction('Edit', 'Users', currentUser?.displayName || 'Admin', \`Updated user \${uid} status to \${newStatus}\`);" src/pages/dashboard/enterprise/Users.tsx
sed -i "/addToast('User deleted successfully', 'success');/a \      logAction('Delete', 'Users', currentUser?.displayName || 'Admin', \`Deleted user \${uid}\`);" src/pages/dashboard/enterprise/Users.tsx
