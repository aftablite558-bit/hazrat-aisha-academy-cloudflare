sed -i "/const DashboardUsers/i const ProfileSettings = lazy(() => import('../pages/dashboard/enterprise/ProfileSettings').then(m => ({ default: m.ProfileSettings })));" src/routes/AppRoutes.tsx
sed -i "/<Route path=\"users\"/i \          <Route path=\"profile\" element={<ProfileSettings />} />" src/routes/AppRoutes.tsx
