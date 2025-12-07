import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';
import { 
    LayoutDashboard, 
    Calendar, 
    MessageSquare, 
    Settings, 
    LogOut, 
    User,
    Video,
    Pill
} from 'lucide-react';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const links = user?.role === 'patient' ? [
        { href: '/patient/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/patient/appointments', label: 'Appointments', icon: Calendar },
        { href: '/patient/prescriptions', label: 'Prescriptions', icon: Pill }, 
        { href: '/patient/settings', label: 'Settings', icon: Settings },
    ] : [
        { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/doctor/schedule', label: 'Schedule', icon: Calendar },
        { href: '/doctor/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="hidden md:flex flex-col w-64 h-screen sticky top-0 bg-gray-50/50 dark:bg-black border-r border-black/5 dark:border-white/10 p-4">
            <div className="flex items-center h-14 px-4 mb-6">
                <Link to="/" className="flex items-center gap-2">
                    <span className="font-bold text-xl tracking-tight text-gray-900 dark:text-white">
                        DOXY
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wide">
                        Beta
                    </span>
                </Link>
            </div>
            
            <div className="flex-1 space-y-1">
                {links.map((link, index) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                         <Link
                            key={index}
                            to={link.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                                isActive 
                                    ? "bg-white text-black shadow-soft dark:bg-gray-800 dark:text-white" 
                                    : "text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/10"
                            )}
                        >
                            <Icon className={cn("h-4 w-4", isActive ? "text-blue-600 dark:text-blue-400" : "text-muted-foreground")} />
                            {link.label}
                        </Link>
                    )
                })}
            </div>

            <div className="mt-auto pt-4 border-t border-black/5 dark:border-white/10">
                 <div className="flex items-center gap-3 p-2 mb-2 rounded-xl bg-white border border-black/5 shadow-sm dark:bg-gray-900 dark:border-white/10">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm">
                        <span className="font-bold text-xs">{user?.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{user?.name}</p>
                        <p className="text-xs text-muted-foreground truncate capitalize">{user?.role}</p>
                    </div>
                </div>
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 px-2" 
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" /> 
                    <span className="text-sm">Sign out</span>
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
