sed -i 's/status: initialData.status/status: (initialData as any).status || '"'"'Active'"'"'/g' src/components/dashboard/academic/HomeworkFormModal.tsx
