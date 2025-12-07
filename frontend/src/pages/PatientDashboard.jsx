
import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Video, Calendar, Clock, DollarSign, Activity, ChevronRight, Star, MessageSquare, ThumbsUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { motion } from 'framer-motion';
import BookingModal from '../components/features/BookingModal';
import ReviewModal from '../components/features/ReviewModal';

const PatientDashboard = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const { user } = useAuth();
    const navigate = useNavigate();

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [isBookingOpen, setIsBookingOpen] = useState(false);
    
    // Review Modal State
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [reviewDoctor, setReviewDoctor] = useState(null);

    useEffect(() => {
        fetchDoctors();
        fetchAppointments();
        fetchPrescriptions();
    }, []);

    const fetchDoctors = async () => {
        try {
            const { data } = await api.get('/doctors');
            setDoctors(data);
        } catch (error) {
            console.error("Failed to fetch doctors", error);
        }
    };

    const fetchAppointments = async () => {
        try {
            const { data } = await api.get('/appointments');
            setAppointments(data);
        } catch (error) {
            console.error("Failed to fetch appointments", error);
        }
    };

    const fetchPrescriptions = async () => {
        try {
            const { data } = await api.get('/prescriptions/my');
            setPrescriptions(data);
        } catch (error) {
            console.error("Failed to fetch prescriptions", error);
        }
    };

    const openBookingModal = (doc) => {
        setSelectedDoctor(doc);
        setIsBookingOpen(true);
    }

    const openReviewModal = (doc) => {
        setReviewDoctor(doc);
        setIsReviewOpen(true);
    }

    const handleConfirmBooking = async (doctorId, date, time) => {
        try {
            await api.post('/appointments', { doctorId, date, time });
            toast.success("Appointment request sent!");
            fetchAppointments();
        } catch (error) {
            toast.error(error.response?.data?.message || "Booking failed");
        }
    };

    const handleJoinCall = (appointmentId) => {
        navigate(`/call/${appointmentId}`);
    };

    // Derived State for Bento Grid
    const upcomingAppointment = appointments.find(a => a.status === 'Accepted' && new Date(a.date) >= new Date());
    const pendingAppointments = appointments.filter(a => a.status === 'Pending');

    return (
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto space-y-6">
            <BookingModal 
                isOpen={isBookingOpen} 
                onClose={() => setIsBookingOpen(false)} 
                doctor={selectedDoctor}
                onConfirm={handleConfirmBooking}
            />

            {reviewDoctor && (
                <ReviewModal
                    isOpen={isReviewOpen}
                    onClose={() => setIsReviewOpen(false)}
                    doctorId={reviewDoctor.doctorId}
                    doctorName={reviewDoctor.doctorName}
                />
            )}

            <header className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Health Overview</h1>
                <p className="text-muted-foreground">Welcome back, {user?.name}. Here's what's happening.</p>
            </header>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[minmax(180px,auto)]">
                
                {/* 1. Hero Card: Next Appointment (Span 2 cols) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="md:col-span-2 row-span-1"
                >
                    <Card className="h-full bg-primary text-primary-foreground flex flex-col justify-between border-0 shadow-xl overflow-hidden relative group cursor-pointer hover:shadow-2xl transition-all">
                        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-white/10 transition-colors"></div>
                        <CardHeader className="relative z-10">
                            <CardTitle className="text-xl font-medium opacity-90">Next Consultation</CardTitle>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            {upcomingAppointment ? (
                                <div>
                                    <h3 className="text-3xl font-bold mb-2">{upcomingAppointment.doctor?.name}</h3>
                                    <div className="flex items-center gap-4 text-sm opacity-90">
                                        <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
                                            <Calendar className="w-4 h-4"/> {new Date(upcomingAppointment.date).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded">
                                            <Clock className="w-4 h-4"/> {upcomingAppointment.time}
                                        </span>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6 opacity-80">
                                    <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                    <p className="text-lg">No upcoming video calls</p>
                                    <Button variant="secondary" className="mt-4" onClick={() => document.getElementById('doctors-list').scrollIntoView({ behavior: 'smooth' })}>
                                        Schedule Now
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                        {upcomingAppointment && (() => {
                             const appDate = new Date(`${upcomingAppointment.date}T${upcomingAppointment.time}`);
                             const isPast = appDate < new Date();
                             if (isPast) return null; // Don't show Join button if past

                             return (
                                <CardFooter className="relative z-10">
                                    <Button className="w-full bg-white text-primary hover:bg-white/90" onClick={() => handleJoinCall(upcomingAppointment._id)}>
                                        <Video className="w-4 h-4 mr-2" /> Join Room
                                    </Button>
                                </CardFooter>
                             );
                        })()}
                    </Card>
                </motion.div>

                {/* 2. Stats / Quick Actions (Span 1 col each) */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
                    <Card className="h-full hover:border-primary/50 transition-colors cursor-default group">
                        <CardHeader className="pb-2">
                             <div className="flex justify-between items-start">
                                <CardTitle className="text-lg">Pending</CardTitle>
                                <Activity className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="text-4xl font-bold">{pendingAppointments.length}</div>
                             <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}>
                    <Card className="h-full bg-blue-50/50 hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer group" onClick={() => navigate('/patient/prescriptions')}>
                        <CardHeader className="pb-2">
                             <div className="flex justify-between items-start">
                                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">Prescriptions</CardTitle>
                                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                                    <MessageSquare className="w-4 h-4 text-blue-600" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                             <div className="text-4xl font-bold text-blue-900">{prescriptions.length}</div>
                             <p className="text-xs text-muted-foreground mt-1">Active medications</p>
                             <div className="mt-4 text-xs font-medium text-blue-600 flex items-center group-hover:translate-x-1 transition-transform">
                                View details <ChevronRight className="w-3 h-3 ml-1" />
                             </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 3. Doctors List (Span full width or large area) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                    className="md:col-span-3 lg:col-span-3 row-span-2"
                    id="doctors-list"
                >
                    <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Top Specialists</CardTitle>
                            <CardDescription>Book appointments with available doctors.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto p-4 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {doctors.map((doc, idx) => (
                                    <motion.div 
                                        key={doc._id} 
                                        whileHover={{ y: -5 }}
                                        transition={{ type: 'spring', stiffness: 300 }}
                                    >
                                        <Card className="h-full border border-border/50 hover:border-primary/50 hover:shadow-lg transition-all">
                                            <CardContent className="p-4 space-y-3">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="font-bold text-lg">{doc.name}</h4>
                                                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
                                                            {doc.specialization}
                                                        </span>
                                                    </div>
                                                    <div className="bg-muted p-2 rounded-full">
                                                        <Star size={16} className="text-yellow-500 fill-yellow-500" />
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-1 text-sm text-muted-foreground">
                                                    <div className="flex justify-between">
                                                        <span>Experience</span>
                                                        <span className="font-medium text-foreground">{doc.experience} Years</span>
                                                    </div>
                                                    <div className="flex justify-between">
                                                        <span>Consultation</span>
                                                        <span className="font-medium text-foreground">₹{doc.consultationFee}</span>
                                                    </div>
                                                </div>

                                                <Button className="w-full mt-2 group" onClick={() => openBookingModal(doc)}>
                                                    Book Now <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* 4. Recent List (Right Column) */}
                <motion.div 
                    initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
                    className="lg:col-span-1 lg:row-span-2"
                >
                    <Card className="h-full flex flex-col">
                        <CardHeader>
                            <CardTitle className="text-lg">History</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-1 overflow-auto pr-2">
                             <div className="space-y-4">
                                {appointments.map(app => {
                                    const appDate = new Date(`${app.date}T${app.time}`);
                                    const isPast = appDate < new Date();
                                    const displayStatus = (app.status === 'Accepted' && isPast) ? 'Completed' : app.status;
                                    
                                    return (
                                    <div key={app._id} className="flex flex-col gap-2 p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 mt-2 rounded-full ${displayStatus === 'Accepted' ? 'bg-green-500' : displayStatus === 'Completed' ? 'bg-blue-500' : 'bg-orange-500'}`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{app.doctor?.name}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(app.date).toLocaleDateString()}</p>
                                            </div>
                                            <Badge variant="outline" className="text-[10px] uppercase">{displayStatus}</Badge>
                                        </div>
                                        {/* Review Button if completed/accepted or just past date */}
                                        {(displayStatus === 'Completed' || (app.status === 'Accepted' && isPast)) && (
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                className="w-full h-7 text-xs bg-muted/50 hover:bg-yellow-100 hover:text-yellow-700"
                                                onClick={() => openReviewModal({ doctorId: app.doctor._id, doctorName: app.doctor.name })}
                                            >
                                                <Star className="w-3 h-3 mr-1" /> Rate Doctor
                                            </Button>
                                        )}
                                    </div>
                                )})}
                             </div>
                        </CardContent>
                    </Card>
                </motion.div>

            </div>
        </div>
    );
};

export default PatientDashboard;
