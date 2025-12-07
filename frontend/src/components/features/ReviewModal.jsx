import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea'; // Assuming you have a Textarea component or use standard textarea
import { Star } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, doctorId, doctorName, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setLoading(true);
        try {
            await api.post(`/doctors/${doctorId}/reviews`, { rating, comment });
            toast.success("Review submitted successfully!");
            if (onReviewSubmitted) onReviewSubmitted();
            onClose();
            // Reset form
            setRating(0);
            setComment('');
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to submit review");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Rate Dr. {doctorName}</DialogTitle>
                    <DialogDescription>
                        Share your experience with this doctor.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                className="focus:outline-none transition-transform hover:scale-110"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                            >
                                <Star
                                    size={32}
                                    className={`${
                                        star <= (hoverRating || rating)
                                            ? "fill-yellow-400 text-yellow-400"
                                            : "text-gray-300"
                                    } transition-colors`}
                                />
                            </button>
                        ))}
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="comment">Comment</Label>
                        <Textarea
                            id="comment"
                            placeholder="Tell us about your consultation..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            required
                            className="min-h-[100px] rounded-xl resize-none"
                        />
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button type="submit" onClick={handleSubmit} disabled={loading || rating === 0}>
                        {loading ? 'Submitting...' : 'Submit Review'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ReviewModal;
