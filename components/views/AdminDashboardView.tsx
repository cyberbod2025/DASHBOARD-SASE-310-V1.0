
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getAllReports } from '../../services/mockDataService';
import { Report, ReportType, ReportStatus } from '../../types';
import { ChartBarIcon, ChartPieIcon, ExclamationTriangleIcon, CheckCircleIcon, ArrowPathIcon } from '../icons/SolidIcons';

const AdminDashboardView: React.FC<{viewStudentProfile: (studentId: string) => void}> = ({viewStudentProfile}) => {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const allReports = await getAllReports();
            setReports(allReports);
        };
        fetchData();
    }, []);

    const reportsByType = reports.reduce((acc, report) => {
        acc[report.type] = (acc[report.type] || 0) + 1;
        return acc;
    }, {} as Record<ReportType, number>);

    const pieData = [
        { name: 'Socio-emocional', value: reportsByType[ReportType.SocioEmotional] || 0 },
        { name: 'Disciplinario', value: reportsByType[ReportType.Disciplinary] || 0 },
    ];
    
    const COLORS = ['#0088FE', '#FF8042'];

    const reportsByStatus = reports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
    }, {} as Record<ReportStatus, number>);
    
    const barData = [
        {name: 'Estado', Nuevo: reportsByStatus[ReportStatus.New] || 0, 'En Progreso': reportsByStatus[ReportStatus.InProgress] || 0, Resuelto: reportsByStatus[ReportStatus.Resolved] || 0 }
    ]

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Panel de Coordinación</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <ExclamationTriangleIcon className="h-10 w-10 text-red-500 mr-4"/>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reportes Nuevos</p>
                        <p className="text-3xl font-bold">{reportsByStatus[ReportStatus.New] || 0}</p>
                    </div>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <ArrowPathIcon className="h-10 w-10 text-yellow-500 mr-4"/>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">En Progreso</p>
                        <p className="text-3xl font-bold">{reportsByStatus[ReportStatus.InProgress] || 0}</p>
                    </div>
                </div>
                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center">
                    <CheckCircleIcon className="h-10 w-10 text-green-500 mr-4"/>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Resueltos</p>
                        <p className="text-3xl font-bold">{reportsByStatus[ReportStatus.Resolved] || 0}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center"><ChartPieIcon className="h-6 w-6 mr-2"/>Distribución por Tipo de Reporte</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={100} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                            </Pie>
                            <Tooltip/>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4 flex items-center"><ChartBarIcon className="h-6 w-6 mr-2"/>Reportes por Estado</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={barData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Nuevo" fill="#f87171" />
                            <Bar dataKey="En Progreso" fill="#facc15" />
                            <Bar dataKey="Resuelto" fill="#4ade80" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardView;
