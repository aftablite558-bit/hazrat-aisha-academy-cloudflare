sed -i '82,94c\
          options={classes.map(c => ({ label: c.className || (c as any).name, value: c.id }))}' src/components/dashboard/master/StudentFormModal.tsx
