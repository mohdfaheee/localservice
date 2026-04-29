import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, ArrowRight, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/types/database";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface BookingModalProps {
  service: Service;
  open: boolean;
  onClose: () => void;
}

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const dates = [
  { day: "Mon", date: "Apr 20" },
  { day: "Tue", date: "Apr 21" },
  { day: "Wed", date: "Apr 22" },
  { day: "Thu", date: "Apr 23" },
  { day: "Fri", date: "Apr 24" },
];

const BookingModal = ({ service, open, onClose }: BookingModalProps) => {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [bookingLoading, setBookingLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  if (!open) return null;

  const handleConfirm = async () => {
    if (!user) {
      toast({ title: "Authentication required", description: "Please login to book a service" });
      return;
    }
    
    setBookingLoading(true);
    const bookingData = {
      user_id: user.id,
      service_id: service.id,
      service_title: service.name,
      provider: service.provider,
      date: selectedDate,
      time: selectedTime,
      price: service.price,
      notes: null
    };

    try {
      try {
        await api.createBooking({ ...bookingData, status: "pending", notes: `Payment: ${paymentMethod}` });
      } catch (err: unknown) {
        const e = err as Error;
        await api.createBooking({ ...bookingData, status: "upcoming", notes: `Payment: ${paymentMethod}` });
      }
      setStep(4);
    } catch (err: unknown) {
      const e = err as Error;
      toast({ title: "Request Failed", description: e.message, variant: "destructive" });
    } finally {
      setBookingLoading(false);
    }
  };

  const steps = [
    // Step 0: Date
    <motion.div key="date" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" /> Step 1: Select Date
      </h3>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex flex-col items-center px-4 py-3 rounded-xl text-sm transition-all ${
              selectedDate === d.date
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            <span className="text-xs font-medium opacity-80">{d.day}</span>
            <span className="font-semibold mt-0.5">{d.date.split(" ")[1]}</span>
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 1: Time
    <motion.div key="time" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" /> Step 2: Select Time
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {timeSlots.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTime(t)}
            className={`px-3 py-3 rounded-xl text-sm font-medium transition-all ${
              selectedTime === t
                ? "gradient-primary text-primary-foreground shadow-glow"
                : "bg-secondary text-secondary-foreground hover:bg-primary/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 2: Payment (Dummy)
    <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 className="font-semibold text-foreground mb-4">Step 3: Payment Method</h3>
      <div className="space-y-3">
        {["Cash After Service", "Google Pay / UPI", "Credit/Debit Card"].map((method) => (
          <button
            key={method}
            onClick={() => setPaymentMethod(method)}
            className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
              paymentMethod === method ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:bg-secondary"
            }`}
          >
            <span className="text-sm font-medium">{method}</span>
            <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === method ? "border-primary bg-primary" : "border-muted-foreground"}`} />
          </button>
        ))}
      </div>
    </motion.div>,

    // Step 3: Confirm
    <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 className="font-semibold text-foreground mb-4">Step 4: Confirm Details</h3>
      <div className="bg-secondary rounded-xl p-4 space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium text-foreground">{service.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Payment</span>
          <span className="font-medium text-foreground">{paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Schedule</span>
          <span className="font-medium text-foreground">{selectedDate} at {selectedTime}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-semibold text-foreground text-lg">Total</span>
          <span className="font-bold text-foreground text-lg text-primary">₹{service.price}</span>
        </div>
      </div>
    </motion.div>,

    // Step 4: Success
    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
        className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      <h3 className="text-xl font-bold text-foreground mb-2">Booking Success!</h3>
      <p className="text-muted-foreground text-sm mb-4">
        Your request has been sent to {service.provider}.
      </p>
      <div className="bg-secondary rounded-xl p-3 text-sm font-medium text-primary">
        {selectedDate} • {selectedTime}
      </div>
    </motion.div>,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-foreground/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.95 }}
        className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-glow"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        {/* Progress */}
        {step < 4 && (
          <div className="flex gap-2 mb-6">
            {[0, 1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? "gradient-primary" : "bg-secondary"
                }`}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">{steps[step]}</AnimatePresence>

        {step < 4 && (
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={() => step === 3 ? handleConfirm() : setStep(step + 1)}
              disabled={(step === 0 && !selectedDate) || (step === 1 && !selectedTime) || bookingLoading}
              className="flex-1 gradient-primary text-primary-foreground border-0"
            >
              {step === 3 ? (bookingLoading ? "Finalizing..." : "Confirm Booking") : "Next"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <Button onClick={onClose} className="w-full gradient-primary text-primary-foreground border-0 mt-4">
            Done
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;
