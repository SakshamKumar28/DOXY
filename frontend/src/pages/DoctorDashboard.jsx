import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Video, Check, X, Calendar, Clock, User, Activity, Users, Star, TrendingUp, BarChart3, ArrowUpRight, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import PrescriptionModal from '../components/dashboard/PrescriptionModal';

// --- Reports Modal Component ---
const ReportsModal = ({ isOpen, onClose, appointments, doctorProfile }) => {
    
    // Calculate Stats Real-Time
    const totalConsultations = appointments.filter(a => a.status === 'Accepted' || a.status === 'Completed').length;
    const pendingRequests = appointments.filter(a => a.status === 'Pending').length;
    
    // Revenue Calculation (assuming 500 if undefined, ideally fetched from app context or doctor profile)
    // We will use the doctorProfile.consultationFee if available, else 500.
    const fee = doctorProfile?.consultationFee || 500;
    const revenue = totalConsultations * fee;
    
    // Consultation Hours (Assuming 30 mins per consultation)
    const hours = (totalConsultations * 30) / 60;

    const stats = [
        { label: "Total Revenue", value: `₹${revenue.toLocaleString()}`, change: "Since inception", icon: DollarSign, color: "text-green-500", bg: "bg-green-500/10" },
        { label: "Accepted Visits", value: totalConsultations, change: `${pendingRequests} Pending`, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
        { label: "Consultation Hours", value: `${hours}h`, change: "Estimated", icon: Clock, color: "text-purple-500", bg: "bg-purple-500/10" },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-border/50">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                        <TrendingUp className="w-6 h-6 text-blue-600" /> Practice Analytics
                    </DialogTitle>
                    <DialogDescription>
                        Overview of your practice based on current appointment data.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-6 py-4">
                    {/* Top Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {stats.map((stat, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-4 rounded-2xl border bg-card/50 shadow-sm flex flex-col gap-2"
                            >
                                <div className="flex justify-between items-start">
                                    <div className={`p-2 rounded-xl ${stat.bg}`}>
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                    </div>
                                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full flex items-center">
                                        {stat.change}
                                    </span>
                                </div>
                                <div>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Reviews Section */}
                    <div>
                        <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                            <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" /> Patient Reviews
                        </h3>
                        <div className="space-y-3">
                            {doctorProfile?.reviews?.length > 0 ? (
                                doctorProfile.reviews.map((review, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + (i * 0.05) }}
                                        className="p-3 rounded-xl bg-muted/30 border border-border/50 text-sm"
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold">{review.name}</span>
                                            <div className="flex items-center text-yellow-500">
                                                <span className="font-bold mr-1">{review.rating}</span> <Star size={12} fill="currentColor"/>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground">{review.comment}</p>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground bg-muted/20 rounded-xl">
                                    No reviews yet. Completed appointments will appear here once rated.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

// --- Main Doctor Dashboard ---
const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctorProfile, setDoctorProfile] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [isReportsOpen, setIsReportsOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    // Dynamic Greeting
    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

    useEffect(() => {
        fetchAppointments();
        fetchDoctorProfile();
    }, []);

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    const fetchDoctorProfile = async () => {
        try {
            // Assuming this endpoint returns the full profile with reviews as confirmed earlier
            const { data } = await api.get('/doctors/profile'); 
            setDoctorProfile(data); // This should have reviews array
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await api.put(`/appointments/${id}/status`, { status });
            toast.success(`Appointment ${status}`);
            fetchAppointments();
        } catch (error) {
            toast.error("Status update failed");
        }
    };

    const handleJoinCall = (appointmentId) => {
        navigate(`/doctor/call/${appointmentId}`);
    };

    const pendingCount = appointments.filter(a => a.status === 'Pending').length;
    const upcomingCount = appointments.filter(a => a.status === 'Accepted').length;
    const totalPatients = new Set(appointments.map(a => a.patient?._id)).size;
    
    // Extract unique patients from appointments
    const patientsMap = new Map();
    appointments.forEach(app => {
        if (app.patient && !patientsMap.has(app.patient._id)) {
            patientsMap.set(app.patient._id, app.patient);
        }
    });
    const patientsList = Array.from(patientsMap.values());

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    return (
        <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen">
             <ReportsModal 
                isOpen={isReportsOpen} 
                onClose={() => setIsReportsOpen(false)} 
                appointments={appointments}
                doctorProfile={doctorProfile}
             />

             {/* Header Section */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                     <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        {greeting}, <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Dr. {user?.name?.split(' ')[0]}</span>
                     </h1>
                     <p className="text-muted-foreground mt-2 text-lg">Your daily overview and schedule.</p>
                </motion.div>
                 <div className="flex gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none rounded-full h-10 px-6 backdrop-blur-sm bg-background/50" onClick={() => navigate('/doctor/schedule')}>
                        <Calendar className="mr-2 h-4 w-4" /> Schedule
                    </Button>
                    <Button className="flex-1 md:flex-none rounded-full h-10 px-6 shadow-lg shadow-blue-500/20" onClick={() => setIsReportsOpen(true)}>
                        <BarChart3 className="mr-2 h-4 w-4" /> Reports
                    </Button>
                 </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-muted/50 p-1 rounded-full inline-flex">
                    <TabsTrigger value="overview" className="rounded-full px-6">Overview</TabsTrigger>
                    <TabsTrigger value="appointments" className="rounded-full px-6">Appointments</TabsTrigger>
                    <TabsTrigger value="patients" className="rounded-full px-6">Patients</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 focus-visible:outline-none">
                    <motion.div 
                        variants={container} 
                        initial="hidden" 
                        animate="show"
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
                    >
                        <StatCard title="Total Patients" value={totalPatients} icon={<Users size={20} className="text-blue-500" />} bg="bg-blue-500/10" delay={0} />
                        <StatCard title="Pending Requests" value={pendingCount} icon={<Activity size={20} className="text-orange-500" />} bg="bg-orange-500/10" delay={0.1} />
                        <StatCard title="Upcoming Visits" value={upcomingCount} icon={<Calendar size={20} className="text-green-500" />} bg="bg-green-500/10" delay={0.2} />
                        <StatCard title="Practice Rating" value="4.9" icon={<Star size={20} className="text-yellow-500" />} bg="bg-yellow-500/10" delay={0.3} />
                    </motion.div>

                    <Card className="col-span-4 shadow-sm border-border/50">
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>
                                You have {pendingCount} pending request{pendingCount !== 1 ? 's' : ''} requiring attention.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                             <AppointmentList 
                                appointments={appointments.slice(0, 5)} 
                                handleStatusUpdate={handleStatusUpdate} 
                                handleJoinCall={handleJoinCall}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appointments" className="space-y-4 focus-visible:outline-none">
                     <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>All Appointments</CardTitle>
                            <CardDescription>Manage your complete schedule.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AppointmentList 
                                appointments={appointments} 
                                handleStatusUpdate={handleStatusUpdate} 
                                handleJoinCall={handleJoinCall}
                            />
                        </CardContent>
                     </Card>
                </TabsContent>
                
                <TabsContent value="patients" className="focus-visible:outline-none">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader>
                            <CardTitle>My Patients ({patientsList.length})</CardTitle>
                            <CardDescription>Patients you have consulted with.</CardDescription>
                        </CardHeader>
                         <CardContent>
                            {patientsList.length > 0 ? (
                                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {patientsList.map((patient, i) => (
                                        <motion.div 
                                            key={patient._id} 
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: i * 0.05 }}
                                        >
                                            <Card className="bg-muted/30 border-0 hover:bg-muted/50 transition-colors">
                                                <CardContent className="p-4 flex items-center gap-4">
                                                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 h-12 w-12 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                                        <span className="font-bold text-lg">{patient.name.charAt(0)}</span>
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-lg">{patient.name}</p>
                                                        <p className="text-xs text-muted-foreground capitalize">{patient.gender || 'Unknown'}, {patient.age || '?'} Years</p>
                                                        <p className="text-xs text-muted-foreground mt-1">{patient.email}</p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-center py-8">No patients found from your appointment history.</p>
                            )}
                         </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
};

const StatCard = ({ title, value, icon, bg, delay }) => (
    <motion.div variants={{ hidden: { y: 20, opacity: 0 }, show: { y: 0, opacity: 1 } }}>
        <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-all duration-300">
            <CardContent className="p-6">
                <div className="flex items-center justify-between space-y-0.5">
                    <div className={bg ? `p-3 rounded-2xl ${bg}` : "p-3 rounded-2xl bg-primary/10"}>
                        {icon}
                    </div>
                    {/* Trend indicator placeholder */}
                    <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">+2.5%</div>
                </div>
                <div className="mt-4">
                    <div className="text-3xl font-bold tracking-tight">{value}</div>
                    <p className="text-xs text-muted-foreground font-medium mt-1">{title}</p>
                </div>
            </CardContent>
        </Card>
    </motion.div>
)

const AppointmentList = ({ appointments, handleStatusUpdate, handleJoinCall }) => (
    <div className="space-y-3">
         {appointments.length === 0 ? <p className="text-muted-foreground text-center py-8">No appointments found.</p> : null}
         <AnimatePresence>
            {appointments.map(app => {
                const dateObj = app.date ? new Date(app.date) : new Date();
                const dateStr = !isNaN(dateObj) ? dateObj.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : 'Invalid Date';
                
                // Logic to check if past
                const appDateTime = new Date(`${app.date}T${app.time}`);
                const isPast = appDateTime < new Date();
                const displayStatus = (app.status === 'Accepted' && isPast) ? 'Completed' : app.status;

                return (
                <motion.div 
                    key={app._id} 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className="group flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-2xl bg-card hover:shadow-md hover:border-primary/20 transition-all duration-300 gap-4"
                >
                    <div className="flex items-start md:items-center gap-4 w-full md:w-auto">
                        <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-0.5 rounded-full shrink-0">
                             <div className="bg-white dark:bg-black p-3 rounded-full">
                                <User size={20} className="text-gray-600 dark:text-gray-400" />
                             </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-bold text-lg truncate pr-2">{app.patient?.name || 'Unknown Patient'}</div>
                            {/* Mobile-Optimized Metadata Layout */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1.5"><Calendar size={14} className="text-blue-500"/> {dateStr}</span>
                                <span className="flex items-center gap-1.5"><Clock size={14} className="text-orange-500"/> {app.time || '--:--'}</span>
                                <span className="flex items-center gap-1.5 font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full text-xs">
                                    <DollarSign size={10}/> Paid
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto mt-2 md:mt-0">
                         <div className="flex justify-between items-center sm:hidden w-full mb-2">
                            <Badge 
                                variant={displayStatus === 'Accepted' ? 'success' : displayStatus === 'Pending' ? 'warning' : displayStatus === 'Completed' ? 'default' : 'destructive'}
                                className="capitalize px-3 py-1 text-xs"
                            >
                                {displayStatus}
                            </Badge>
                         </div>
                         <Badge 
                            variant={displayStatus === 'Accepted' ? 'success' : displayStatus === 'Pending' ? 'warning' : displayStatus === 'Completed' ? 'default' : 'destructive'}
                            className="hidden sm:flex capitalize px-3 py-1"
                        >
                            {displayStatus}
                        </Badge>

                        <div className="flex gap-2 w-full sm:w-auto">
                            {displayStatus === 'Pending' && (
                                <>
                                    <Button size="sm" className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg shadow-green-500/20" onClick={() => handleStatusUpdate(app._id, 'Accepted')}>
                                        <Check size={16} className="mr-1"/> Accept
                                    </Button>
                                    <Button size="sm" variant="destructive" className="flex-1 sm:flex-none rounded-xl" onClick={() => handleStatusUpdate(app._id, 'Cancelled')}>
                                        <X size={16} className="mr-1"/> Reject
                                    </Button>
                                </>
                            )}
                            {displayStatus === 'Accepted' && (
                               <>
                                 <Button onClick={() => handleJoinCall(app._id)} className="flex-1 sm:flex-none w-full md:w-auto gap-2 rounded-xl shadow-lg shadow-blue-500/20">
                                     <Video className="w-4 h-4" /> Start Call
                                 </Button>
                                 <div className="flex-1 sm:flex-none">
                                     <PrescriptionModal 
                                         patientId={app.patient._id} 
                                         appointmentId={app._id}
                                         patientName={app.patient.name}
                                     />
                                 </div>
                               </>
                            )}
                            {/* If completed, maybe show prescription update only? Or nothing. User said 'shouldn't have video call' */}
                             {displayStatus === 'Completed' && (
                                 <div className="flex-1 sm:flex-none">
                                     <PrescriptionModal 
                                         patientId={app.patient._id} 
                                         appointmentId={app._id}
                                         patientName={app.patient.name}
                                     />
                                 </div>
                            )}
                        </div>
                    </div>
                </motion.div>
             )})}
         </AnimatePresence>
    </div>
)

export default DoctorDashboard;
