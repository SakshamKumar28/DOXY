import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '../components/ui/tabs';
import { motion } from 'framer-motion';

const Register = () => {
  const [role, setRole] = useState('patient');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'Male',
    address: '',
    specialization: '',
    experience: '',
    consultationFee: '', 
    availabilityDay: 'Monday',
    availabilityStart: '09:00',
    availabilityEnd: '17:00'
  });
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);
    const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role,
        ...(role === 'patient' && {
            age: formData.age,
            gender: formData.gender,
            address: formData.address
        }),
        ...(role === 'doctor' && {
            specialization: formData.specialization,
            experience: formData.experience,
            consultationFee: formData.consultationFee,
            availability: [{
                day: formData.availabilityDay,
                startTime: formData.availabilityStart,
                endTime: formData.availabilityEnd
            }]
        })
    };

    const success = await register(userData);
    if (success) {
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-10 bg-gray-50/50 dark:bg-black/20 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-green-100/40 dark:bg-green-900/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-blue-100/40 dark:bg-blue-900/10 rounded-full blur-3xl -z-10" />

        <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: 1, scale: 1 }}
             transition={{ duration: 0.4, ease: "easeOut" }}
             className="w-full max-w-2xl"
        >
             <div className="text-center mb-8">
                <Link to="/" className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                    DOXY
                </Link>
                <p className="text-muted-foreground mt-2">Create your account</p>
            </div>

            <Tabs value={role} onValueChange={setRole} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                    <TabsTrigger value="patient" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">Patient</TabsTrigger>
                    <TabsTrigger value="doctor" className="rounded-full data-[state=active]:bg-white data-[state=active]:shadow-sm dark:data-[state=active]:bg-gray-700">Doctor</TabsTrigger>
                </TabsList>

                <Card className="border-border/50 shadow-medium backdrop-blur-sm bg-white/80 dark:bg-gray-900/80">
                    <CardHeader className="pb-6">
                        <CardTitle className="text-xl font-bold">Get Started</CardTitle>
                        <CardDescription>
                            Join DOXY as a {role} to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input name="name" id="name" required value={formData.name} onChange={handleChange} placeholder="John Doe" className="bg-gray-50/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input name="email" id="email" type="email" required value={formData.email} onChange={handleChange} placeholder="name@example.com" className="bg-gray-50/50" />
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input name="password" id="password" type="password" required value={formData.password} onChange={handleChange} className="bg-gray-50/50" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input name="confirmPassword" id="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="bg-gray-50/50" />
                                </div>
                            </div>

                            {role === 'patient' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800"
                                >
                                     <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="age">Age</Label>
                                            <Input name="age" id="age" type="number" required value={formData.age} onChange={handleChange} placeholder="25" className="bg-gray-50/50" />
                                        </div>
                                         <div className="space-y-2">
                                            <Label htmlFor="gender">Gender</Label>
                                            <select 
                                                name="gender" 
                                                className="flex h-11 w-full rounded-xl border border-input bg-gray-50/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                                                value={formData.gender}
                                                onChange={handleChange}
                                            >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address</Label>
                                        <Input name="address" id="address" required value={formData.address} onChange={handleChange} placeholder="123 Main St" className="bg-gray-50/50" />
                                    </div>
                                </motion.div>
                            )}

                            {role === 'doctor' && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="specialization">Specialization</Label>
                                        <Input name="specialization" id="specialization" required value={formData.specialization} onChange={handleChange} placeholder="e.g. Cardiologist" className="bg-gray-50/50" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="experience">Experience (Years)</Label>
                                            <Input name="experience" id="experience" type="number" required value={formData.experience} onChange={handleChange} placeholder="5" className="bg-gray-50/50" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="consultationFee">Consultation Fees ($)</Label>
                                            <Input name="consultationFee" id="consultationFee" type="number" required value={formData.consultationFee} onChange={handleChange} placeholder="50" className="bg-gray-50/50" />
                                        </div>
                                    </div>
                                    
                                     <div className="space-y-2">
                                        <Label>Availability (Default)</Label>
                                        <div className="grid grid-cols-3 gap-2">
                                            <Input name="availabilityDay" value={formData.availabilityDay} onChange={handleChange} placeholder="Day" className="bg-gray-50/50" />
                                            <Input name="availabilityStart" type="time" value={formData.availabilityStart} onChange={handleChange} className="bg-gray-50/50" />
                                            <Input name="availabilityEnd" type="time" value={formData.availabilityEnd} onChange={handleChange} className="bg-gray-50/50" />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <Button className="w-full mt-6 h-11 text-base rounded-xl shadow-lg" disabled={loading}>
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>
                        </form>
                    </CardContent>
                    <CardFooter className="pt-2">
                         <div className="text-center text-sm w-full text-muted-foreground">
                            Already have an account?{" "}
                            <Link to="/login" className="font-semibold text-blue-600 hover:underline">
                                Login
                            </Link>
                        </div>
                    </CardFooter>
                </Card>
            </Tabs>
        </motion.div>
    </div>
  );
};

export default Register;
