import { 
  Search, 
  Download, 
  ChevronRight,
  Trophy,
  GraduationCap
} from 'lucide-react';
import { PremiumButton } from '../components/common/PremiumButton';
import { PremiumCard } from '../components/common/PremiumCard';
import { PremiumInput } from '../components/common/PremiumInput';
import { PremiumSelect } from '../components/common/PremiumSelect';
import { PremiumTable, PremiumTableRow, PremiumTableCell } from '../components/common/PremiumTable';

const Results = () => {
  return (
    <div className="space-y-12 py-8 px-4">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="max-w-2xl">
          <h1 className="text-5xl font-black text-neutral-900 tracking-tighter leading-tight">Academic Results</h1>
          <p className="text-neutral-500 mt-3 text-lg leading-relaxed">Secure results portal for students and parents of Hazrat Aisha Academy.</p>
        </div>
        <PremiumButton size="lg" className="shadow-2xl">
          <Download className="h-5 w-5 mr-2" />
          <span>Export Report</span>
        </PremiumButton>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <PremiumCard className="flex items-center space-x-6">
          <div className="bg-emerald-100 p-4 rounded-3xl">
            <Trophy className="h-8 w-8 text-emerald-700" />
          </div>
          <div>
            <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Pass Percentage</p>
            <p className="text-3xl font-black text-neutral-900">92.4%</p>
          </div>
        </PremiumCard>
        <PremiumCard className="flex items-center space-x-6">
          <div className="bg-blue-100 p-4 rounded-3xl">
            <GraduationCap className="h-8 w-8 text-blue-700" />
          </div>
          <div>
            <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Top Scorer</p>
            <p className="text-3xl font-black text-neutral-900">Aisha K. (98%)</p>
          </div>
        </PremiumCard>
        <PremiumCard className="flex items-center space-x-6">
          <div className="bg-amber-100 p-4 rounded-3xl">
            <Search className="h-8 w-8 text-amber-700" />
          </div>
          <div>
            <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.2em] mb-1">Pending Review</p>
            <p className="text-3xl font-black text-neutral-900">14 Classes</p>
          </div>
        </PremiumCard>
      </div>

      {/* Search & Filters */}
      <PremiumCard padding="sm">
        <div className="flex flex-col md:flex-row md:items-end gap-6">
          <div className="flex-1">
            <PremiumInput 
              label="Student Search"
              placeholder="Enter student name or roll number..."
              icon={<Search className="h-5 w-5" />}
            />
          </div>
          <div className="flex flex-col md:flex-row items-end gap-4">
            <PremiumSelect 
              label="Class"
              options={[
                { label: 'Class 1', value: '1' },
                { label: 'Class 2', value: '2' },
                { label: 'Class 3', value: '3' },
                { label: 'Class 4', value: '4' },
                { label: 'Class 5', value: '5' },
              ]}
              className="min-w-[160px]"
            />
            <PremiumSelect 
              label="Examination"
              options={[
                { label: 'Half Yearly', value: 'half' },
                { label: 'Annual Exam', value: 'annual' },
                { label: 'Unit Test I', value: 'ut1' },
                { label: 'Unit Test II', value: 'ut2' },
              ]}
              className="min-w-[200px]"
            />
          </div>
        </div>
      </PremiumCard>

      {/* Results List */}
      <PremiumTable headers={['Student', 'Roll Number', 'Marks', 'Grade', 'Status', '']}>
        {[
          { name: 'Zaid Khan', roll: '202401', marks: '458/500', grade: 'A+', status: 'Pass' },
          { name: 'Sara Ahmed', roll: '202402', marks: '482/500', grade: 'A+', status: 'Pass' },
          { name: 'Omar Farooq', roll: '202403', marks: '342/500', grade: 'B', status: 'Pass' },
          { name: 'Aisha Siddiqua', roll: '202404', marks: '491/500', grade: 'A+', status: 'Pass' },
          { name: 'Yusuf Ali', roll: '202405', marks: '210/500', grade: 'D', status: 'Fail' },
        ].map((student, i) => (
          <PremiumTableRow key={i} onClick={() => {}}>
            <PremiumTableCell>
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-sm font-black text-neutral-400 group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors border border-neutral-200">
                  {student.name.charAt(0)}
                </div>
                <span className="font-black text-neutral-900 group-hover:text-emerald-700 transition-colors tracking-tight">{student.name}</span>
              </div>
            </PremiumTableCell>
            <PremiumTableCell className="font-bold text-neutral-400 tracking-widest">{student.roll}</PremiumTableCell>
            <PremiumTableCell>
              <div className="flex flex-col">
                <span className="font-black text-neutral-900">{student.marks}</span>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Aggregate Score</span>
              </div>
            </PremiumTableCell>
            <PremiumTableCell>
              <span className={`text-xl font-black ${student.grade === 'A+' ? 'text-emerald-600' : student.grade === 'D' ? 'text-rose-500' : 'text-blue-600'}`}>
                {student.grade}
              </span>
            </PremiumTableCell>
            <PremiumTableCell>
              <span className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${student.status === 'Pass' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                {student.status}
              </span>
            </PremiumTableCell>
            <PremiumTableCell className="text-right">
              <PremiumButton variant="ghost" size="sm" className="p-2">
                <ChevronRight className="h-5 w-5" />
              </PremiumButton>
            </PremiumTableCell>
          </PremiumTableRow>
        ))}
      </PremiumTable>
    </div>
  );
};

export default Results;
