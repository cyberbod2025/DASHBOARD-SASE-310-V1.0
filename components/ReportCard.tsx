
import React, { useState, useEffect } from 'react';
import { Report, ReportStatus, ReportType, ReportPriority } from '../types';
import { getStudentById, getTeacherById } from '../services/mockDataService';
import { summarizeTextWithGemini } from '../services/geminiService';
import TTSButton from './TTSButton';
// FIX: Module '"./icons/SolidIcons"' has no exported member 'InformationCircleIcon'. Also removing unused ExclamationTriangleIcon.
import { UserCircleIcon, AcademicCapIcon, CalendarIcon, SparklesIcon } from './icons/SolidIcons';

interface ReportCardProps {
    report: Report;
    viewStudentProfile: (studentId: string) => void;
    isGuidanceView?: boolean;
    isStudentProfileView?: boolean;
}

const ReportCard: React.FC<ReportCardProps> = ({ report, viewStudentProfile, isGuidanceView = false, isStudentProfileView = false }) => {
    const [studentName, setStudentName] = useState('');
    const [teacherName, setTeacherName] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const [summary, setSummary] = useState('');
    const [isSummarizing, setIsSummarizing] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const student = await getStudentById(report.studentId);
            const teacher = await getTeacherById(report.teacherId);
            setStudentName(student?.name || 'Desconocido');
            setTeacherName(teacher?.name || 'Desconocido');
        };
        fetchData();
    }, [report.studentId, report.teacherId]);

    const handleSummarize = async () => {
        setIsSummarizing(true);
        const textToSummarize = `Descripción: ${report.description}\nAcciones Tomadas: ${report.actionsTaken}`;
        try {
            const result = await summarizeTextWithGemini(textToSummarize);
            setSummary(result);
        } catch (error) {
            console.error("Error summarizing text:", error);
            setSummary("No se pudo generar el resumen.");
        } finally {
            setIsSummarizing(false);
        }
    };
    
    const statusStyles: { [key in ReportStatus]: string } = {
        [ReportStatus.New]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        [ReportStatus.InProgress]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
        [ReportStatus.Resolved]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    };

    const typeStyles: { [key in ReportType]: string } = {
        [ReportType.SocioEmotional]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
        [ReportType.Disciplinary]: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    };
    
    const priorityStyles: { [key in ReportPriority]: string } = {
        [ReportPriority.High]: 'border-red-500',
        [ReportPriority.Medium]: 'border-yellow-500',
        [ReportPriority.Low]: 'border-gray-400',
    };

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md border-l-4 ${priorityStyles[report.priority]}`}>
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        {!isStudentProfileView && (
                             <button onClick={() => viewStudentProfile(report.studentId)} className="text-lg font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                                <UserCircleIcon className="h-5 w-5 mr-2" />
                                {studentName}
                            </button>
                        )}
                       
                        <div className="flex items-center space-x-2 mt-2 text-xs">
                             <span className={`px-2 py-1 font-semibold rounded-full ${typeStyles[report.type]}`}>{report.type}</span>
                             <span className={`px-2 py-1 font-semibold rounded-full ${statusStyles[report.status]}`}>{report.status}</span>
                        </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1"/>
                            {new Date(report.date).toLocaleDateString()}
                        </div>
                        {!isStudentProfileView && (
                             <div className="flex items-center mt-1">
                                <AcademicCapIcon className="h-4 w-4 mr-1"/>
                                {teacherName}
                            </div>
                        )}
                    </div>
                </div>

                <p className="mt-4 text-gray-700 dark:text-gray-300">{report.description}</p>
                
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3 animate-fade-in-down">
                        <div>
                            <h4 className="font-semibold">Acciones Tomadas:</h4>
                            <p className="text-gray-600 dark:text-gray-400">{report.actionsTaken}</p>
                        </div>
                        {report.guidanceNotes && (
                             <div>
                                <h4 className="font-semibold text-green-600">Notas de Orientación:</h4>
                                <p className="text-gray-600 dark:text-gray-400">{report.guidanceNotes}</p>
                            </div>
                        )}
                        {summary && (
                             <div className="p-3 bg-blue-50 dark:bg-gray-700 rounded-lg">
                                <h4 className="font-semibold flex items-center text-blue-800 dark:text-blue-200"><SparklesIcon className="h-5 w-5 mr-2"/>Resumen IA</h4>
                                <p className="text-sm text-blue-700 dark:text-blue-300">{summary}</p>
                            </div>
                        )}
                    </div>
                )}
                 <div className="mt-4 flex justify-between items-center">
                    <div>
                        <button onClick={() => setIsExpanded(!isExpanded)} className="text-sm text-blue-500 hover:underline">
                            {isExpanded ? 'Ver Menos' : 'Ver Más Detalles'}
                        </button>
                        <button onClick={handleSummarize} disabled={isSummarizing} className="ml-4 text-sm text-blue-500 hover:underline disabled:text-gray-400 disabled:no-underline">
                             {isSummarizing ? 'Generando...' : 'Resumir con IA'}
                        </button>
                    </div>
                    <div className="flex space-x-2">
                        <TTSButton textToSpeak={report.description} />
                         {summary && <TTSButton textToSpeak={summary} />}
                    </div>
                </div>
            </div>
        </div>
    );
};


export default ReportCard;
