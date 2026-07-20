sed -i "s/await logAction({/await logAction('Logout', 'Authentication', profile?.displayName || 'Unknown User', 'User logged out manually');\n    \/\/ {/g" src/contexts/AuthContext.tsx
