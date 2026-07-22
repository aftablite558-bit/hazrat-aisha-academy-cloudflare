sed -i "/const DashboardStudents/i const ProfileSettings = lazy(() => import('../pages/dashboard/enterprise/ProfileSettings').then(m => ({ default: m.ProfileSettings })));" src/routes/AppRoutes.tsx
