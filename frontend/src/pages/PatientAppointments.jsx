import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Calendar, Clock, Video, User, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const { data } = await api.get('/appointments');
                setAppointments(data);
            } catch (error) {
                console.error("Failed to fetch appointments", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAppointments();
    }, []);

    const handleJoinCall = (appointmentId) => {
        navigate(`/call/${appointmentId}`);
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading appointments...</div>;
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
                <p className="text-muted-foreground">Manage your scheduled consultations and history.</p>
            </header>

            <motion.div 
                variants={container} 
                initial="hidden" 
                animate="show"
                className="space-y-4"
            >
                {appointments.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                             <div className="p-4 bg-muted rounded-full">
                                <Calendar className="w-8 h-8 text-muted-foreground" />
                             </div>
                             <div>
                                <h3 className="text-lg font-medium">No appointments yet</h3>
                                <p className="text-muted-foreground">Book your first consultation with a doctor.</p>
                             </div>
                        </CardContent>
                    </Card>
                ) : null}

                {appointments.map((app) => {
                    // Logic to check if past
                    const appDate = new Date(`${app.date}T${app.time}`);
                    const isPast = appDate < new Date();
                    const displayStatus = (app.status === 'Accepted' && isPast) ? 'Completed' : app.status;

                    return (
                    <motion.div key={app._id} variants={item}>
                        <Card className="overflow-hidden hover:shadow-md transition-shadow group">
                            <div className="flex flex-col md:flex-row">
                                {/* Status Strip */}
                                <div className={`w-full md:w-2 h-2 md:h-auto ${
                                    displayStatus === 'Accepted' ? 'bg-green-500' : 
                                    displayStatus === 'Pending' ? 'bg-yellow-500' : 
                                    displayStatus === 'Completed' ? 'bg-blue-500' : 'bg-red-500'
                                }`} />
                                
                                <div className="flex-1 p-6 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary/10 p-3 rounded-full hidden md:block">
                                            <User className="w-6 h-6 text-primary" />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold text-lg">{app.doctor?.name || 'Unknown Doctor'}</h3>
                                                <Badge 
                                                    variant={displayStatus === 'Accepted' ? 'success' : displayStatus === 'Pending' ? 'outline' : displayStatus === 'Completed' ? 'default' : 'destructive'} 
                                                    className="uppercase text-[10px]"
                                                >
                                                    {displayStatus}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar className="w-4 h-4" /> 
                                                    {new Date(app.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1.5">
                                                    <Clock className="w-4 h-4" /> 
                                                    {app.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        {displayStatus === 'Accepted' && (
                                            <Button onClick={() => handleJoinCall(app._id)} className="w-full md:w-auto gap-2">
                                                <Video className="w-4 h-4" /> Join Call
                                            </Button>
                                        )}
                                        {displayStatus === 'Pending' && (
                                            <div className="flex items-center gap-2 text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-md w-full md:w-auto">
                                                <AlertCircle className="w-4 h-4" /> Awaiting approval
                                            </div>
                                        )}
                                        {displayStatus === 'Cancelled' && (
                                            <Button variant="outline" disabled className="w-full md:w-auto opacity-50">
                                                Cancelled
                                            </Button>
                                        )}
                                        {displayStatus === 'Completed' && (
                                            <Button variant="outline" disabled className="w-full md:w-auto opacity-50 border-blue-200 bg-blue-50 text-blue-700">
                                                Completed
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )})}
            </motion.div>
        </div>
    );
};

export default PatientAppointments;
