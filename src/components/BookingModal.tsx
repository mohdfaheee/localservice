import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, CheckCircle2, ArrowRight, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Service } from "@/data/mockData";

interface BookingModalProps {
  service: Service;
  open: boolean;
  onClose: () => void;
}

const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"];
const dates = [
  { day: "Mon", date: "Mar 30" },
  { day: "Tue", date: "Mar 31" },
  { day: "Wed", date: "Apr 1" },
  { day: "Thu", date: "Apr 2" },
  { day: "Fri", date: "Apr 3" },
];

const BookingModal = ({ service, open, onClose }: BookingModalProps) => {
  const [step, setStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  if (!open) return null;

  const steps = [
    // Step 0: Date/Time
    <motion.div key="datetime" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Calendar className="w-4 h-4 text-primary" /> Select Date
      </h3>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {dates.map((d) => (
          <button
            key={d.date}
            onClick={() => setSelectedDate(d.date)}
            className={`flex flex-col items-center px-4 py-3 rounded-xl text-sm transition-all shrink-0 ${
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

      <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary" /> Select Time
      </h3>
      <div className="grid grid-cols-3 gap-2">
        {timeSlots.map((t) => (
          <button
            key={t}
            onClick={() => setSelectedTime(t)}
            className={`px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
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

    // Step 1: Confirm
    <motion.div key="confirm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <h3 className="font-semibold text-foreground mb-4">Confirm Booking</h3>
      <div className="bg-secondary rounded-xl p-4 space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Service</span>
          <span className="font-medium text-foreground">{service.title}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Provider</span>
          <span className="font-medium text-foreground">{service.provider}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Date</span>
          <span className="font-medium text-foreground">{selectedDate}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Time</span>
          <span className="font-medium text-foreground">{selectedTime}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-semibold text-foreground">Total</span>
          <span className="font-bold text-foreground">${service.price}</span>
        </div>
      </div>
    </motion.div>,

    // Step 2: Success
    <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
        className="w-16 h-16 rounded-full gradient-primary flex items-center justify-center mx-auto mb-4"
      >
        <CheckCircle2 className="w-8 h-8 text-primary-foreground" />
      </motion.div>
      <h3 className="text-xl font-bold text-foreground mb-2">Booking Confirmed!</h3>
      <p className="text-muted-foreground text-sm mb-2">
        {service.title} with {service.provider}
      </p>
      <p className="text-sm font-medium text-primary">{selectedDate} at {selectedTime}</p>
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
        {step < 2 && (
          <div className="flex gap-2 mb-6">
            {[0, 1].map((s) => (
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

        {step < 2 && (
          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-1" /> Back
              </Button>
            )}
            <Button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && (!selectedDate || !selectedTime)}
              className="flex-1 gradient-primary text-primary-foreground border-0"
            >
              {step === 1 ? "Confirm Booking" : "Continue"} <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <Button onClick={onClose} className="w-full gradient-primary text-primary-foreground border-0 mt-4">
            Done
          </Button>
        )}
      </motion.div>
    </div>
  );
};

export default BookingModal;
