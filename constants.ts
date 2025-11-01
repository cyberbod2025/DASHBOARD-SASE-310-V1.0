
import { User, Student, Report, UserRole, ReportType, ReportStatus, ReportPriority } from './types';

export const MOCK_USERS: User[] = [
  { id: 'user-1', name: 'Prof. Ana Torres', email: 'atorres@sec310.edu.mx', role: UserRole.Teacher },
  { id: 'user-2', name: 'Lic. Carlos Ruiz', email: 'cruiz@sec310.edu.mx', role: UserRole.Guidance },
  { id: 'user-3', name: 'Dir. Elena Solis', email: 'esolis@sec310.edu.mx', role: UserRole.Director },
  { id: 'user-4', name: 'Prof. Jorge Luna', email: 'jluna@sec310.edu.mx', role: UserRole.Teacher },
];

export const MOCK_STUDENTS: Student[] = [
  { id: 'student-1', name: 'Luis González', grade: '2', group: 'A' },
  { id: 'student-2', name: 'Mariana Fernández', grade: '3', group: 'C' },
  { id: 'student-3', name: 'Pedro Ramírez', grade: '1', group: 'B' },
  { id: 'student-4', name: 'Sofía Herrera', grade: '2', group: 'A' },
];

export const MOCK_REPORTS: Report[] = [
  {
    id: 'report-1',
    studentId: 'student-1',
    teacherId: 'user-1',
    date: '2023-10-26T10:00:00Z',
    type: ReportType.Disciplinary,
    description: 'Luis interrumpió la clase en repetidas ocasiones, haciendo ruidos y molestando a sus compañeros. Se le llamó la atención varias veces sin éxito.',
    status: ReportStatus.New,
    priority: ReportPriority.Medium,
    actionsTaken: 'Se le pidió que saliera del salón por 10 minutos para reflexionar. Se habló con él al final de la clase.',
  },
  {
    id: 'report-2',
    studentId: 'student-2',
    teacherId: 'user-4',
    date: '2023-10-25T14:30:00Z',
    type: ReportType.SocioEmotional,
    description: 'Mariana fue vista llorando en el patio durante el receso. Al preguntarle, mencionó sentirse muy estresada por los exámenes y tener problemas para dormir. Se muestra aislada de su grupo de amigos.',
    status: ReportStatus.InProgress,
    priority: ReportPriority.High,
    actionsTaken: 'Se conversó con ella para tranquilizarla y se le ofreció hablar con Orientación.',
    guidanceNotes: 'Se citó a los padres para una reunión el 27/10. Se está trabajando en técnicas de manejo de estrés con la alumna.',
  },
  {
    id: 'report-3',
    studentId: 'student-1',
    teacherId: 'user-4',
    date: '2023-10-24T09:15:00Z',
    type: ReportType.Disciplinary,
    description: 'No entregó la tarea de Matemáticas por tercera vez consecutiva. Muestra una actitud apática hacia la materia.',
    status: ReportStatus.Resolved,
    priority: ReportPriority.Low,
    actionsTaken: 'Se habló con el alumno sobre la importancia de la responsabilidad. Se acordó un plan de entrega con fechas límite.',
    guidanceNotes: 'Se dio seguimiento y el alumno ha cumplido con las últimas entregas.',
  },
];

export const VIEW_TITLES: { [key: string]: string } = {
    'teacher-dashboard': 'Panel del Docente',
    'guidance-inbox': 'Bandeja de Orientación',
    'student-profile': 'Perfil del Alumno',
    'live-assistant': 'Asistente Conversacional IA',
    'admin-dashboard': 'Panel de Coordinación'
};
