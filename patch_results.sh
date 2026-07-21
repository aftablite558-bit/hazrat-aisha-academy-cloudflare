sed -i 's/const \[searchResult, setSearchResult\] = useState<any>(null);/const \[searchResult, setSearchResult\] = useState<any>(null);\n  const \[isSearching, setIsSearching\] = useState(false);/' src/pages/public/PublicResults.tsx

sed -i 's/const handleSearch = (e: React.FormEvent) => {/const handleSearch = (e: React.FormEvent) => {\n    e.preventDefault();\n    setIsSearching(true);\n    setTimeout(() => {\n      performSearch();\n      setIsSearching(false);\n    }, 800);\n  };\n  const performSearch = () => {/' src/pages/public/PublicResults.tsx

sed -i 's/e.preventDefault();//g' src/pages/public/PublicResults.tsx

sed -i 's/{hasSearched && (/{isSearching ? (\n          <div className="flex justify-center p-12">\n            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"><\/div>\n          <\/div>\n        ) : hasSearched \&\& (/' src/pages/public/PublicResults.tsx
