sed -i "/const { data: students/a \  const { data: classes } = useMasterData<Class>('classes', true);" src/pages/dashboard/master/Students.tsx
sed -i "/import { Student /s/Student/Student, Class/" src/pages/dashboard/master/Students.tsx
sed -i "s/<td>{student.classId}<\/td>/<td>{classes.find(c => c.id === student.classId)?.className || (classes.find(c => c.id === student.classId) as any)?.name || student.classId}<\/td>/g" src/pages/dashboard/master/Students.tsx
