
import React, { useState, useEffect } from 'react';
import ReportForm from '../ReportForm';
import ReportCard from '../ReportCard';
import { getReportsByTeacher } from '../../services/mockDataService';
import { Report, User } from '../../types';
import { DocumentPlusIcon, ClockIcon } from '../icons/SolidIcons';

interface TeacherDashboardViewProps {
  currentUser: User;
  viewStudentProfile: (studentId: string) => void;
}

const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({ currentUser, viewStudentProfile }) => {
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      const reports = await getReportsByTeacher(currentUser.id);
      setMyReports(reports);
    };
    fetchReports();
  }, [currentUser.id]);
  
  const handleReportSubmitted = (newReport: Report) => {
    setMyReports(prevReports => [newReport, ...prevReports]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mi Panel</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition-colors"
        >
          <DocumentPlusIcon className="h-5 w-5 mr-2"/>
          {showForm ? 'Cancelar Reporte' : 'Nuevo Reporte'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg animate-fade-in-down">
          <ReportForm currentUser={currentUser} onReportSubmit={handleReportSubmitted} />
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold flex items-center mb-4 text-gray-700 dark:text-gray-300">
          <ClockIcon className="h-6 w-6 mr-2"/>
          Historial de Reportes Enviados
        </h3>
        {myReports.length > 0 ? (
          <div className="space-y-4">
            {myReports.map((report) => (
              <ReportCard key={report.id} report={report} viewStudentProfile={viewStudentProfile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 px-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <p className="text-gray-500 dark:text-gray-400">No has enviado ningún reporte todavía.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDashboardView;
