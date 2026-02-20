import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

function DashboardLayout() {
    return (
        <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-bg-primary text-text-primary">
            <Sidebar />
            <main className="flex flex-col flex-1 min-w-0 overflow-hidden relative">
                <Navbar />
                <div className="flex-1 overflow-y-auto p-4 md:p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
