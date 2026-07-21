import { useState } from 'react';
import { GlassTable } from '../../common/GlassTable';
import { GlassButton } from '../../common/GlassButton';
import { GlassInput } from '../../common/GlassInput';
import { GlassSelect } from '../../common/GlassSelect';
import { GlassBadge } from '../../common/GlassBadge';
import { GlassModal } from '../../common/GlassModal';
import { ConfirmDialog } from '../../common/ConfirmDialog';
import { FeeCategoryName, FeeStructure, FeeStructureItem } from '../../../types/finance';
import { FEE_CATEGORIES } from '../../../utils/financeUtils';
import { Plus, Edit, Trash2, Layers, CheckCircle2, DollarSign } from 'lucide-react';
import { Class } from '../../../types/master';

interface FeeStructureManagerProps {
  structures: FeeStructure[];
  classes: Class[];
  onAdd: (structure: Partial<FeeStructure>) => Promise<void>;
  onUpdate: (id: string, structure: Partial<FeeStructure>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const FeeStructureManager = ({
  structures,
  classes,
  onAdd,
  onUpdate,
  onDelete
}: FeeStructureManagerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStructure, setSelectedStructure] = useState<FeeStructure | null>(null);

  const [name, setName] = useState('');
  const [session, setSession] = useState('2026-2027');
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  const [items, setItems] = useState<FeeStructureItem[]>([
    { category: 'Tuition Fee', amount: 1500, frequency: 'Monthly' },
    { category: 'Exam Fee', amount: 800, frequency: 'Term-wise' },
    { category: 'Annual Charge', amount: 2000, frequency: 'Annual' }
  ]);

  const handleOpenAdd = () => {
    setSelectedStructure(null);
    setName('');
    setSession('2026-2027');
    setSelectedClasses([]);
    setStatus('Active');
    setItems([
      { category: 'Tuition Fee', amount: 1500, frequency: 'Monthly' },
      { category: 'Exam Fee', amount: 800, frequency: 'Term-wise' },
      { category: 'Annual Charge', amount: 2000, frequency: 'Annual' }
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (struct: FeeStructure) => {
    setSelectedStructure(struct);
    setName(struct.name);
    setSession(struct.session);
    setSelectedClasses(struct.applicableClasses || []);
    setStatus(struct.status);
    setItems(struct.items || []);
    setIsModalOpen(true);
  };

  const handleToggleClass = (className: string) => {
    if (selectedClasses.includes(className)) {
      setSelectedClasses(selectedClasses.filter(c => c !== className));
    } else {
      setSelectedClasses([...selectedClasses, className]);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { category: 'Other Charges', amount: 500, frequency: 'Annual' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof FeeStructureItem, value: any) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const calculateTotalAnnual = () => {
    return items.reduce((total, item) => {
      const amt = Number(item.amount) || 0;
      switch (item.frequency) {
        case 'Monthly': return total + amt * 12;
        case 'Quarterly': return total + amt * 4;
        case 'Term-wise': return total + amt * 2;
        case 'Annual':
        case 'One-time': return total + amt;
        default: return total + amt;
      }
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const totalAnnualAmount = calculateTotalAnnual();

    const payload: Partial<FeeStructure> = {
      name,
      session,
      applicableClasses: selectedClasses,
      items,
      totalAnnualAmount,
      status
    };

    if (selectedStructure?.id) {
      await onUpdate(selectedStructure.id, payload);
    } else {
      await onAdd(payload);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Layers className="text-primary-400" size={22} /> Fee Structure Master
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure class-wise, session-wise, and category-wise fee blueprints for Hazrat Aisha Academy.
          </p>
        </div>
        <GlassButton variant="primary" onClick={handleOpenAdd} className="flex items-center gap-2">
          <Plus size={18} /> Create New Fee Structure
        </GlassButton>
      </div>

      <GlassTable>
        <thead>
          <tr>
            <th>Structure Name</th>
            <th>Academic Session</th>
            <th>Applicable Classes</th>
            <th>Fee Categories Breakdown</th>
            <th>Est. Annual Fee</th>
            <th>Status</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {structures.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-8 text-muted-foreground">
                No fee structures created yet. Click "Create New Fee Structure" to configure one.
              </td>
            </tr>
          ) : (
            structures.map(st => (
              <tr key={st.id}>
                <td className="font-semibold text-primary-400">{st.name}</td>
                <td className="font-mono text-xs">{st.session}</td>
                <td>
                  <div className="flex flex-wrap gap-1 max-w-xs">
                    {(st.applicableClasses || []).map(cls => (
                      <span key={cls} className="text-[10px] px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                        {cls}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="text-xs space-y-0.5 text-muted-foreground">
                    {(st.items || []).slice(0, 3).map((it, idx) => (
                      <div key={idx}>• {it.category}: ₹{it.amount} ({it.frequency})</div>
                    ))}
                    {(st.items || []).length > 3 && (
                      <div className="text-[10px] text-emerald-400 font-medium">
                        +{(st.items || []).length - 3} more fee categories
                      </div>
                    )}
                  </div>
                </td>
                <td className="font-bold text-foreground">₹{(st.totalAnnualAmount || 0).toLocaleString()}</td>
                <td>
                  <GlassBadge variant={st.status === 'Active' ? 'success' : 'neutral'}>
                    {st.status}
                  </GlassBadge>
                </td>
                <td>
                  <div className="flex justify-end gap-2">
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-emerald-400"
                      onClick={() => handleOpenEdit(st)}
                      title="Edit Structure"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-2 hover:bg-white/10 rounded-full text-rose-400"
                      onClick={() => { setSelectedStructure(st); setIsDeleteOpen(true); }}
                      title="Delete Structure"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </GlassTable>

      {/* Structure Modal */}
      <GlassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedStructure ? "Edit Fee Structure" : "Create Fee Structure"}
        className="max-w-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <GlassInput
              label="Structure Name"
              placeholder="e.g. Primary Wing Fee Structure"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <GlassSelect
              label="Academic Session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
            >
              <option value="2025-2026">2025-2026</option>
              <option value="2026-2027">2026-2027</option>
              <option value="2027-2028">2027-2028</option>
            </GlassSelect>
            <GlassSelect
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </GlassSelect>
          </div>

          {/* Applicable Classes Selection */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase">Applicable Classes</label>
            <div className="flex flex-wrap gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
              {(classes && classes.length > 0 ? classes.map(c => c.className) : ['Baby', 'Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8']).map(clsName => {
                const isSelected = selectedClasses.includes(clsName);
                return (
                  <button
                    key={clsName}
                    type="button"
                    onClick={() => handleToggleClass(clsName)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                        : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10'
                    }`}
                  >
                    {isSelected && <CheckCircle2 size={12} />}
                    <span>{clsName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fee Item Categories Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase">Fee Categories Breakdown</label>
              <GlassButton type="button" variant="outline" size="sm" onClick={handleAddItem} className="flex items-center gap-1">
                <Plus size={14} /> Add Category
              </GlassButton>
            </div>

            <div className="space-y-2">
              {items.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-2 items-center bg-white/5 p-2.5 rounded-xl border border-white/10">
                  <div className="col-span-4">
                    <GlassSelect
                      value={item.category}
                      onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                    >
                      {FEE_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </GlassSelect>
                  </div>
                  <div className="col-span-3">
                    <GlassInput
                      type="number"
                      placeholder="Amount (₹)"
                      value={item.amount}
                      onChange={(e) => handleItemChange(idx, 'amount', Number(e.target.value))}
                    />
                  </div>
                  <div className="col-span-4">
                    <GlassSelect
                      value={item.frequency}
                      onChange={(e) => handleItemChange(idx, 'frequency', e.target.value)}
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Term-wise">Term-wise</option>
                      <option value="Annual">Annual</option>
                      <option value="One-time">One-time</option>
                    </GlassSelect>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      disabled={items.length <= 1}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg disabled:opacity-30"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Estimated Total Calculation */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3 text-emerald-400">
              <DollarSign size={24} />
              <div>
                <p className="text-xs font-semibold uppercase">Estimated Total Annual Fee per Student</p>
                <p className="text-xs text-muted-foreground">Calculated based on monthly x 12, term x 2, quarterly x 4, etc.</p>
              </div>
            </div>
            <p className="text-2xl font-extrabold text-white">₹{calculateTotalAnnual().toLocaleString()}</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <GlassButton type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary">
              Save Fee Structure
            </GlassButton>
          </div>
        </form>
      </GlassModal>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={async () => {
          if (selectedStructure?.id) {
            await onDelete(selectedStructure.id);
            setIsDeleteOpen(false);
          }
        }}
        title="Delete Fee Structure"
        message="Are you sure you want to delete this fee structure? Existing student receipts linked to this fee will remain intact."
        confirmText="Delete Structure"
      />
    </div>
  );
};
