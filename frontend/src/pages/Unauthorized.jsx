import { Link, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Unauthorized = () => {
    const { logout } = useAuth();
    const location = useLocation();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground bg-muted/30">
            <div className="max-w-md w-full bg-card p-8 rounded-2xl shadow-lg text-center space-y-6 border border-border">
                <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center text-red-600 dark:text-red-400">
                    <ShieldAlert size={32} />
                </div>
                
                <div>
                    <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                    <p className="text-muted-foreground">
                        You do not have permission to view this page.
                    </p>
                    <div className="mt-4 p-3 bg-muted rounded-md text-sm text-left font-mono">
                        <p><strong>Debug Info:</strong></p>
                        <p>Current Role: <span className="text-primary">{useAuth().user?.role || 'Guest'}</span></p>
                        <p>User ID: <span className="text-xs text-muted-foreground">{useAuth().user?._id || 'None'}</span></p>
                        <p>Required Role: <span className="text-destructive">{location.state?.requiredRoles?.join(', ') || 'Unknown'}</span></p>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <Link to="/">
                        <Button className="w-full" variant="outline">
                             Go Home
                        </Button>
                    </Link>
                    <Button onClick={logout} variant="destructive" className="w-full">
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
