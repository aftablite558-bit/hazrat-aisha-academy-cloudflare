sed -i 's/const { profile, refreshProfile } = useAuth();/const { profile, loginUser } = useAuth();/g' src/pages/dashboard/enterprise/ProfileSettings.tsx
sed -i 's/refreshProfile();/loginUser({ ...profile, displayName: formData.displayName, phone: formData.phone });/g' src/pages/dashboard/enterprise/ProfileSettings.tsx
