const fs = require('fs');
let file = 'src/components/dashboard/academic/HomeworkFormModal.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace(/<div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black\/50 backdrop-blur-sm">[\s\S]*?<form onSubmit=\{handleSubmit\} className="space-y-4">/, `<GlassModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Homework' : 'Add New Homework'} 
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">`);

fs.writeFileSync(file, c);
