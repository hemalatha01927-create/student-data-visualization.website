import { Student } from '@/types';

export const SAMPLE_DATA: Student[] = [
  { studentId: 'S001', name: 'Hema', gender: 'Female', maths: 85, science: 90, english: 88, attendance: 92 },
  { studentId: 'S002', name: 'Arun', gender: 'Male', maths: 65, science: 70, english: 68, attendance: 80 },
  { studentId: 'S003', name: 'Priya', gender: 'Female', maths: 92, science: 95, english: 90, attendance: 96 },
  { studentId: 'S004', name: 'Ravi', gender: 'Male', maths: 55, science: 60, english: 58, attendance: 72 },
  { studentId: 'S005', name: 'Anu', gender: 'Female', maths: 78, science: 82, english: 80, attendance: 88 },
  { studentId: 'S006', name: 'Kumar', gender: 'Male', maths: 72, science: 75, english: 70, attendance: 84 },
  { studentId: 'S007', name: 'Divya', gender: 'Female', maths: 88, science: 91, english: 85, attendance: 94 },
  { studentId: 'S008', name: 'Rahul', gender: 'Male', maths: 48, science: 55, english: 52, attendance: 65 },
  { studentId: 'S009', name: 'Sneha', gender: 'Female', maths: 95, science: 93, english: 97, attendance: 98 },
  { studentId: 'S010', name: 'Vijay', gender: 'Male', maths: 68, science: 73, english: 65, attendance: 78 },
];

export function overallScore(s: Student): number {
  return Math.round((s.maths + s.science + s.english) / 3);
}

export function parseCSV(text: string): Student[] {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const idx = (name: string) => headers.findIndex((h) => h === name);

  const idI = idx('student_id');
  const nameI = idx('name');
  const genderI = idx('gender');
  const mathsI = idx('maths');
  const scienceI = idx('science');
  const englishI = idx('english');
  const attendanceI = idx('attendance');

  if (idI < 0 || nameI < 0 || genderI < 0) return [];

  return lines.slice(1).map((line) => {
    const cols = line.split(',').map((c) => c.trim());
    return {
      studentId: cols[idI] || '',
      name: cols[nameI] || '',
      gender: cols[genderI] || '',
      maths: Number(cols[mathsI]) || 0,
      science: Number(cols[scienceI]) || 0,
      english: Number(cols[englishI]) || 0,
      attendance: Number(cols[attendanceI]) || 0,
    };
  });
}
