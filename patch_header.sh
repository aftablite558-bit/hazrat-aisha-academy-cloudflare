sed -i 's/const { profile, logout } = useAuth();/const { profile, logoutUser } = useAuth();/g' src/components/layout/Header.tsx
sed -i 's/onClick={logout}/onClick={logoutUser}/g' src/components/layout/Header.tsx
