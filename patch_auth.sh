sed -i 's/user: any | null;/user: Record<string, unknown> | null;/g' src/contexts/AuthContext.tsx
sed -i 's/loginUser: (userData: any) => void;/loginUser: (userData: Record<string, unknown> \& { id: string, email: string, username?: string, role?: string }) => void;/g' src/contexts/AuthContext.tsx
sed -i 's/const \[user, setUser\] = useState<any | null>(null);/const \[user, setUser\] = useState<Record<string, unknown> | null>(null);/g' src/contexts/AuthContext.tsx
sed -i 's/const loginUser = (userData: any) => {/const loginUser = (userData: Record<string, unknown> \& { id: string, email: string, username?: string, role?: string }) => {/g' src/contexts/AuthContext.tsx
