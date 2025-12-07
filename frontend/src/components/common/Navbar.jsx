import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="fixed top-4 w-full z-50 px-4 md:px-0 flex justify-center">
        <motion.nav 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="w-full max-w-5xl rounded-full border border-black/5 bg-white/80 backdrop-blur-md shadow-soft supports-[backdrop-filter]:bg-white/60 dark:bg-black/60 dark:border-white/10"
        >
        <div className="flex h-14 items-center justify-between px-6">
            <div className="flex items-center gap-8">
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        DOXY
                    </span>
                </Link>
                
                {user && (
                    <div className="hidden md:flex gap-6">
                        {user.role === 'patient' && (
                            <Link to="/patient/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                                Dashboard
                            </Link>
                        )}
                        {user.role === 'doctor' && (
                            <Link to="/doctor/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                                Dashboard
                            </Link>
                        )}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                {user ? (
                    <>
                        <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                            <User size={14} />
                            <span className="font-medium text-foreground">{user.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout" className="text-muted-foreground hover:text-destructive h-8 w-8">
                            <LogOut size={16} />
                        </Button>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login">
                            <Button variant="ghost" size="sm" className="rounded-full">Log in</Button>
                        </Link>
                        <Link to="/register">
                            <Button size="sm" className="rounded-full shadow-none bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black">Sign up</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
        </motion.nav>
    </div>
  );
};

export default Navbar;
