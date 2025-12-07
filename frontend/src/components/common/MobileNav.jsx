import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils/cn';
import { Button } from '../ui/button';

import { Menu, X, LayoutDashboard, Calendar, Settings, LogOut, User, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);
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
        { href: '/patient/prescriptions', label: 'Prescriptions', icon: MessageSquare },
        { href: '/patient/settings', label: 'Settings', icon: Settings },
    ] : [
        { href: '/doctor/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/doctor/schedule', label: 'Schedule', icon: Calendar },
        { href: '/doctor/settings', label: 'Settings', icon: Settings },
    ];

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <div className="md:hidden border-b bg-background sticky top-0 z-50">
            <div className="flex items-center justify-between p-4">
                <Link to="/" className="font-bold text-xl">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                        DOXY
                    </span>
                </Link>
                <Button variant="ghost" size="icon" onClick={toggleMenu}>
                    {isOpen ? <X /> : <Menu />}
                </Button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b bg-background"
                    >
                        <nav className="flex flex-col p-4 gap-2">
                             {links.map((link, index) => {
                                const Icon = link.icon;
                                const isActive = location.pathname === link.href;
                                return (
                                    <Link
                                        key={index}
                                        to={link.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            "flex items-center gap-3 rounded-lg px-3 py-3 transition-all hover:bg-muted",
                                            isActive ? "bg-muted text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {link.label}
                                    </Link>
                                )
                            })}
                            <div className="h-px bg-border my-2" />
                            <div className="flex items-center gap-3 px-3 py-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <User size={16} />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                                </div>
                            </div>
                            <Button variant="ghost" className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={handleLogout}>
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default MobileNav;
