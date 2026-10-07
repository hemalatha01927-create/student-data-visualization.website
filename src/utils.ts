import { Student, PASS_MARK } from '@/types';
import { overallScore } from '@/data';

export function filterStudents(students: Student[], filters: { gender: string; minAttendance: number; subject: string }): Student[] {
  return students.filter((s) => {
    if (filters.gender !== 'All' && s.gender !== filters.gender) return false;
    if (s.attendance < filters.minAttendance) return false;
    return true;
  });
}

export function computeSummary(students: Student[]) {
  if (students.length === 0) {
    return { total: 0, avgScore: 0, avgAttendance: 0, passPct: 0 };
  }
  const total = students.length;
  const scores = students.map(overallScore);
  const avgScore = Math.round((scores.reduce((a, b) => a + b, 0) / total) * 10) / 10;
  const avgAttendance = Math.round((students.reduce((a, s) => a + s.attendance, 0) / total) * 10) / 10;
  const passed = students.filter((s) => overallScore(s) >= PASS_MARK).length;
  const passPct = Math.round((passed / total) * 1000) / 10;
  return { total, avgScore, avgAttendance, passPct };
}

export function subjectAverages(students: Student[]) {
  if (students.length === 0) return { maths: 0, science: 0, english: 0 };
  return {
    maths: Math.round((students.reduce((a, s) => a + s.maths, 0) / students.length) * 10) / 10,
    science: Math.round((students.reduce((a, s) => a + s.science, 0) / students.length) * 10) / 10,
    english: Math.round((students.reduce((a, s) => a + s.english, 0) / students.length) * 10) / 10,
  };
}

export function generateInsights(students: Student[]): string[] {
  if (students.length === 0) return ['No data available for insights.'];
  const insights: string[] = [];
  const avg = subjectAverages(students);
  const subjects = [
    { name: 'Maths', value: avg.maths },
    { name: 'Science', value: avg.science },
    { name: 'English', value: avg.english },
  ];
  subjects.sort((a, b) => b.value - a.value);
  insights.push(`${subjects[0].name} has the highest average score (${subjects[0].value}).`);

  const total = students.length;
  const males = students.filter((s) => s.gender === 'Male').length;
  const females = students.filter((s) => s.gender === 'Female').length;
  if (females > males) insights.push(`Female students represent ${Math.round((females / total) * 100)}% of the dataset.`);
  else if (males > females) insights.push(`Male students represent ${Math.round((males / total) * 100)}% of the dataset.`);
  else insights.push(`Male and Female students are equally distributed at 50% each.`);

  const passed = students.filter((s) => overallScore(s) >= PASS_MARK).length;
  insights.push(`${passed} out of ${total} students have scored above the passing mark (${PASS_MARK}).`);

  const highAtt = students.filter((s) => s.attendance >= 85);
  const lowAtt = students.filter((s) => s.attendance < 85);
  if (highAtt.length > 0 && lowAtt.length > 0) {
    const highAvg = highAtt.reduce((a, s) => a + overallScore(s), 0) / highAtt.length;
    const lowAvg = lowAtt.reduce((a, s) => a + overallScore(s), 0) / lowAtt.length;
    if (highAvg > lowAvg) {
      insights.push('Students with higher attendance generally have better scores.');
    } else {
      insights.push('Attendance does not strongly correlate with higher scores in this dataset.');
    }
  } else {
    insights.push('Students with higher attendance generally have better scores.');
  }

  const top = [...students].sort((a, b) => overallScore(b) - overallScore(a))[0];
  insights.push(`${top.name} is the top performer with an overall score of ${overallScore(top)}.`);

  const weakest = subjects[2];
  insights.push(`${weakest.name} has the lowest average score (${weakest.value}) and may need attention.`);

  return insights;
}
