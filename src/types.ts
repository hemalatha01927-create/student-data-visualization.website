export interface Student {
  studentId: string;
  name: string;
  gender: string;
  maths: number;
  science: number;
  english: number;
  attendance: number;
}

export interface Filters {
  gender: string;
  minAttendance: number;
  subject: string;
}

export const PASS_MARK = 40;
