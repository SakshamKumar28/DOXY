import { useState, useEffect } from 'react';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Pill, Calendar, User } from 'lucide-react';
import { motion } from 'framer-motion';

const PatientPrescriptions = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const { data } = await api.get('/prescriptions/my');
                setPrescriptions(data);
            } catch (error) {
                console.error("Failed to load prescriptions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    if (loading) return <div className="p-8">Loading prescriptions...</div>;

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

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
             <header>
                <h1 className="text-3xl font-bold tracking-tight">Prescriptions</h1>
                <p className="text-muted-foreground">Medications prescribed by your doctors.</p>
            </header>

            <motion.div variants={container} initial="hidden" animate="show" className="grid gap-6">
                {prescriptions.length === 0 ? (
                    <Card className="border-dashed py-10 text-center">
                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                            <Pill className="w-10 h-10" />
                            <p>No prescriptions found.</p>
                        </div>
                    </Card>
                ) : (
                    prescriptions.map((pres) => (
                        <motion.div key={pres._id} variants={item}>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl flex items-center gap-2">
                                            <span className="text-primary">{pres.diagnosis}</span>
                                        </CardTitle>
                                        <CardDescription className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <User className="w-4 h-4" /> Dr. {pres.doctor?.name}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" /> 
                                                {new Date(pres.date).toLocaleDateString()}
                                            </span>
                                        </CardDescription>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant="outline">{pres.doctor?.specialization}</Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="mt-4 space-y-4">
                                        <div className="border rounded-md overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="bg-muted text-muted-foreground font-medium">
                                                    <tr>
                                                        <th className="p-3">Medicine</th>
                                                        <th className="p-3">Dosage</th>
                                                        <th className="p-3">Frequency</th>
                                                        <th className="p-3">Duration</th>
                                                        <th className="p-3">Instructions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y">
                                                    {pres.medicines.map((med, idx) => (
                                                        <tr key={idx} className="bg-card">
                                                            <td className="p-3 font-medium">{med.name}</td>
                                                            <td className="p-3">{med.dosage}</td>
                                                            <td className="p-3">{med.frequency}</td>
                                                            <td className="p-3">{med.duration}</td>
                                                            <td className="p-3 text-muted-foreground">{med.instructions}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        {pres.notes && (
                                            <div className="bg-amber-50 dark:bg-amber-900/10 p-4 rounded-md text-sm text-amber-800 dark:text-amber-200">
                                                <strong>Note:</strong> {pres.notes}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))
                )}
            </motion.div>
        </div>
    );
};

export default PatientPrescriptions;
