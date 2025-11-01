
export enum UserRole {
  Teacher = 'teacher',
  Guidance = 'guidance',
  Prefecture = 'prefecture',
  Coordination = 'coordination',
  Director = 'director',
}

export enum ReportType {
  SocioEmotional = 'socio-emotional',
  Disciplinary = 'disciplinary',
}

export enum ReportStatus {
  New = 'new',
  InProgress = 'in-progress',
  Resolved = 'resolved',
}

export enum ReportPriority {
    Low = 'low',
    Medium = 'medium',
    High = 'high',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  group: string;
}

export interface Report {
  id: string;
  studentId: string;
  teacherId: string;
  date: string;
  type: ReportType;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  actionsTaken: string;
  guidanceNotes?: string;
}
