
import { MOCK_REPORTS, MOCK_STUDENTS, MOCK_USERS } from '../constants';
import { Report, Student, User } from '../types';

// Simulate async API calls
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const getAllReports = async (): Promise<Report[]> => {
  await delay(300);
  return MOCK_REPORTS;
};

export const getReportsByTeacher = async (teacherId: string): Promise<Report[]> => {
  await delay(300);
  return MOCK_REPORTS.filter(report => report.teacherId === teacherId);
};

export const getReportsByStudent = async (studentId: string): Promise<Report[]> => {
    await delay(300);
    return MOCK_REPORTS.filter(report => report.studentId === studentId);
};

export const getStudentById = async (studentId: string): Promise<Student | undefined> => {
    await delay(100);
    return MOCK_STUDENTS.find(student => student.id === studentId);
};

export const getTeacherById = async (teacherId: string): Promise<User | undefined> => {
    await delay(100);
    return MOCK_USERS.find(user => user.id === teacherId);
};
