sed -i '/const filteredHomeworks = useMemo/,/}, \[homeworks, selectedStudent\]);/c\
  const filteredHomeworks = useMemo(() => {\
    let filtered = homeworks;\
    if (selectedStudent) {\
      filtered = homeworks.filter(hw => hw.classId === selectedStudent.classId);\
    }\
    return filtered.sort((a,b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());\
  }, [homeworks, selectedStudent]);' src/pages/dashboard/academic/Homework.tsx
