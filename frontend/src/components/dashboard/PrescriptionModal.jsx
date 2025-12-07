import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Plus, Trash2, FileText } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const PrescriptionModal = ({ patientId, appointmentId, patientName, onPrescriptionSent }) => {
    const [open, setOpen] = useState(false);
    const [diagnosis, setDiagnosis] = useState('');
    const [notes, setNotes] = useState('');
    const [medicines, setMedicines] = useState([
        { name: '', dosage: '', frequency: '', duration: '', instructions: '' }
    ]);
    const [loading, setLoading] = useState(false);

    const handleMedicineChange = (index, field, value) => {
        const newMedicines = [...medicines];
        newMedicines[index][field] = value;
        setMedicines(newMedicines);
    };

    const addMedicine = () => {
        setMedicines([...medicines, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
    };

    const removeMedicine = (index) => {
        const newMedicines = medicines.filter((_, i) => i !== index);
        setMedicines(newMedicines);
    };

    const handleSubmit = async () => {
        if (!diagnosis) {
            toast.error('Diagnosis is required');
            return;
        }
        
        // Filter out empty medicines
        const validMedicines = medicines.filter(m => m.name.trim() !== '');
        if (validMedicines.length === 0) {
            toast.error('Please add at least one medicine');
            return;
        }

        setLoading(true);
        try {
            await api.post('/prescriptions', {
                patientId,
                appointmentId,
                diagnosis,
                medicines: validMedicines,
                notes
            });
            toast.success('Prescription sent successfully');
            setOpen(false);
            // Reset form
            setDiagnosis('');
            setNotes('');
            setMedicines([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
            if (onPrescriptionSent) onPrescriptionSent();
        } catch (error) {
            console.error(error);
            toast.error('Failed to send prescription');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <FileText className="w-4 h-4" /> Prescribe
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Write Prescription for {patientName}</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-2">
                        <Label>Diagnosis</Label>
                        <Input 
                            value={diagnosis} 
                            onChange={(e) => setDiagnosis(e.target.value)} 
                            placeholder="e.g. Viral Fever"
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Medicines</Label>
                            <Button type="button" variant="outline" size="sm" onClick={addMedicine} className="gap-2">
                                <Plus className="w-3 h-3" /> Add Medicine
                            </Button>
                        </div>
                        
                        {medicines.map((medicine, index) => (
                            <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 bg-muted/30 rounded-md border">
                                <div className="col-span-12 md:col-span-3 space-y-1">
                                    <Label className="text-xs">Medicine Name</Label>
                                    <Input 
                                        placeholder="Name" 
                                        value={medicine.name}
                                        onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-2 space-y-1">
                                    <Label className="text-xs">Dosage</Label>
                                    <Input 
                                        placeholder="500mg" 
                                        value={medicine.dosage}
                                        onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-2 space-y-1">
                                    <Label className="text-xs">Frequency</Label>
                                    <Input 
                                        placeholder="1-0-1" 
                                        value={medicine.frequency}
                                        onChange={(e) => handleMedicineChange(index, 'frequency', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-2 space-y-1">
                                    <Label className="text-xs">Duration</Label>
                                    <Input 
                                        placeholder="5 days" 
                                        value={medicine.duration}
                                        onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="col-span-6 md:col-span-2 space-y-1">
                                    <Label className="text-xs">Instructions</Label>
                                    <Input 
                                        placeholder="After food" 
                                        value={medicine.instructions}
                                        onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                                        className="h-8 text-sm"
                                    />
                                </div>
                                <div className="col-span-12 md:col-span-1 flex justify-end md:justify-center pb-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                                        onClick={() => removeMedicine(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <Label>Additional Notes</Label>
                        <Input 
                            value={notes} 
                            onChange={(e) => setNotes(e.target.value)} 
                            placeholder="Advice, follow-up, etc."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Prescription'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PrescriptionModal;
