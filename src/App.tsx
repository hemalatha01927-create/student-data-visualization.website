import { useState, useMemo, useRef } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Table2,
  Lightbulb,
  Upload,
  Search,
  Users,
  TrendingUp,
  CalendarCheck,
  CheckCircle2,
} from 'lucide-react';
import { Student, Filters, PASS_MARK } from '@/types';
import { SAMPLE_DATA, overallScore, parseCSV } from '@/data';
import { filterStudents, computeSummary, generateInsights } from '@/utils';
import {
  SubjectPerformanceChart,
  StudentPerformanceChart,
  PassFailChart,
  GenderChart,
  AttendanceScoreChart,
} from '@/Charts';

type Tab = 'dashboard' | 'charts' | 'dataset' | 'insights';

function App() {
  const [students, setStudents] = useState<Student[]>(SAMPLE_DATA);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({ gender: 'All', minAttendance: 0, subject: 'All' });
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterStudents(students, filters), [students, filters]);
  const summary = useMemo(() => computeSummary(filtered), [filtered]);
  const insights = useMemo(() => generateInsights(filtered), [filtered]);

  const tableData = useMemo(() => {
    const q = search.toLowerCase();
    return filtered.filter(
      (s) =>
        s.studentId.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.gender.toLowerCase().includes(q)
    );
  }, [filtered, search]);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCSV(String(reader.result));
      if (parsed.length > 0) {
        setStudents(parsed);
        setFilters({ gender: 'All', minAttendance: 0, subject: 'All' });
      }
    };
    reader.readAsText(file);
  };

  const navItems: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'charts', label: 'Charts', icon: BarChart3 },
    { id: 'dataset', label: 'Dataset', icon: Table2 },
    { id: 'insights', label: 'Insights', icon: Lightbulb },
  ];

  const cards = [
    { label: 'Total Students', value: summary.total, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Average Score', value: summary.avgScore, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Average Attendance', value: `${summary.avgAttendance}%`, icon: CalendarCheck, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Pass Percentage', value: `${summary.passPct}%`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-300">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      <div className="h-72">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Student Data Visualization Dashboard</h1>
              <p className="text-sm text-gray-500 mt-1">Explore student performance through interactive visualizations.</p>
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm"
            >
              <Upload size={18} />
              Upload CSV
            </button>
            <input ref={fileRef} type="file" accept=".csv" onChange={handleUpload} className="hidden" />
          </div>
          {/* Navigation */}
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    tab === item.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Gender</label>
              <select
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option>All</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Minimum Attendance: {filters.minAttendance}%
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={filters.minAttendance}
                onChange={(e) => setFilters({ ...filters, minAttendance: Number(e.target.value) })}
                className="w-full accent-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">Subject</label>
              <select
                value={filters.subject}
                onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option>All</option>
                <option>Maths</option>
                <option>Science</option>
                <option>English</option>
              </select>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">{c.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{c.value}</p>
                  </div>
                  <div className={`${c.bg} ${c.color} p-3 rounded-xl`}>
                    <Icon size={22} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tab Content */}
        {tab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Subject Performance">
                <SubjectPerformanceChart students={students} filters={filters} />
              </ChartCard>
              <ChartCard title="Student Performance">
                <StudentPerformanceChart students={students} filters={filters} />
              </ChartCard>
              <ChartCard title="Pass vs Fail">
                <PassFailChart students={students} filters={filters} />
              </ChartCard>
              <ChartCard title="Gender Distribution">
                <GenderChart students={students} filters={filters} />
              </ChartCard>
            </div>
            <ChartCard title="Attendance vs Score">
              <AttendanceScoreChart students={students} filters={filters} />
            </ChartCard>
          </div>
        )}

        {tab === 'charts' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard title="A. Subject Performance (Average)">
              <SubjectPerformanceChart students={students} filters={filters} />
            </ChartCard>
            <ChartCard title="B. Student Performance (Overall Average)">
              <StudentPerformanceChart students={students} filters={filters} />
            </ChartCard>
            <ChartCard title="C. Pass vs Fail">
              <PassFailChart students={students} filters={filters} />
            </ChartCard>
            <ChartCard title="D. Gender Distribution">
              <GenderChart students={students} filters={filters} />
            </ChartCard>
            <div className="lg:col-span-2">
              <ChartCard title="E. Attendance vs Score (Scatter)">
                <AttendanceScoreChart students={students} filters={filters} />
              </ChartCard>
            </div>
          </div>
        )}

        {tab === 'dataset' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <h3 className="text-lg font-semibold text-gray-800">Student Dataset</h3>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none w-full sm:w-64"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-left">
                    {['Student ID', 'Name', 'Gender', 'Maths', 'Science', 'English', 'Attendance', 'Overall Score'].map((h) => (
                      <th key={h} className="py-3 px-3 font-semibold text-gray-600 whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">No students match your search.</td>
                    </tr>
                  ) : (
                    tableData.map((s) => {
                      const score = overallScore(s);
                      const passed = score >= PASS_MARK;
                      return (
                        <tr key={s.studentId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 font-medium text-gray-700">{s.studentId}</td>
                          <td className="py-3 px-3 text-gray-700">{s.name}</td>
                          <td className="py-3 px-3 text-gray-700">{s.gender}</td>
                          <td className="py-3 px-3 text-gray-700">{s.maths}</td>
                          <td className="py-3 px-3 text-gray-700">{s.science}</td>
                          <td className="py-3 px-3 text-gray-700">{s.english}</td>
                          <td className="py-3 px-3 text-gray-700">{s.attendance}%</td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              passed ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                            }`}>
                              {score}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">Showing {tableData.length} of {students.length} students · Passing mark: {PASS_MARK}</p>
          </div>
        )}

        {tab === 'insights' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-5">Data Insights</h3>
            <div className="grid gap-4">
              {insights.map((insight, i) => (
                <div key={i} className="flex items-start gap-3 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
                  <Lightbulb size={20} className="text-purple-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-sm text-gray-500 font-medium">AI &amp; Machine Learning – Data Visualization</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
