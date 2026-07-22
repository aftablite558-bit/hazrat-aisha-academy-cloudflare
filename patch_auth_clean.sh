sed -i '/uid: user.id || user.uid/d' src/contexts/AuthContext.tsx
sed -i '/name: profile?.displayName/d' src/contexts/AuthContext.tsx
sed -i '/role: profile?.role || .unknown./d' src/contexts/AuthContext.tsx
sed -i '/action: .LOGOUT./d' src/contexts/AuthContext.tsx
sed -i '/status: .SUCCESS./d' src/contexts/AuthContext.tsx
sed -i '/device: navigator.platform/d' src/contexts/AuthContext.tsx
sed -i '/browser: navigator.userAgent/d' src/contexts/AuthContext.tsx
sed -i '/});/d' src/contexts/AuthContext.tsx
