sed -i 's/const \[searchResult, setSearchResult\] = useState<any>(null);/const \[searchResult, setSearchResult\] = useState<any>(null);\n  const \[isSearching, setIsSearching\] = useState(false);/' src/pages/public/PublicAttendance.tsx

sed -i 's/const handleSearch = (e: React.FormEvent) => {/const handleSearch = (e: React.FormEvent) => {\n    e.preventDefault();\n    setIsSearching(true);\n    setTimeout(() => {\n      performSearch();\n      setIsSearching(false);\n    }, 800);\n  };\n  const performSearch = () => {/' src/pages/public/PublicAttendance.tsx

sed -i 's/<form onSubmit={handleSearch}/<form onSubmit={handleSearch}/' src/pages/public/PublicAttendance.tsx
