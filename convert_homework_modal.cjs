const fs = require('fs');
let file = 'src/components/dashboard/academic/HomeworkFormModal.tsx';
let c = fs.readFileSync(file, 'utf8');

c = c.replace("import { GlassCard } from '../../common/GlassCard';", "import { GlassCard } from '../../common/GlassCard';\nimport { GlassModal } from '../../common/GlassModal';");

const oldReturn = `  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-6">
          {initialData ? 'Edit Homework' : 'Add New Homework'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">`;

const newReturn = `  return (
    <GlassModal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Homework' : 'Add New Homework'} 
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">`;

c = c.replace(oldReturn, newReturn);

const oldFooter = `        </form>
      </GlassCard>
    </div>
  );
};`;
const newFooter = `        </form>
    </GlassModal>
  );
};`;
c = c.replace(oldFooter, newFooter);

fs.writeFileSync(file, c);
