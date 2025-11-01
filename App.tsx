
import React, { useState, useMemo } from 'react';
import DashboardLayout from './components/DashboardLayout';
import TeacherDashboardView from './components/views/TeacherDashboardView';
import GuidanceInboxView from './components/views/GuidanceInboxView';
import LiveAssistantView from './components/views/LiveAssistantView';
import AdminDashboardView from './components/views/AdminDashboardView';
import StudentProfileView from './components/views/StudentProfileView';
import { MOCK_USERS } from './constants';
import { User } from './types';

const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
    const [currentView, setCurrentView] = useState('teacher-dashboard');
    const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);

    const handleViewChange = (view: string) => {
        setCurrentView(view);
        setSelectedStudentId(null);
    };

    const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const user = MOCK_USERS.find(u => u.id === event.target.value);
        if (user) {
            setCurrentUser(user);
            // Reset to a default view suitable for the role
            if (user.role === 'teacher') {
                handleViewChange('teacher-dashboard');
            } else if (user.role === 'guidance') {
                handleViewChange('guidance-inbox');
            } else {
                 handleViewChange('admin-dashboard');
            }
        }
    };
    
    const viewStudentProfile = (studentId: string) => {
        setSelectedStudentId(studentId);
        setCurrentView('student-profile');
    };

    const renderContent = useMemo(() => {
        if (currentView === 'student-profile' && selectedStudentId) {
            return <StudentProfileView studentId={selectedStudentId} viewStudentProfile={viewStudentProfile} />;
        }
        switch (currentView) {
            case 'teacher-dashboard':
                return <TeacherDashboardView currentUser={currentUser} viewStudentProfile={viewStudentProfile} />;
            case 'guidance-inbox':
                return <GuidanceInboxView viewStudentProfile={viewStudentProfile} />;
            case 'live-assistant':
                return <LiveAssistantView />;
            case 'admin-dashboard':
                return <AdminDashboardView viewStudentProfile={viewStudentProfile}/>;
            default:
                return <TeacherDashboardView currentUser={currentUser} viewStudentProfile={viewStudentProfile} />;
        }
    }, [currentView, currentUser, selectedStudentId]);

    return (
        <DashboardLayout 
            currentUser={currentUser} 
            currentView={currentView}
            onUserChange={handleUserChange}
            onViewChange={handleViewChange}
        >
            {renderContent}
        </DashboardLayout>
    );
};

export default App;
