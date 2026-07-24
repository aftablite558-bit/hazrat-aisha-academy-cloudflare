#!/bin/bash
sed -i 's/import { useMasterData } from '"'"'..\/..\/..\/hooks\/useMasterData'"'"';/import { useMasterData } from '"'"'..\/..\/..\/hooks\/useMasterData'"'"';\nimport { Class } from '"'"'..\/..\/..\/types\/master'"'"';/' src/pages/dashboard/enterprise/Fees.tsx

# Add classes hook
sed -i 's/const { data: fees, loading, addRecord, updateRecord, deleteRecord } = useMasterData<StudentFee>('"'"'fees'"'"');/const { data: fees, loading, addRecord, updateRecord, deleteRecord } = useMasterData<StudentFee>('"'"'fees'"'"');\n  const { data: classes } = useMasterData<Class>('"'"'classes'"'"');/' src/pages/dashboard/enterprise/Fees.tsx

# Change table display
sed -i 's/<div className="text-xs text-muted-foreground">Class: {f.classId}<\/div>/<div className="text-xs text-muted-foreground">Class: {classes.find(c => c.id === f.classId)?.className || f.classId}<\/div>/' src/pages/dashboard/enterprise/Fees.tsx

# Change form input to select
sed -i 's/<GlassInput required label="Class" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} \/>/<GlassSelect required label="Class" value={formData.classId} onChange={e => setFormData({...formData, classId: e.target.value})} options={[{label:"Select Class", value:""}, ...classes.map(c => ({label: c.className || (c as any).name, value: c.id}))]} \/>/' src/pages/dashboard/enterprise/Fees.tsx

