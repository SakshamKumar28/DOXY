import { Outlet } from 'react-router-dom';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import MobileNav from '../common/MobileNav';
import { useAuth } from '../../context/AuthContext';

const AppLayout = () => {
    const { user } = useAuth();
    
    // Use Sidebar layout for authenticated users, Navbar for unauthenticated (Landing/Auth)
    // Actually, Navbar is fine for public, but Dashboards need sidebar.
    // Let's check logic: ProtectedRoutes wrap the Dashboard.
    
    // Check if we are in a video call
    if (location.pathname.startsWith('/call/')) {
        return <Outlet />;
    }

    if (user) {
        return (
            <div className="flex min-h-screen w-full bg-background flex-col md:flex-row">
                <MobileNav />
                <Sidebar />
                <div className="flex flex-col flex-1 h-[calc(100vh-65px)] md:h-screen overflow-auto">
                    {/* Mobile Header could go here */}
                    <main className="flex-1">
                        <Outlet />
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <Outlet />
        </div>
    );
};

export default AppLayout;
