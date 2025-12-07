
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import toast from 'react-hot-toast';
import { Lock, User, Briefcase, DollarSign } from 'lucide-react';

const Settings = () => {
    const { user, updateUserProfile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '', // User only
        address: '', // User only
        age: '', // User only
        gender: '', // User only
        specialization: '', // Doctor only
        experience: '', // Doctor only
        consultationFee: '', // Doctor only
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const endpoint = user.role === 'doctor' ? '/doctors/profile' : '/users/profile';
                const { data } = await api.get(endpoint);
                
                // Populate form
                setFormData({
                    name: data.name || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    address: data.address || '',
                    age: data.age || '',
                    gender: data.gender || '',
                    specialization: data.specialization || '',
                    experience: data.experience || '',
                    consultationFee: data.consultationFee || ''
                });
            } catch (error) {
                toast.error("Failed to load profile");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        
        if (user) fetchProfile();
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            const endpoint = user.role === 'doctor' ? '/doctors/profile' : '/users/profile';
            const { data } = await api.put(endpoint, formData);
            
            updateUserProfile(data);
            toast.success("Profile updated successfully");
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Loading settings...</div>;

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
            
            <form onSubmit={handleSubmit}>
                <Card className="border-0 shadow-lg">
                    <CardHeader className="bg-muted/30 rounded-t-xl border-b">
                        <CardTitle className="flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Profile Information
                        </CardTitle>
                        <CardDescription>Update your personal details here.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" value={formData.name} onChange={handleChange} required className="rounded-xl" />
                            </div>
                            <div className="space-y-2 opacity-70">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="email">Email</Label>
                                    <Lock className="w-3 h-3 text-muted-foreground" />
                                </div>
                                <Input id="email" type="email" value={formData.email} disabled className="bg-muted/50 rounded-xl cursor-not-allowed" />
                                <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                            </div>
                        </div>

                        {user.role === 'patient' && (
                            <>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="age">Age</Label>
                                        <Input id="age" type="number" value={formData.age} onChange={handleChange} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="gender">Gender</Label>
                                        <Input id="gender" value={formData.gender} onChange={handleChange} className="rounded-xl" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input id="phone" value={formData.phone} onChange={handleChange} className="rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Textarea id="address" value={formData.address} onChange={handleChange} className="rounded-xl min-h-[100px]" />
                                </div>
                            </>
                        )}

                        {user.role === 'doctor' && (
                            <>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-2 opacity-70">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="specialization">Specialization</Label>
                                            <Lock className="w-3 h-3 text-muted-foreground" />
                                        </div>
                                        <Input id="specialization" value={formData.specialization} disabled className="bg-muted/50 rounded-xl cursor-not-allowed" />
                                        <p className="text-[10px] text-muted-foreground">Specialization is verified and locked.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Experience (Years)</Label>
                                        <Input id="experience" type="number" value={formData.experience} onChange={handleChange} className="rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="consultationFee">Consultation Fee (₹)</Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input id="consultationFee" type="number" value={formData.consultationFee} onChange={handleChange} className="pl-9 rounded-xl" />
                                    </div>
                                </div>
                            </>
                        )}

                        <div className="pt-4 flex justify-end">
                            <Button type="submit" disabled={saving} className="rounded-full px-8 shadow-lg shadow-primary/20">
                                {saving ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
};

export default Settings;
