import re
import os

files = {
    'Students.tsx': 'filteredStudents',
    'Teachers.tsx': 'filteredTeachers',
    'Staff.tsx': 'filteredStaff',
    'Classes.tsx': 'filteredClasses',
    'Sections.tsx': 'filteredSections',
    'Subjects.tsx': 'filteredSubjects'
}

for filename, var_name in files.items():
    path = os.path.join('src', 'pages', 'dashboard', 'master', filename)
    with open(path, 'r') as f:
        content = f.read()

    # Add state for pagination
    state_injection = """
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return %s.slice(startIndex, startIndex + itemsPerPage);
  }, [%s, currentPage]);

  const totalPages = Math.ceil(%s.length / itemsPerPage);
""" % (var_name, var_name, var_name)
    
    # insert before handleAdd
    content = content.replace('  const handleAdd = () => {', state_injection + '\n  const handleAdd = () => {')

    # reset page on search
    content = content.replace('setSearchTerm(e.target.value)}', 'setSearchTerm(e.target.value); setCurrentPage(1);}')

    # use paginatedData in the render loop instead of var_name
    content = content.replace('%s.map(' % var_name, 'paginatedData.map(')
    content = content.replace('%s.length === 0' % var_name, 'paginatedData.length === 0')

    # insert pagination component below GlassTable
    pagination_injection = """      </GlassTable>

      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />"""
    content = content.replace('      </GlassTable>', pagination_injection)

    with open(path, 'w') as f:
        f.write(content)
print("Done patching.")
