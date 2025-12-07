import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import api from '../services/api';

const DoctorSchedule = () => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // Initialize with empty slots for all days
    const [availability, setAvailability] = useState(
        daysOfWeek.map(day => ({ day, slots: [] }))
    );
    const [loading, setLoading] = useState(true);

    const [showAddModal, setShowAddModal] = useState(false);
    const [newSlot, setNewSlot] = useState({ day: 'Monday', time: '' });

    useEffect(() => {
        fetchAvailability();
    }, []);

    const fetchAvailability = async () => {
        try {
            const { data } = await api.get('/doctors/profile');
            if (data.availability && data.availability.length > 0) {
                // Merge fetched availability with default structure to ensure all days exist
                const merged = daysOfWeek.map(day => {
                    const found = data.availability.find(a => a.day === day);
                    return found ? { day, slots: found.slots || [] } : { day, slots: [] };
                });
                setAvailability(merged);
            }
        } catch (error) {
            console.error("Failed to fetch schedule", error);
            toast.error("Failed to load schedule");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await api.put('/doctors/availability', { availability });
            toast.success("Schedule updated successfully!");
        } catch (error) {
            console.error("Failed to save", error);
            toast.error("Failed to save schedule");
        }
    };

    const handleAddSlot = () => {
        if (!newSlot.time) return;
        const updated = availability.map(a => {
            if (a.day === newSlot.day) {
                // Prevent duplicates
                if (a.slots.includes(newSlot.time)) return a;
                return { ...a, slots: [...a.slots, newSlot.time].sort() };
            }
            return a;
        });
        setAvailability(updated);
        setShowAddModal(false);
        setNewSlot({ day: 'Monday', time: '' });
    };

    const removeSlot = (day, slotToRemove) => {
        const updated = availability.map(a => {
            if (a.day === day) {
                return { ...a, slots: a.slots.filter(s => s !== slotToRemove) };
            }
            return a;
        });
        setAvailability(updated);
    };

    if (loading) return <div className="p-8 text-center">Loading schedule...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Schedule Management</h1>
                    <p className="text-muted-foreground">Manage your weekly availability.</p>
                </div>
                <div className="flex gap-2">
                     <Button variant="outline" onClick={handleSave} className="border-green-200 hover:bg-green-50 text-green-700">
                        Save Changes
                    </Button>
                    <Button onClick={() => setShowAddModal(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Add Slot
                    </Button>
                </div>
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <Card className="w-full max-w-md bg-background">
                        <CardHeader>
                            <CardTitle>Add Availability Slot</CardTitle>
                            <CardDescription>Select day and time.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Day</label>
                                <select 
                                    className="w-full p-2 border rounded-md bg-background"
                                    value={newSlot.day}
                                    onChange={(e) => setNewSlot({...newSlot, day: e.target.value})}
                                >
                                    {availability.map(d => <option key={d.day} value={d.day}>{d.day}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Time (e.g. 09:00 AM)</label>
                                <input 
                                    type="text" 
                                    placeholder="09:00 AM" 
                                    className="w-full p-2 border rounded-md bg-background"
                                    value={newSlot.time}
                                    onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                                />
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
                                <Button onClick={handleAddSlot}>Add Slot</Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {availability.map((dayPlan, index) => (
                    <Card key={index}>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2">
                                <CalendarIcon className="h-5 w-5 text-primary" />
                                {dayPlan.day}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {dayPlan.slots.map((slot, idx) => (
                                    <Badge key={idx} variant="secondary" className="px-3 py-1 flex items-center gap-1 group/badge pr-1">
                                        <Clock className="w-3 h-3" /> {slot}
                                        <button 
                                            onClick={() => removeSlot(dayPlan.day, slot)}
                                            className="ml-1 p-0.5 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 opacity-0 group-hover/badge:opacity-100 transition-opacity"
                                        >
                                           <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 18 18"/></svg>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
            
            {/* Calendar View */}
            <Card className="border-black/5 dark:border-white/10 shadow-soft">
                <CardHeader>
                    <CardTitle>Calendar Overview</CardTitle>
                    <CardDescription>Your schedule for {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border border-black/5 dark:border-white/10">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="bg-background p-2 text-center text-sm font-medium text-muted-foreground">
                                {day}
                            </div>
                        ))}
                        {(() => {
                            const today = new Date();
                            const year = today.getFullYear();
                            const month = today.getMonth();
                            const firstDay = new Date(year, month, 1).getDay();
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            const days = [];

                            // Empty slots for days before the 1st
                            for (let i = 0; i < firstDay; i++) {
                                days.push(<div key={`empty-${i}`} className="bg-background h-24 sm:h-32" />);
                            }

                            // Days of the month
                            for (let day = 1; day <= daysInMonth; day++) {
                                const date = new Date(year, month, day);
                                const dayName = date.toLocaleString('en-US', { weekday: 'long' });
                                const isAvailable = availability.some(a => a.day === dayName);
                                const isToday = day === today.getDate();

                                days.push(
                                    <div key={day} className={`bg-background h-24 sm:h-32 p-2 relative group transition-colors hover:bg-muted/50 ${isToday ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                                        <div className="flex justify-between items-start">
                                            <span className={`text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full ${isToday ? 'bg-blue-600 text-white' : 'text-muted-foreground'}`}>
                                                {day}
                                            </span>
                                            {isAvailable && (
                                                <span className="h-2 w-2 rounded-full bg-green-500 shadow-sm" title="Available"></span>
                                            )}
                                        </div>
                                        
                                        {isAvailable && (
                                            <div className="mt-2 space-y-1">
                                                {availability.find(a => a.day === dayName)?.slots.slice(0, 2).map((slot, idx) => (
                                                    <div key={idx} className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded border border-green-200 dark:border-green-900/50 truncate">
                                                        {slot}
                                                    </div>
                                                ))}
                                                {(availability.find(a => a.day === dayName)?.slots.length || 0) > 2 && (
                                                     <div className="text-[10px] px-1.5 text-muted-foreground">
                                                        +{(availability.find(a => a.day === dayName)?.slots.length || 0) - 2} more
                                                     </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            }
                            return days;
                        })()}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DoctorSchedule;
