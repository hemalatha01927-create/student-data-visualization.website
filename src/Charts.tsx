import { useEffect, useRef } from 'react';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PieController,
  ArcElement,
  ScatterController,
  PointElement,
} from 'chart.js';
import { Student } from '@/types';
import { overallScore } from '@/data';
import { subjectAverages, filterStudents } from '@/utils';
import { PASS_MARK } from '@/types';

Chart.register(
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PieController,
  ArcElement,
  ScatterController,
  PointElement
);

const COLORS = {
  blue: '#3b82f6',
  purple: '#8b5cf6',
  blueLight: 'rgba(59,130,246,0.7)',
  purpleLight: 'rgba(139,92,246,0.7)',
  green: '#10b981',
  red: '#ef4444',
  greenLight: 'rgba(16,185,129,0.7)',
  redLight: 'rgba(239,68,68,0.7)',
};

interface Props {
  students: Student[];
  filters: { gender: string; minAttendance: number; subject: string };
}

function useChart(canvas: HTMLCanvasElement | null, config: any) {
  const chartRef = useRef<Chart | null>(null);
  useEffect(() => {
    if (!canvas) return;
    if (chartRef.current) chartRef.current.destroy();
    chartRef.current = new Chart(canvas, config);
    return () => { chartRef.current?.destroy(); chartRef.current = null; };
  }, [canvas, config]);
  return chartRef;
}

export function SubjectPerformanceChart({ students, filters }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filtered = filterStudents(students, filters);
  const avg = subjectAverages(filtered);

  const config = {
    type: 'bar',
    data: {
      labels: ['Maths', 'Science', 'English'],
      datasets: [{
        label: 'Average Score',
        data: [avg.maths, avg.science, avg.english],
        backgroundColor: [COLORS.blueLight, COLORS.purpleLight, COLORS.greenLight],
        borderColor: [COLORS.blue, COLORS.purple, COLORS.green],
        borderWidth: 2,
        borderRadius: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100 } },
    },
  };

  useChart(canvasRef.current, config);
  return <canvas ref={canvasRef} />;
}

export function StudentPerformanceChart({ students, filters }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filtered = filterStudents(students, filters);

  const config = {
    type: 'bar',
    data: {
      labels: filtered.map((s) => s.name),
      datasets: [{
        label: 'Overall Average Score',
        data: filtered.map(overallScore),
        backgroundColor: COLORS.purpleLight,
        borderColor: COLORS.purple,
        borderWidth: 2,
        borderRadius: 8,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: { y: { beginAtZero: true, max: 100 } },
    },
  };

  useChart(canvasRef.current, config);
  return <canvas ref={canvasRef} />;
}

export function PassFailChart({ students, filters }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filtered = filterStudents(students, filters);
  const passed = filtered.filter((s) => overallScore(s) >= PASS_MARK).length;
  const failed = filtered.length - passed;

  const config = {
    type: 'doughnut',
    data: {
      labels: ['Passed', 'Failed'],
      datasets: [{
        data: [passed, failed],
        backgroundColor: [COLORS.greenLight, COLORS.redLight],
        borderColor: [COLORS.green, COLORS.red],
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' as const } },
    },
  };

  useChart(canvasRef.current, config);
  return <canvas ref={canvasRef} />;
}

export function GenderChart({ students, filters }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filtered = filterStudents(students, filters);
  const males = filtered.filter((s) => s.gender === 'Male').length;
  const females = filtered.filter((s) => s.gender === 'Female').length;

  const config = {
    type: 'doughnut',
    data: {
      labels: ['Male', 'Female'],
      datasets: [{
        data: [males, females],
        backgroundColor: [COLORS.blueLight, COLORS.purpleLight],
        borderColor: [COLORS.blue, COLORS.purple],
        borderWidth: 2,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'bottom' as const } },
    },
  };

  useChart(canvasRef.current, config);
  return <canvas ref={canvasRef} />;
}

export function AttendanceScoreChart({ students, filters }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const filtered = filterStudents(students, filters);

  const config = {
    type: 'scatter',
    data: {
      datasets: [{
        label: 'Attendance vs Score',
        data: filtered.map((s) => ({ x: s.attendance, y: overallScore(s) })),
        backgroundColor: COLORS.blueLight,
        borderColor: COLORS.blue,
        pointRadius: 6,
        pointHoverRadius: 9,
      }],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { title: { display: true, text: 'Attendance' }, min: 0, max: 100 },
        y: { title: { display: true, text: 'Overall Score' }, min: 0, max: 100 },
      },
    },
  };

  useChart(canvasRef.current, config);
  return <canvas ref={canvasRef} />;
}
